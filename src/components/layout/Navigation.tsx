import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Send, 
  Download, 
  Coins,
  Settings,
  Shield,
  TrendingUp 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  isMobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard',
      color: 'text-blue-500'
    },
    { 
      id: 'send', 
      label: 'Send', 
      icon: Send, 
      path: '/send',
      color: 'text-red-500'
    },
    { 
      id: 'receive', 
      label: 'Receive', 
      icon: Download, 
      path: '/receive',
      color: 'text-green-500'
    },
    { 
      id: 'assets', 
      label: 'Assets', 
      icon: Coins, 
      path: '/assets',
      color: 'text-orange-500'
    },
    { 
      id: 'trust', 
      label: 'Trust', 
      icon: Shield, 
      path: '/trust',
      color: 'text-purple-500'
    },
    { 
      id: 'defi', 
      label: 'DeFi', 
      icon: TrendingUp, 
      path: '/defi',
      color: 'text-indigo-500'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      path: '/settings',
      color: 'text-gray-500'
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex justify-around items-center py-2">
          {navigationItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? `${item.color} bg-blue-50 dark:bg-blue-900/20` 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 w-6 h-0.5 bg-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop Sidebar
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">ZippyCoin</h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="desktopActiveIndicator"
                    className="ml-auto w-1 h-6 bg-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User Profile (Future) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Account 1
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                zpc1a2b3c4...x5y6z7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;