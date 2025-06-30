import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Send, 
  Download, 
  Shield, 
  TrendingUp, 
  Settings,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TrustScoreWidget } from '../components/trust/TrustScoreWidget';
import { QuickActions } from '../components/wallet/QuickActions';
import { TransactionList } from '../components/wallet/TransactionList';
import { useWalletStore } from '../store/walletStore';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentAccount, transactions, usdPrice, priceChange24h } = useWalletStore();
  
  const [showBalance, setShowBalance] = useState(true);
  
  const balance = currentAccount?.balance || '0.0000';
  const address = currentAccount?.address || '';
  const trustScore = currentAccount?.trustScore.current || 0;
  const usdValue = (parseFloat(balance) * usdPrice).toFixed(2);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    // TODO: Show toast notification
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
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
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 mb-2">Total Balance</p>
                <div className="flex items-center gap-3">
                  {showBalance ? (
                    <h2 className="text-3xl font-bold">{parseFloat(balance).toFixed(4)} ZPC</h2>
                  ) : (
                    <h2 className="text-3xl font-bold">••••••</h2>
                  )}
                  <button onClick={() => setShowBalance(!showBalance)}>
                    {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-blue-100">
                  {showBalance ? `$${usdValue}` : '••••••'}
                  <span className="text-green-300 ml-2">+3.45%</span>
                </p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions 
            onSend={() => navigate('/send')}
            onReceive={() => navigate('/receive')}
            onTrust={() => {/* TODO */}}
            onDeFi={() => {/* TODO */}}
          />
        </div>

        {/* Trust Score Widget */}
        <div className="mb-8">
          <TrustScoreWidget score={trustScore} />
        </div>

        {/* Recent Transactions */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <TransactionList />
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;