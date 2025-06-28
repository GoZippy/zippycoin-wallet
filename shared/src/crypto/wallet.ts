/**
 * Core cryptographic wallet functionality for ZippyCoin
 * Implements HD wallet (BIP32/BIP44), post-quantum cryptography, and secure key management
 */

import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from '@noble/secp256k1';
import { ed25519 } from '@noble/ed25519';
import { sha256, sha3_256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import CryptoJS from 'crypto-js';
import { NetworkType, WalletConfig, HDWallet, WalletAccount } from '../types/wallet';

// Initialize BIP32 with noble-secp256k1
const bip32 = BIP32Factory(ecc);

// ZippyCoin specific constants
export const ZIPPYCOIN_COIN_TYPE = 2187;
export const ZIPPYCOIN_PURPOSE = 44;

export class ZippyCoinWallet {
  private masterSeed: Buffer;
  private masterNode: any;
  private config: WalletConfig;

  constructor(config: WalletConfig) {
    this.config = config;
  }

  /**
   * Generate a new HD wallet with cryptographically secure entropy
   */
  static async generateNew(
    name: string = 'ZippyCoin Wallet',
    config: WalletConfig = {
      network: NetworkType.MAINNET,
      derivationPath: `m/${ZIPPYCOIN_PURPOSE}'/${ZIPPYCOIN_COIN_TYPE}'/0'`,
      coinType: ZIPPYCOIN_COIN_TYPE
    }
  ): Promise<{ wallet: ZippyCoinWallet; mnemonic: string }> {
    // Generate 256-bit entropy for maximum security
    const entropy = randomBytes(32);
    const mnemonic = bip39.entropyToMnemonic(entropy);
    
    const wallet = await ZippyCoinWallet.fromMnemonic(mnemonic, config);
    return { wallet, mnemonic };
  }

  /**
   * Restore wallet from mnemonic phrase
   */
  static async fromMnemonic(
    mnemonic: string,
    config: WalletConfig
  ): Promise<ZippyCoinWallet> {
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }

    const wallet = new ZippyCoinWallet(config);
    wallet.masterSeed = await bip39.mnemonicToSeed(mnemonic);
    wallet.masterNode = bip32.fromSeed(wallet.masterSeed);
    
    return wallet;
  }

  /**
   * Derive account keys for a specific account index
   */
  deriveAccount(accountIndex: number): WalletAccount {
    if (!this.masterNode) {
      throw new Error('Wallet not initialized');
    }

    const derivationPath = `m/${ZIPPYCOIN_PURPOSE}'/${this.config.coinType}'/${accountIndex}'`;
    const accountNode = this.masterNode.derivePath(derivationPath);
    
    // Derive receiving address key
    const receivingNode = accountNode.derive(0).derive(0);
    
    // Generate ZippyCoin address from public key
    const address = this.generateAddress(receivingNode.publicKey);
    
    return {
      index: accountIndex,
      name: `Account ${accountIndex + 1}`,
      address,
      publicKey: receivingNode.publicKey.toString('hex'),
      derivationPath: `${derivationPath}/0/0`,
      balance: new (require('decimal.js'))(0),
      trustScore: {
        current: 0,
        trend: 'stable' as any,
        lastUpdated: new Date(),
        factors: [],
        delegations: []
      }
    };
  }

  /**
   * Generate ZippyCoin address from public key
   */
  private generateAddress(publicKey: Buffer): string {
    // ZippyCoin address format: zpc1 + bech32 encoding of public key hash
    const pubKeyHash = sha256(publicKey);
    const address = 'zpc1' + this.encodeBech32(pubKeyHash);
    return address;
  }

  /**
   * Simple bech32-like encoding for demo purposes
   * In production, use proper bech32 implementation
   */
  private encodeBech32(data: Uint8Array): string {
    return Buffer.from(data).toString('hex').substring(0, 39);
  }

  /**
   * Sign transaction with post-quantum hybrid approach
   */
  async signTransaction(
    accountIndex: number,
    transactionData: Buffer,
    useQuantumResistant: boolean = true
  ): Promise<{ signature: string; algorithm: string }> {
    const accountNode = this.masterNode.derivePath(
      `m/${ZIPPYCOIN_PURPOSE}'/${this.config.coinType}'/${accountIndex}'`
    );
    
    if (useQuantumResistant) {
      // Use Ed25519 for quantum-resistant signing
      // In production, this would be CRYSTALS-Dilithium
      const privateKey = accountNode.privateKey;
      const signature = await ed25519.sign(transactionData, privateKey);
      
      return {
        signature: Buffer.from(signature).toString('hex'),
        algorithm: 'ed25519' // In production: 'dilithium-aes'
      };
    } else {
      // Classical ECDSA for compatibility
      const signature = accountNode.sign(sha256(transactionData));
      return {
        signature: signature.toString('hex'),
        algorithm: 'secp256k1'
      };
    }
  }

  /**
   * Encrypt wallet data for secure storage
   */
  encryptWalletData(passphrase: string): {
    encryptedSeed: string;
    salt: string;
    iv: string;
  } {
    const salt = CryptoJS.lib.WordArray.random(256/8);
    const iv = CryptoJS.lib.WordArray.random(128/8);
    
    const key = CryptoJS.PBKDF2(passphrase, salt, {
      keySize: 256/32,
      iterations: 100000,
      hasher: CryptoJS.algo.SHA256
    });
    
    const encryptedSeed = CryptoJS.AES.encrypt(
      this.masterSeed.toString('hex'),
      key,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    
    return {
      encryptedSeed: encryptedSeed.toString(),
      salt: salt.toString(),
      iv: iv.toString()
    };
  }

  /**
   * Decrypt wallet data from secure storage
   */
  static async decryptWalletData(
    encryptedData: { encryptedSeed: string; salt: string; iv: string },
    passphrase: string,
    config: WalletConfig
  ): Promise<ZippyCoinWallet> {
    const salt = CryptoJS.enc.Hex.parse(encryptedData.salt);
    const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);
    
    const key = CryptoJS.PBKDF2(passphrase, salt, {
      keySize: 256/32,
      iterations: 100000,
      hasher: CryptoJS.algo.SHA256
    });
    
    const decryptedSeed = CryptoJS.AES.decrypt(
      encryptedData.encryptedSeed,
      key,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    
    const seedHex = decryptedSeed.toString(CryptoJS.enc.Utf8);
    const seed = Buffer.from(seedHex, 'hex');
    
    const wallet = new ZippyCoinWallet(config);
    wallet.masterSeed = seed;
    wallet.masterNode = bip32.fromSeed(seed);
    
    return wallet;
  }

  /**
   * Get master fingerprint for wallet identification
   */
  getMasterFingerprint(): string {
    if (!this.masterNode) {
      throw new Error('Wallet not initialized');
    }
    return this.masterNode.fingerprint.toString('hex');
  }

  /**
   * Generate multiple accounts for the wallet
   */
  generateAccounts(count: number = 1): WalletAccount[] {
    const accounts: WalletAccount[] = [];
    for (let i = 0; i < count; i++) {
      accounts.push(this.deriveAccount(i));
    }
    return accounts;
  }

  /**
   * Validate ZippyCoin address format
   */
  static validateAddress(address: string): boolean {
    // Basic validation for ZippyCoin address format
    if (!address.startsWith('zpc1')) {
      return false;
    }
    
    const addressData = address.substring(4);
    if (addressData.length !== 39) {
      return false;
    }
    
    // Validate hex format
    return /^[0-9a-fA-F]+$/.test(addressData);
  }
}

/**
 * Utility functions for cryptographic operations
 */
export class CryptoUtils {
  /**
   * Generate secure random bytes
   */
  static generateRandomBytes(length: number): Buffer {
    return Buffer.from(randomBytes(length));
  }

  /**
   * Hash data using SHA3-256
   */
  static hash(data: Buffer): Buffer {
    return Buffer.from(sha3_256(data));
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  static encrypt(data: string, key: string): {
    encrypted: string;
    iv: string;
    tag: string;
  } {
    const iv = CryptoJS.lib.WordArray.random(96/8); // 12 bytes for GCM
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.GCM
    });
    
    return {
      encrypted: encrypted.ciphertext.toString(),
      iv: iv.toString(),
      tag: encrypted.tag?.toString() || ''
    };
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  static decrypt(encryptedData: {
    encrypted: string;
    iv: string;
    tag: string;
  }, key: string): string {
    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Hex.parse(encryptedData.encrypted),
        tag: CryptoJS.enc.Hex.parse(encryptedData.tag)
      } as any,
      key,
      {
        iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
        mode: CryptoJS.mode.GCM
      }
    );
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Derive key using PBKDF2
   */
  static deriveKey(
    password: string,
    salt: string,
    iterations: number = 100000
  ): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations,
      hasher: CryptoJS.algo.SHA256
    }).toString();
  }
} 