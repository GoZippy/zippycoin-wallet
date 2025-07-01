import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  change24h: number;
  price: string;
  icon: string;
}

const AssetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'name' | 'change'>('value');

  // Mock asset data
  const assets: Asset[] = [
    {
      id: 'zpc',
      symbol: 'ZPC',
      name: 'ZippyCoin',
      balance: '1,234.5678',
      usdValue: '2,469.14',
      change24h: 3.45,
      price: '2.00',
      icon: '💎'
    },
    {
      id: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: '0.5432',
      usdValue: '24,567.89',
      change24h: -1.23,
      price: '45,234.56',
      icon: '₿'
    },
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '15.7834',
      usdValue: '32,456.78',
      change24h: 2.87,
      price: '2,056.34',
      icon: 'Ξ'
    },
    {
      id: 'usdc',
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '500.00',
      usdValue: '500.00',
      change24h: 0.01,
      price: '1.00',
      icon: '💵'
    }
  ];

  const filteredAssets = assets
    .filter(asset => 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return parseFloat(b.usdValue.replace(',', '')) - parseFloat(a.usdValue.replace(',', ''));
        case 'name':
          return a.name.localeCompare(b.name);
        case 'change':
          return b.change24h - a.change24h;
        default:
          return 0;
      }
    });

  const totalPortfolioValue = assets.reduce((total, asset) => 
    total + parseFloat(asset.usdValue.replace(',', '')), 0
  );

  const portfolioChange24h = 2.15; // Mock overall portfolio change

  const handleAssetClick = (asset: Asset) => {
    // Navigate to asset detail page (future implementation)
    console.log('Asset clicked:', asset);
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
          <h1 className="text-2xl font-bold">Assets</h1>
        </div>

        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold">Assets</h1>
        </div>

        {/* Portfolio Overview */}
        <Card className="mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Portfolio Value</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ${totalPortfolioValue.toLocaleString()}
            </h2>
            <div className={`flex items-center justify-center gap-1 text-sm ${
              portfolioChange24h >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {portfolioChange24h >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(portfolioChange24h)}% (24h)</span>
            </div>
          </div>
        </Card>

        {/* Search and Sort */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'value' | 'name' | 'change')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="value">Sort by Value</option>
            <option value="name">Sort by Name</option>
            <option value="change">Sort by 24h Change</option>
          </select>
        </div>

        {/* Asset List */}
        <div className="space-y-3">
          {filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                hover 
                className="cursor-pointer"
                onClick={() => handleAssetClick(asset)}
              >
                <div className="flex items-center gap-4">
                  {/* Asset Icon & Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {asset.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {asset.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {asset.balance} {asset.symbol}
                      </p>
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${asset.price}
                    </p>
                  </div>

                  {/* 24h Change */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">24h</p>
                    <div className={`flex items-center gap-1 ${
                      asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="text-sm font-medium">
                        {Math.abs(asset.change24h)}%
                      </span>
                    </div>
                  </div>

                  {/* USD Value */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${asset.usdValue}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Value
                    </p>
                  </div>

                  {/* More Options */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Show more options
                    }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssets.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No assets found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or add some assets to your portfolio.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssetsPage;