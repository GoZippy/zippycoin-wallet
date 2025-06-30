import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import CreateWalletPage from './pages/CreateWalletPage';
import SendPage from './pages/SendPage';
import ReceivePage from './pages/ReceivePage';
import DashboardPage from './pages/DashboardPage';
import { useWalletStore } from './store/walletStore';
import './styles/globals.css';

function App() {
  const { hasWallet, isLocked, initializeWallet } = useWalletStore();

  React.useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {!hasWallet ? (
            <>
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/create" element={<CreateWalletPage />} />
              <Route path="*" element={<Navigate to="/welcome" />} />
            </>
          ) : isLocked ? (
            <>
              <Route path="/unlock" element={<div>Unlock screen coming soon</div>} />
              <Route path="*" element={<Navigate to="/unlock" />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/send" element={<SendPage />} />
              <Route path="/receive" element={<ReceivePage />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;