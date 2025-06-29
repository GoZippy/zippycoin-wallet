import React, { useState } from 'react';
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

const DashboardPage: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [balance] = useState('1,234.5678');
  const [usdValue] = useState('2,469.12');
  const [trustScore] = useState(750);
  const [address] = useState('zpc1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7');

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
              Account 1
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
                    <h2 className="text-3xl font-bold">{balance} ZPC</h2>
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
          <QuickActions />
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