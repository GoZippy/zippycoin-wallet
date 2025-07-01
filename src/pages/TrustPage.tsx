import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Users, TrendingUp, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TrustScoreWidget } from '../components/trust/TrustScoreWidget';

const TrustPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'network' | 'delegate'>('overview');

  const trustScore = 750;
  const trustRank = 1250;
  const totalUsers = 50000;

  const trustMetrics = [
    {
      label: 'Delegations Received',
      value: 42,
      change: +3,
      icon: Shield,
      color: 'text-blue-500'
    },
    {
      label: 'Delegations Given',
      value: 15,
      change: +1,
      icon: Users,
      color: 'text-green-500'
    },
    {
      label: 'Trust Network Size',
      value: 127,
      change: +8,
      icon: TrendingUp,
      color: 'text-purple-500'
    },
    {
      label: 'Trust Rank',
      value: `#${trustRank.toLocaleString()}`,
      change: -15,
      icon: Award,
      color: 'text-orange-500'
    }
  ];

  const trustActions = [
    {
      title: 'Delegate Trust',
      description: 'Share trust with other users to help them build reputation',
      action: 'Delegate',
      icon: Shield,
      color: 'bg-blue-500'
    },
    {
      title: 'Verify Identity',
      description: 'Complete identity verification to increase your trust score',
      action: 'Verify',
      icon: Target,
      color: 'bg-green-500'
    },
    {
      title: 'Build Network',
      description: 'Connect with trusted users to expand your network',
      action: 'Connect',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  const recentTrustActivity = [
    {
      id: '1',
      type: 'delegation_received',
      from: 'zpc1a2b3c4d5e6...x5y6z7',
      amount: 25,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'delegation_given',
      to: 'zpc1f7g8h9i0j1...m4n5o6',
      amount: 15,
      timestamp: '1 day ago'
    },
    {
      id: '3',
      type: 'score_increase',
      amount: 10,
      reason: 'Network participation',
      timestamp: '3 days ago'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Trust Score Widget */}
      <TrustScoreWidget score={trustScore} />

      {/* Trust Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trustMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center">
              <metric.icon className={`w-8 h-8 mx-auto mb-3 ${metric.color}`} />
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {typeof metric.value === 'string' ? metric.value : metric.value.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {metric.label}
              </p>
              <div className={`text-xs flex items-center justify-center gap-1 ${
                metric.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{metric.change >= 0 ? '+' : ''}{metric.change}</span>
                <span>this week</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trust Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {trustActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card hover className="cursor-pointer h-full">
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {action.description}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                {action.action}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Trust Activity
        </h3>
        <div className="space-y-4">
          {recentTrustActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'delegation_received' ? 'bg-green-100 text-green-600' :
                  activity.type === 'delegation_given' ? 'bg-blue-100 text-blue-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.type === 'delegation_received' ? 'Received Trust Delegation' :
                     activity.type === 'delegation_given' ? 'Delegated Trust' :
                     'Trust Score Increased'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.type === 'delegation_received' ? `From ${activity.from}` :
                     activity.type === 'delegation_given' ? `To ${activity.to}` :
                     activity.reason}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  +{activity.amount}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderNetwork = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Trust Network
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center py-12">
        Trust network visualization coming soon...
      </p>
    </Card>
  );

  const renderDelegate = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Delegate Trust
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center py-12">
        Trust delegation interface coming soon...
      </p>
    </Card>
  );

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
          <h1 className="text-2xl font-bold">Trust</h1>
        </div>

        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold">Trust</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'network', label: 'Network' },
            { id: 'delegate', label: 'Delegate' }
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
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'network' && renderNetwork()}
          {activeTab === 'delegate' && renderDelegate()}
        </motion.div>
      </div>
    </div>
  );
};

export default TrustPage;