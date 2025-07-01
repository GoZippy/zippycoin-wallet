import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Shield, Zap, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface DeFiProtocol {
  id: string;
  name: string;
  type: 'lending' | 'staking' | 'yield_farming' | 'liquidity';
  apy: number;
  tvl: string;
  trustMultiplier: number;
  userDeposit?: string;
  earned?: string;
  icon: string;
  color: string;
}

const DeFiPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'protocols' | 'positions'>('protocols');

  const protocols: DeFiProtocol[] = [
    {
      id: 'zippylend',
      name: 'ZippyLend',
      type: 'lending',
      apy: 8.5,
      tvl: '$2.5M',
      trustMultiplier: 1.2,
      userDeposit: '500.00',
      earned: '12.34',
      icon: '💎',
      color: 'bg-blue-500'
    },
    {
      id: 'zippystake',
      name: 'ZippyStake',
      type: 'staking',
      apy: 12.0,
      tvl: '$5.1M',
      trustMultiplier: 1.15,
      userDeposit: '1000.00',
      earned: '45.67',
      icon: '🚀',
      color: 'bg-green-500'
    },
    {
      id: 'zippyswap',
      name: 'ZippySwap',
      type: 'liquidity',
      apy: 15.5,
      tvl: '$1.8M',
      trustMultiplier: 1.1,
      icon: '🔄',
      color: 'bg-purple-500'
    },
    {
      id: 'zippyfarm',
      name: 'ZippyFarm',
      type: 'yield_farming',
      apy: 22.3,
      tvl: '$800K',
      trustMultiplier: 1.25,
      icon: '🌾',
      color: 'bg-orange-500'
    }
  ];

  const totalValueLocked = protocols
    .filter(p => p.userDeposit)
    .reduce((total, protocol) => total + parseFloat(protocol.userDeposit || '0'), 0);

  const totalEarned = protocols
    .filter(p => p.earned)
    .reduce((total, protocol) => total + parseFloat(protocol.earned || '0'), 0);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lending': return 'Lending';
      case 'staking': return 'Staking';
      case 'yield_farming': return 'Yield Farming';
      case 'liquidity': return 'Liquidity Pool';
      default: return type;
    }
  };

  const renderProtocols = () => (
    <div className="space-y-6">
      {/* DeFi Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Value Locked</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalValueLocked.toLocaleString()} ZPC
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ≈ ${(totalValueLocked * 2).toLocaleString()} USD
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Earned</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            +{totalEarned.toFixed(2)} ZPC
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ≈ ${(totalEarned * 2).toFixed(2)} USD
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Trust Bonus</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            +15%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Average APY boost
          </p>
        </Card>
      </div>

      {/* Protocol List */}
      <div className="grid gap-4">
        {protocols.map((protocol, index) => (
          <motion.div
            key={protocol.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${protocol.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                    {protocol.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {protocol.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getTypeLabel(protocol.type)} • TVL: {protocol.tvl}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Base APY</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {protocol.apy}%
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">With Trust</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {(protocol.apy * protocol.trustMultiplier).toFixed(1)}%
                    </p>
                  </div>

                  {protocol.userDeposit ? (
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Your Position</p>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {protocol.userDeposit} ZPC
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        +{protocol.earned} earned
                      </p>
                    </div>
                  ) : (
                    <Button variant="primary" size="sm">
                      Deposit
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderPositions = () => {
    const userPositions = protocols.filter(p => p.userDeposit);

    if (userPositions.length === 0) {
      return (
        <Card className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <TrendingUp className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No active positions
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start earning yield by depositing into DeFi protocols.
          </p>
          <Button 
            variant="primary" 
            onClick={() => setActiveTab('protocols')}
          >
            Explore Protocols
          </Button>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {userPositions.map((position, index) => (
          <motion.div
            key={position.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${position.color} rounded-lg flex items-center justify-center text-white`}>
                    {position.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {position.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getTypeLabel(position.type)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Withdraw
                  </Button>
                  <Button variant="primary" size="sm">
                    Claim Rewards
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Deposited</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {position.userDeposit} ZPC
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${(parseFloat(position.userDeposit || '0') * 2).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Earned</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    +{position.earned} ZPC
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${(parseFloat(position.earned || '0') * 2).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current APY</p>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {(position.apy * position.trustMultiplier).toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    +{((position.trustMultiplier - 1) * 100).toFixed(0)}% trust bonus
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-8 md:pl-64">
      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:hidden">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">DeFi</h1>
        </div>

        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold">DeFi</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'protocols', label: 'All Protocols' },
            { id: 'positions', label: 'My Positions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'protocols' && renderProtocols()}
          {activeTab === 'positions' && renderPositions()}
        </motion.div>
      </div>
    </div>
  );
};

export default DeFiPage;