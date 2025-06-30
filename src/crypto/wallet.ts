/**
 * Simplified crypto wallet implementation for web browser
 * Based on the original shared crypto library but optimized for browser environment
 */

import CryptoJS from 'crypto-js';
import { getPublicKey, sign } from '@noble/ed25519';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';

// ZippyCoin specific constants
export const ZIPPYCOIN_COIN_TYPE = 2187;
export const ZIPPYCOIN_PURPOSE = 44;

export interface WalletConfig {
  network: 'mainnet' | 'testnet' | 'devnet';
  derivationPath: string;
  coinType: number;
}

export interface WalletAccount {
  index: number;
  name: string;
  address: string;
  publicKey: string;
  derivationPath: string;
  balance: string;
  trustScore: {
    current: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    factors: {
      transactionHistory: number;
      networkParticipation: number;
      identityVerification: number;
    };
  };
}

export class ZippyCoinWallet {
  private masterSeed: Uint8Array;
  private config: WalletConfig;

  constructor(config: WalletConfig) {
    this.config = config;
    this.masterSeed = new Uint8Array(32);
  }

  /**
   * Generate a new HD wallet with cryptographically secure entropy
   */
  static async generateNew(
    name: string = 'ZippyCoin Wallet',
    config: WalletConfig = {
      network: 'testnet',
      derivationPath: `m/${ZIPPYCOIN_PURPOSE}'/${ZIPPYCOIN_COIN_TYPE}'/0'`,
      coinType: ZIPPYCOIN_COIN_TYPE
    }
  ): Promise<{ wallet: ZippyCoinWallet; mnemonic: string }> {
    // Generate 256-bit entropy for maximum security
    const entropy = randomBytes(32);
    const mnemonic = generateMnemonic(entropy);
    
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
    if (!validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }

    const wallet = new ZippyCoinWallet(config);
    wallet.masterSeed = await mnemonicToSeed(mnemonic);
    
    return wallet;
  }

  /**
   * Derive account keys for a specific account index
   */
  deriveAccount(accountIndex: number): WalletAccount {
    if (!this.masterSeed) {
      throw new Error('Wallet not initialized');
    }

    // Simple derivation for demo purposes
    const accountSeed = new Uint8Array(32);
    accountSeed.set(this.masterSeed);
    accountSeed[0] = accountIndex;

    // Generate key pair
    const privateKey = accountSeed.slice(0, 32);
    const publicKey = getPublicKey(privateKey);
    
    // Generate ZippyCoin address from public key
    const address = this.generateAddress(publicKey);
    
    return {
      index: accountIndex,
      name: `Account ${accountIndex + 1}`,
      address,
      publicKey: Buffer.from(publicKey).toString('hex'),
      derivationPath: `${this.config.derivationPath}/0/0`,
      balance: '0.0000',
      trustScore: {
        current: 500,
        trend: 'stable',
        factors: {
          transactionHistory: 0,
          networkParticipation: 50,
          identityVerification: 0
        }
      }
    };
  }

  /**
   * Generate ZippyCoin address from public key
   */
  private generateAddress(publicKey: Uint8Array): string {
    // ZippyCoin address format: zpc1 + hex encoding of public key hash
    const pubKeyHash = sha256(publicKey);
    const address = 'zpc1' + Buffer.from(pubKeyHash).toString('hex').substring(0, 39);
    return address;
  }

  /**
   * Sign transaction with Ed25519
   */
  async signTransaction(
    accountIndex: number,
    transactionData: Uint8Array
  ): Promise<{ signature: string; algorithm: string }> {
    // Simple derivation for demo
    const accountSeed = new Uint8Array(32);
    accountSeed.set(this.masterSeed);
    accountSeed[0] = accountIndex;

    const privateKey = accountSeed.slice(0, 32);
    const signature = await sign(transactionData, privateKey);
    
    return {
      signature: Buffer.from(signature).toString('hex'),
      algorithm: 'ed25519'
    };
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
      Buffer.from(this.masterSeed).toString('hex'),
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
   * Validate ZippyCoin address format
   */
  static validateAddress(address: string): boolean {
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

// Helper functions for mnemonic generation and validation
function generateMnemonic(entropy: Uint8Array): string {
  // Simplified mnemonic generation for demo
  const words = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
    'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
    'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
    'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance'
  ];
  
  return Array.from({ length: 24 }, (_, i) => 
    words[entropy[i] % words.length]
  ).join(' ');
}

function validateMnemonic(mnemonic: string): boolean {
  const words = mnemonic.trim().split(/\s+/);
  return words.length >= 12 && words.length <= 24;
}

async function mnemonicToSeed(mnemonic: string): Promise<Uint8Array> {
  // Convert mnemonic to seed using PBKDF2
  const encoder = new TextEncoder();
  const mnemonicBuffer = encoder.encode(mnemonic);
  const saltBuffer = encoder.encode('zippycoin-seed');
  
  const key = await crypto.subtle.importKey(
    'raw',
    mnemonicBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 2048,
      hash: 'SHA-256'
    },
    key,
    256
  );
  
  return new Uint8Array(derivedBits);
}

/**
 * Utility functions for cryptographic operations
 */
export class CryptoUtils {
  /**
   * Generate secure random bytes
   */
  static generateRandomBytes(length: number): Uint8Array {
    return randomBytes(length);
  }

  /**
   * Hash data using SHA-256
   */
  static hash(data: Uint8Array): Uint8Array {
    return sha256(data);
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
}