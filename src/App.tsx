import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import CreateWalletPage from './pages/CreateWalletPage';
import SendPage from './pages/SendPage';
import ReceivePage from './pages/ReceivePage';
import DashboardPage from './pages/DashboardPage';
import { useWalletStore } from './store/walletStore';
import './styles/globals.css';

// Loading component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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

  React.useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="App">
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
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;