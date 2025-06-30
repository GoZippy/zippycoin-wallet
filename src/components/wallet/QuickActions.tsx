import React from 'react';
import { Send, Download, Shield, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

interface QuickActionsProps {
  onSend: () => void;
  onReceive: () => void;
  onTrust: () => void;
  onDeFi: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onSend,
  onReceive,
  onTrust,
  onDeFi
}) => {
  const actions = [
    { icon: Send, label: 'Send', color: 'bg-blue-500', onClick: onSend },
    { icon: Download, label: 'Receive', color: 'bg-green-500', onClick: onReceive },
    { icon: Shield, label: 'Trust', color: 'bg-purple-500', onClick: onTrust },
    { icon: TrendingUp, label: 'DeFi', color: 'bg-orange-500', onClick: onDeFi },
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
            onClick={action.onClick}
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