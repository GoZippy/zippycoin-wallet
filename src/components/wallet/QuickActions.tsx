import React from 'react';
import { Send, Download, Shield, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

export const QuickActions: React.FC = () => {
  const actions = [
    { icon: Send, label: 'Send', color: 'bg-blue-500' },
    { icon: Download, label: 'Receive', color: 'bg-green-500' },
    { icon: Shield, label: 'Trust', color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'DeFi', color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action) => (
          <Card 
            key={action.label}
            hover 
            className="text-center cursor-pointer"
            onClick={() => console.log(`${action.label} clicked`)}
          >
            <div className={`w-12 h-12 ${action.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium">{action.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};