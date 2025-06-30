import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Decimal } from 'decimal.js';
import { ZippyCoinWallet, type WalletAccount as CryptoAccount } from '../crypto/wallet';
import { mockTransactions, mockTrustScoreData, generateMockTransaction } from '../utils/mockData';

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
        try {
          // Generate wallet using crypto library
          const { wallet, mnemonic } = await ZippyCoinWallet.generateNew(name);
          const cryptoAccount = wallet.deriveAccount(0);
          
          const account: Account = {
            id: `account-${Date.now()}`,
            name: name || 'Account 1',
            address: cryptoAccount.address,
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
          localStorage.setItem('zippycoin-wallet-mnemonic', mnemonic);
          
          set({
            hasWallet: true,
            isLocked: false,
            currentAccount: account,
            accounts: [account],
            transactions: mockTransactions.slice(0, 3) // Add some demo transactions
          });

          return { mnemonic, account };
        } catch (error) {
          console.error('Failed to create wallet:', error);
          throw error;
        }
      },

      importWallet: async (mnemonic: string, name: string) => {
        try {
          // Validate and import from mnemonic using crypto library
          const wallet = await ZippyCoinWallet.fromMnemonic(mnemonic, {
            network: 'testnet',
            derivationPath: "m/44'/2187'/0'",
            coinType: 2187
          });
          
          const cryptoAccount = wallet.deriveAccount(0);
          
        const account: Account = {
          id: `account-${Date.now()}`,
          name: name || 'Imported Account',
          address: cryptoAccount.address,
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
        localStorage.setItem('zippycoin-wallet-mnemonic', mnemonic);
        
        set({
          hasWallet: true,
          isLocked: false,
          currentAccount: account,
          accounts: [account],
          transactions: mockTransactions // Add full transaction history for imported wallet
        });

        return account;
        } catch (error) {
          console.error('Failed to import wallet:', error);
          throw error;
        }
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
        
        // Validate address format
        if (!ZippyCoinWallet.validateAddress(to)) {
          throw new Error('Invalid recipient address');
        }
        
        // Validate amount
        const sendAmount = new Decimal(amount);
        const balance = new Decimal(currentAccount.balance);
        const fee = new Decimal('0.001');
        
        if (sendAmount.plus(fee).gt(balance)) {
          throw new Error('Insufficient balance');
        }

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

        // Update balance
        const newBalance = balance.minus(sendAmount).minus(fee);
        const { updateBalance } = get();
        updateBalance(currentAccount.id, newBalance.toString());

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
// Moved to crypto/wallet.ts