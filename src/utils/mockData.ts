/**
 * Mock data for development and demo purposes
 */

export interface MockTransaction {
  id: string;
  type: 'send' | 'receive' | 'trust_delegation';
  amount: string;
  from?: string;
  to?: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
  memo?: string;
}

export interface MockContact {
  id: string;
  name: string;
  address: string;
  trustScore?: number;
  lastTransactionDate?: string;
  isFavorite: boolean;
}

export interface MockDeFiPosition {
  id: string;
  protocol: string;
  type: 'lending' | 'staking' | 'yield_farming';
  amount: string;
  apy: number;
  earned: string;
  startDate: string;
}

// Mock transaction history
export const mockTransactions: MockTransaction[] = [
  {
    id: 'tx1',
    type: 'receive',
    amount: '125.5000',
    from: 'zpc1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
    hash: '0x1234567890abcdef1234567890abcdef12345678',
    memo: 'Payment for services'
  },
  {
    id: 'tx2',
    type: 'send',
    amount: '50.0000',
    to: 'zpc1f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
    hash: '0xabcdef1234567890abcdef1234567890abcdef12',
    memo: 'Lunch payment'
  },
  {
    id: 'tx3',
    type: 'trust_delegation',
    amount: '15.0000',
    to: 'zpc1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
    hash: '0x567890abcdef1234567890abcdef1234567890ab'
  },
  {
    id: 'tx4',
    type: 'receive',
    amount: '200.0000',
    from: 'zpc1y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
    hash: '0xcdef1234567890abcdef1234567890abcdef1234'
  },
  {
    id: 'tx5',
    type: 'send',
    amount: '75.2500',
    to: 'zpc1d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'confirmed',
    hash: '0x234567890abcdef1234567890abcdef1234567890'
  }
];

// Mock contacts
export const mockContacts: MockContact[] = [
  {
    id: 'contact1',
    name: 'Alice Johnson',
    address: 'zpc1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0',
    trustScore: 850,
    lastTransactionDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isFavorite: true
  },
  {
    id: 'contact2',
    name: 'Bob Smith',
    address: 'zpc1f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5',
    trustScore: 720,
    lastTransactionDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isFavorite: true
  },
  {
    id: 'contact3',
    name: 'Carol Davis',
    address: 'zpc1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0',
    trustScore: 650,
    isFavorite: false
  },
  {
    id: 'contact4',
    name: 'David Wilson',
    address: 'zpc1y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4',
    trustScore: 780,
    isFavorite: false
  }
];

// Mock DeFi positions
export const mockDeFiPositions: MockDeFiPosition[] = [
  {
    id: 'defi1',
    protocol: 'ZippyLend',
    type: 'lending',
    amount: '500.0000',
    apy: 8.5,
    earned: '12.3456',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'defi2',
    protocol: 'ZippyStake',
    type: 'staking',
    amount: '1000.0000',
    apy: 12.0,
    earned: '45.6789',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'defi3',
    protocol: 'ZippySwap',
    type: 'yield_farming',
    amount: '750.0000',
    apy: 15.5,
    earned: '67.8901',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock market data
export const mockMarketData = {
  price: 2.15,
  change24h: 3.45,
  volume24h: 1250000,
  marketCap: 45000000,
  circulatingSupply: 20930000,
  lastUpdated: new Date().toISOString()
};

// Mock trust score data
export const mockTrustScoreData = {
  current: 750,
  trend: 'increasing' as const,
  change7d: 15,
  change30d: 45,
  factors: {
    transactionHistory: 95,
    networkParticipation: 78,
    identityVerification: 85,
    socialProof: 72,
    temporalConsistency: 88
  },
  networkRank: 1250,
  totalUsers: 50000
};

// Mock news/updates
export const mockNews = [
  {
    id: 'news1',
    title: 'ZippyCoin Trust Engine v2.0 Released',
    summary: 'Enhanced trust calculations with improved privacy features',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: 'update'
  },
  {
    id: 'news2',
    title: 'New DeFi Partnership Announced',
    summary: 'Integration with leading yield farming protocol',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'partnership'
  },
  {
    id: 'news3',
    title: 'Quantum-Resistant Security Audit Complete',
    summary: 'Third-party security audit confirms post-quantum readiness',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'security'
  }
];

// Helper functions for generating mock data
export const generateMockAddress = (): string => {
  const chars = '0123456789abcdef';
  let result = 'zpc1';
  for (let i = 0; i < 39; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateMockTransaction = (type: MockTransaction['type']): MockTransaction => {
  const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const amount = (Math.random() * 1000).toFixed(4);
  const address = generateMockAddress();
  
  return {
    id,
    type,
    amount,
    ...(type === 'send' ? { to: address } : { from: address }),
    timestamp: new Date().toISOString(),
    status: Math.random() > 0.1 ? 'confirmed' : 'pending',
    hash: `0x${Math.random().toString(16).substr(2, 40)}`
  };
};

export const generateMockTrustScore = (): number => {
  return Math.floor(Math.random() * 800) + 200; // 200-1000 range
};