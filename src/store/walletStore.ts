import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'trust_delegation';
  amount: string;
  from?: string;
  to?: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
}

interface TrustScore {
  current: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  factors: {
    transactionHistory: number;
    networkParticipation: number;
    identityVerification: number;
  };
}

interface Account {
  id: string;
  name: string;
  address: string;
  balance: string;
  trustScore: TrustScore;
}

interface WalletStore {
  // State
  isInitialized: boolean;
  hasWallet: boolean;
  isLocked: boolean;
  currentAccount: Account | null;
  accounts: Account[];
  transactions: Transaction[];
  usdPrice: number;
  priceChange24h: number;
  
  // Actions
  initializeWallet: () => Promise<void>;
  createWallet: (name: string) => Promise<{ mnemonic: string; account: Account }>;
  importWallet: (mnemonic: string, name: string) => Promise<Account>;
  unlockWallet: (password: string) => Promise<boolean>;
  lockWallet: () => void;
  switchAccount: (accountId: string) => void;
  updateBalance: (accountId: string, balance: string) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTrustScore: (accountId: string, trustScore: TrustScore) => void;
  sendTransaction: (to: string, amount: string, memo?: string) => Promise<string>;
  delegateTrust: (to: string, amount: number) => Promise<string>;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isInitialized: false,
      hasWallet: false,
      isLocked: true,
      currentAccount: null,
      accounts: [],
      transactions: [],
      usdPrice: 2.00,
      priceChange24h: 3.45,

      initializeWallet: async () => {
        // Simulate initialization delay for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if wallet exists in secure storage
        const existingWallet = localStorage.getItem('zippycoin-wallet-exists');
        set({
          isInitialized: true,
          hasWallet: !!existingWallet,
          isLocked: !!existingWallet
        });
      },

      createWallet: async (name: string) => {
        // Generate mnemonic and create account
        const mnemonic = generateMnemonic();
        const account: Account = {
          id: `account-${Date.now()}`,
          name: name || 'Account 1',
          address: generateAddress(),
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

        // Store wallet exists flag
        localStorage.setItem('zippycoin-wallet-exists', 'true');
        
        set({
          hasWallet: true,
          isLocked: false,
          currentAccount: account,
          accounts: [account]
        });

        return { mnemonic, account };
      },

      importWallet: async (mnemonic: string, name: string) => {
        // Validate and import from mnemonic
        if (!validateMnemonic(mnemonic)) {
          throw new Error('Invalid mnemonic phrase');
        }

        const account: Account = {
          id: `account-${Date.now()}`,
          name: name || 'Imported Account',
          address: generateAddress(),
          balance: '1234.5678', // Mock existing balance
          trustScore: {
            current: 750,
            trend: 'increasing',
            factors: {
              transactionHistory: 95,
              networkParticipation: 78,
              identityVerification: 85
            }
          }
        };

        localStorage.setItem('zippycoin-wallet-exists', 'true');
        
        set({
          hasWallet: true,
          isLocked: false,
          currentAccount: account,
          accounts: [account]
        });

        return account;
      },

      unlockWallet: async (password: string) => {
        // Mock password validation
        if (password === 'demo' || password.length >= 6) {
          const { accounts } = get();
          set({
            isLocked: false,
            currentAccount: accounts[0] || null
          });
          return true;
        }
        return false;
      },

      lockWallet: () => {
        set({ isLocked: true, currentAccount: null });
      },

      switchAccount: (accountId: string) => {
        const { accounts } = get();
        const account = accounts.find(acc => acc.id === accountId);
        if (account) {
          set({ currentAccount: account });
        }
      },

      updateBalance: (accountId: string, balance: string) => {
        const { accounts, currentAccount } = get();
        const updatedAccounts = accounts.map(acc =>
          acc.id === accountId ? { ...acc, balance } : acc
        );
        
        set({
          accounts: updatedAccounts,
          currentAccount: currentAccount?.id === accountId 
            ? { ...currentAccount, balance }
            : currentAccount
        });
      },

      addTransaction: (transaction: Transaction) => {
        const { transactions } = get();
        set({
          transactions: [transaction, ...transactions].slice(0, 100) // Keep last 100
        });
      },

      updateTrustScore: (accountId: string, trustScore: TrustScore) => {
        const { accounts, currentAccount } = get();
        const updatedAccounts = accounts.map(acc =>
          acc.id === accountId ? { ...acc, trustScore } : acc
        );
        
        set({
          accounts: updatedAccounts,
          currentAccount: currentAccount?.id === accountId 
            ? { ...currentAccount, trustScore }
            : currentAccount
        });
      },

      sendTransaction: async (to: string, amount: string, memo?: string) => {
        const { currentAccount, addTransaction } = get();
        if (!currentAccount) throw new Error('No account selected');

        const transaction: Transaction = {
          id: `tx-${Date.now()}`,
          type: 'send',
          amount,
          to,
          timestamp: new Date().toISOString(),
          status: 'pending',
          hash: `0x${Math.random().toString(16).slice(2)}`
        };

        addTransaction(transaction);

        // Simulate transaction processing
        setTimeout(() => {
          const { transactions } = get();
          const updatedTransactions = transactions.map(tx =>
            tx.id === transaction.id ? { ...tx, status: 'confirmed' as const } : tx
          );
          set({ transactions: updatedTransactions });
        }, 3000);

        return transaction.id;
      },

      delegateTrust: async (to: string, amount: number) => {
        const { currentAccount, addTransaction } = get();
        if (!currentAccount) throw new Error('No account selected');

        const transaction: Transaction = {
          id: `trust-${Date.now()}`,
          type: 'trust_delegation',
          amount: amount.toString(),
          to,
          timestamp: new Date().toISOString(),
          status: 'confirmed'
        };

        addTransaction(transaction);
        return transaction.id;
      }
    }),
    {
      name: 'zippycoin-wallet-store',
      partialize: (state) => ({
        accounts: state.accounts,
        transactions: state.transactions,
        hasWallet: state.hasWallet
      })
    }
  )
);

// Helper functions
function generateMnemonic(): string {
  const words = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
    'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
    'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual'
  ];
  
  return Array.from({ length: 24 }, () => 
    words[Math.floor(Math.random() * words.length)]
  ).join(' ');
}

function generateAddress(): string {
  const chars = '0123456789abcdef';
  const randomPart = Array.from({ length: 39 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  
  return `zpc1${randomPart}`;
}

function validateMnemonic(mnemonic: string): boolean {
  const words = mnemonic.trim().split(/\s+/);
  return words.length >= 12 && words.length <= 24;
}