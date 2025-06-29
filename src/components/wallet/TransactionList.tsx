import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Shield } from 'lucide-react';

export const TransactionList: React.FC = () => {
  const transactions = [
    {
      id: '1',
      type: 'send',
      amount: '50.00',
      to: 'zpc1a2b3c4d5e6...x5y6z7',
      timestamp: '2 hours ago',
      status: 'confirmed'
    },
    {
      id: '2',
      type: 'receive',
      amount: '125.50',
      from: 'zpc1f7g8h9i0j1...m4n5o6',
      timestamp: '1 day ago',
      status: 'confirmed'
    },
    {
      id: '3',
      type: 'trust_delegation',
      amount: '10.00',
      to: 'zpc1k2l3m4n5o6...q8r9s0',
      timestamp: '3 days ago',
      status: 'confirmed'
    }
  ];

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              tx.type === 'send' ? 'bg-red-100 text-red-600' :
              tx.type === 'receive' ? 'bg-green-100 text-green-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {tx.type === 'send' && <ArrowUpRight className="w-5 h-5" />}
              {tx.type === 'receive' && <ArrowDownLeft className="w-5 h-5" />}
              {tx.type === 'trust_delegation' && <Shield className="w-5 h-5" />}
            </div>
            
            <div>
              <p className="font-medium">
                {tx.type === 'send' ? 'Sent' : 
                 tx.type === 'receive' ? 'Received' : 
                 'Trust Delegation'}
              </p>
              <p className="text-sm text-gray-500">
                {tx.type === 'send' ? `To ${tx.to}` :
                 tx.type === 'receive' ? `From ${tx.from}` :
                 `To ${tx.to}`}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className={`font-medium ${
              tx.type === 'send' ? 'text-red-600' :
              tx.type === 'receive' ? 'text-green-600' :
              'text-blue-600'
            }`}>
              {tx.type === 'send' ? '-' : '+'}{tx.amount} ZPC
            </p>
            <p className="text-sm text-gray-500">{tx.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
};