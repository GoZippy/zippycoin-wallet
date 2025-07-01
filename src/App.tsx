import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ToastContainer } from './components/ui/Toast';
import Navigation from './components/layout/Navigation';
import WelcomePage from './pages/WelcomePage';
import CreateWalletPage from './pages/CreateWalletPage';
import SendPage from './pages/SendPage';
import ReceivePage from './pages/ReceivePage';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import TrustPage from './pages/TrustPage';
import DeFiPage from './pages/DeFiPage';
import { useWalletStore } from './store/walletStore';
import { useToast } from './hooks/useToast';
import './styles/globals.css';

// Loading component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
      />
      <p className="text-gray-600 dark:text-gray-300">Loading ZippyCoin Wallet...</p>
    </div>
  </div>
);

function App() {
  const { 
    isInitialized, 
    hasWallet, 
    isLocked, 
    initializeWallet 
  } = useWalletStore();
  
  const { toasts, removeToast } = useToast();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show loading screen while initializing
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App relative">
          {/* Navigation - only show when wallet exists and is unlocked */}
          {hasWallet && !isLocked && <Navigation isMobile={isMobile} />}
          
          {/* Toast Container */}
          <ToastContainer toasts={toasts} onClose={removeToast} />
          
          <Routes>
            {!hasWallet ? (
              // No wallet exists - show onboarding flow
              <>
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/create" element={<CreateWalletPage />} />
                <Route path="*" element={<Navigate to="/welcome" replace />} />
              </>
            ) : isLocked ? (
              // Wallet exists but is locked
              <>
                <Route 
                  path="/unlock" 
                  element={
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Unlock Your Wallet</h2>
                        <p className="text-gray-600 mb-4">Unlock screen coming soon</p>
                        <button 
                          onClick={() => useWalletStore.getState().unlockWallet('demo')}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Quick Unlock (Demo)
                        </button>
                      </div>
                    </div>
                  } 
                />
                <Route path="*" element={<Navigate to="/unlock" replace />} />
              </>
            ) : (
              // Wallet exists and is unlocked - show main app
              <>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/send" element={<SendPage />} />
                <Route path="/receive" element={<ReceivePage />} />
                <Route path="/assets" element={<AssetsPage />} />
                <Route path="/trust" element={<TrustPage />} />
                <Route path="/defi" element={<DeFiPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;