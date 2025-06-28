/**
 * Core wallet types and interfaces for ZippyCoin wallet application
 */

import { Decimal } from 'decimal.js';

// Network types
export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  DEVNET = 'devnet'
}

// Wallet types
export interface WalletConfig {
  network: NetworkType;
  derivationPath: string;
  coinType: number; // 2187 for ZippyCoin
}

export interface HDWallet {
  id: string;
  name: string;
  createdAt: Date;
  lastUsed: Date;
  masterFingerprint: string;
  accounts: WalletAccount[];
  config: WalletConfig;
}

export interface WalletAccount {
  index: number;
  name: string;
  address: string;
  publicKey: string;
  derivationPath: string;
  balance: Decimal;
  trustScore: TrustScore;
}

// Transaction types
export interface Transaction {
  id: string;
  hash: string;
  type: TransactionType;
  from: string;
  to: string;
  amount: Decimal;
  fee: Decimal;
  timestamp: Date;
  blockHeight: number;
  confirmations: number;
  status: TransactionStatus;
  memo?: string;
  trustDelegation?: TrustDelegation;
}

export enum TransactionType {
  SEND = 'send',
  RECEIVE = 'receive',
  TRUST_DELEGATION = 'trust_delegation',
  TRUST_REVOCATION = 'trust_revocation',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  DEFI_DEPOSIT = 'defi_deposit',
  DEFI_WITHDRAW = 'defi_withdraw'
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// Trust system types
export interface TrustScore {
  current: number; // 0-1000
  trend: TrustTrend;
  lastUpdated: Date;
  factors: TrustFactor[];
  delegations: TrustDelegation[];
}

export interface TrustFactor {
  type: TrustFactorType;
  value: number;
  weight: number;
  description: string;
}

export enum TrustFactorType {
  TRANSACTION_HISTORY = 'transaction_history',
  NETWORK_PARTICIPATION = 'network_participation',
  IDENTITY_VERIFICATION = 'identity_verification',
  SOCIAL_PROOF = 'social_proof',
  TEMPORAL_CONSISTENCY = 'temporal_consistency'
}

export enum TrustTrend {
  INCREASING = 'increasing',
  STABLE = 'stable',
  DECREASING = 'decreasing'
}

export interface TrustDelegation {
  id: string;
  delegator: string;
  delegatee: string;
  amount: Decimal;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

// Security types
export interface BiometricCapabilities {
  fingerprint: boolean;
  faceId: boolean;
  voiceRecognition: boolean;
  hardwareBacked: boolean;
}

export interface SecuritySettings {
  biometricEnabled: boolean;
  pinEnabled: boolean;
  autoLockTimeout: number; // minutes
  requireAuthForTransactions: boolean;
  requireAuthForLargeAmounts: boolean;
  largeAmountThreshold: Decimal;
}

// Backup and recovery types
export interface BackupData {
  version: string;
  createdAt: Date;
  wallets: EncryptedWalletData[];
  settings: UserSettings;
  checksum: string;
}

export interface EncryptedWalletData {
  id: string;
  encryptedSeed: string;
  metadata: WalletMetadata;
  salt: string;
  iv: string;
}

export interface WalletMetadata {
  name: string;
  createdAt: Date;
  coinType: number;
  accountCount: number;
}

// DeFi types
export interface DeFiProtocol {
  id: string;
  name: string;
  type: DeFiProtocolType;
  apy: number;
  tvl: Decimal;
  trustMultiplier: number;
  riskLevel: RiskLevel;
}

export enum DeFiProtocolType {
  LENDING = 'lending',
  STAKING = 'staking',
  YIELD_FARMING = 'yield_farming',
  LIQUIDITY_POOL = 'liquidity_pool'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface DeFiPosition {
  id: string;
  protocol: DeFiProtocol;
  amount: Decimal;
  startDate: Date;
  currentValue: Decimal;
  unrealizedGains: Decimal;
  claimableRewards: Decimal;
}

// User settings
export interface UserSettings {
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
}

export interface NotificationSettings {
  transactionUpdates: boolean;
  trustScoreChanges: boolean;
  deFiRewards: boolean;
  securityAlerts: boolean;
  marketUpdates: boolean;
}

export interface PrivacySettings {
  showBalances: boolean;
  allowAnalytics: boolean;
  shareUsageData: boolean;
  mixingEnabled: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Hardware wallet types
export interface HardwareWalletInfo {
  type: HardwareWalletType;
  connected: boolean;
  deviceId: string;
  firmware: string;
  features: string[];
}

export enum HardwareWalletType {
  LEDGER = 'ledger',
  TREZOR = 'trezor',
  COLDCARD = 'coldcard'
}

// Exchange rate types
export interface ExchangeRate {
  baseCurrency: string;
  targetCurrency: string;
  rate: Decimal;
  lastUpdated: Date;
  source: string;
}

// Contact types
export interface Contact {
  id: string;
  name: string;
  address: string;
  note?: string;
  trustScore?: number;
  lastTransactionDate?: Date;
  isFavorite: boolean;
}

// QR Code types
export interface QRCodeData {
  type: QRCodeType;
  data: string;
  amount?: Decimal;
  memo?: string;
}

export enum QRCodeType {
  ADDRESS = 'address',
  PAYMENT_REQUEST = 'payment_request',
  BACKUP_DATA = 'backup_data'
} 