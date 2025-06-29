import React from 'react';
import { Shield, TrendingUp, Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface TrustScoreWidgetProps {
  score: number;
}

export const TrustScoreWidget: React.FC<TrustScoreWidgetProps> = ({ score }) => {
  const getTrustLevel = (score: number) => {
    if (score >= 800) return { level: 'Excellent', color: 'text-green-500' };
    if (score >= 600) return { level: 'Good', color: 'text-blue-500' };
    if (score >= 400) return { level: 'Average', color: 'text-yellow-500' };
    if (score >= 200) return { level: 'Low', color: 'text-orange-500' };
    return { level: 'Poor', color: 'text-red-500' };
  };

  const { level, color } = getTrustLevel(score);
  const percentage = (score / 1000) * 100;

  return (
    <Card>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Trust Score</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Your reputation in the ZippyCoin network
          </p>
        </div>
        <Shield className="w-8 h-8 text-blue-500" />
      </div>

      <div className="flex items-center gap-8 mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray={`${percentage}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{score}</div>
              <div className={`text-sm font-medium ${color}`}>{level}</div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Transaction History</span>
              <span className="text-sm font-medium">95%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Network Participation</span>
              <span className="text-sm font-medium">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Identity Verification</span>
              <span className="text-sm font-medium">85%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="sm" className="flex-1">
          <TrendingUp className="w-4 h-4" />
          View Details
        </Button>
        <Button variant="primary" size="sm" className="flex-1">
          <Users className="w-4 h-4" />
          Delegate Trust
        </Button>
      </div>
    </Card>
  );
};