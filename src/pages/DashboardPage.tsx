import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings,
  Copy,
  Eye,
  EyeOff,
  PieChart,
  Activity
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TrustScoreWidget } from '../components/trust/TrustScoreWidget';
import { QuickActions } from '../components/wallet/QuickActions';
import { TransactionList } from '../components/wallet/TransactionList';
import { useWalletStore } from '../store/walletStore';
import { SkeletonDashboard } from '../components/ui/SkeletonLoader';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentAccount, transactions, usdPrice, priceChange24h } = useWalletStore();
  
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const balance = currentAccount?.balance || '0.0000';
  const address = currentAccount?.address || '';
  const trustScore = currentAccount?.trustScore.current || 0;
  const usdValue = (parseFloat(balance) * usdPrice).toFixed(2);

  // Mock portfolio data
  const portfolioData = [
    { name: 'ZippyCoin', value: parseFloat(balance), percentage: 85, color: '#007AFF' },
    { name: 'Bitcoin', value: 0.0123, percentage: 10, color: '#F7931A' },
    { name: 'Ethereum', value: 0.456, percentage: 5, color: '#627EEA' }
  ];

  // Mock price chart data (7 days)
  const priceHistory = [
    { day: 'Mon', price: 1.95 },
    { day: 'Tue', price: 1.98 },
    { day: 'Wed', price: 1.92 },
    { day: 'Thu', price: 1.97 },
    { day: 'Fri', price: 2.03 },
    { day: 'Sat', price: 2.01 },
    { day: 'Sun', price: 2.00 }
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    // Toast notification would be triggered here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-8 md:pl-64">
        <div className="container py-6">
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-8 md:pl-64">
      <div className="container py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentAccount?.name || 'Account 1'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-mono">
                {address.substring(0, 10)}...{address.substring(address.length - 6)}
              </span>
              <button onClick={copyAddress} className="hover:text-blue-500">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-12 translate-y-12" />
            </div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 mb-2">Total Balance</p>
                <div className="flex items-center gap-3">
                  {showBalance ? (
                    <motion.h2 
                      className="text-3xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {parseFloat(balance).toFixed(4)} ZPC
                    </motion.h2>
                  ) : (
                    <h2 className="text-3xl font-bold">••••••</h2>
                  )}
                  <motion.button 
                    onClick={() => setShowBalance(!showBalance)}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
                <p className="text-blue-100">
                  {showBalance ? `$${usdValue}` : '••••••'}
                  <span className={`ml-2 ${priceChange24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                  </span>
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
                <PieChart className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-6"
        >
          <QuickActions 
            onSend={() => navigate('/send')}
            onReceive={() => navigate('/receive')}
            onTrust={() => navigate('/trust')}
            onDeFi={() => navigate('/defi')}
          />
        </motion.div>

        {/* Portfolio Overview & Price Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Portfolio Composition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Portfolio
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/assets')}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {portfolioData.map((asset, index) => (
                  <div key={asset.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: asset.color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {asset.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {asset.value.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {asset.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Price Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Price Chart (7D)
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Activity className="w-4 h-4" />
                  <span>+{priceChange24h.toFixed(2)}%</span>
                </div>
              </div>
              
              {/* Simple SVG Chart */}
              <div className="h-24 w-full">
                <svg className="w-full h-full" viewBox="0 0 300 100">
                  <defs>
                    <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Price line */}
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    points={priceHistory.map((point, index) => 
                      `${(index / (priceHistory.length - 1)) * 300},${100 - ((point.price - 1.9) / 0.15) * 80}`
                    ).join(' ')}
                  />
                  
                  {/* Fill area */}
                  <polygon
                    fill="url(#priceGradient)"
                    points={`0,100 ${priceHistory.map((point, index) => 
                      `${(index / (priceHistory.length - 1)) * 300},${100 - ((point.price - 1.9) / 0.15) * 80}`
                    ).join(' ')} 300,100`}
                  />
                </svg>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Trust Score Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mb-6"
        >
          <TrustScoreWidget score={trustScore} />
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/transactions')}
              >
                View All
              </Button>
            </div>
            <TransactionList />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;