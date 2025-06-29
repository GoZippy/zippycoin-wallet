import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import './styles/globals.css';

function App() {
  const [hasWallet, setHasWallet] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/welcome" 
            element={<WelcomePage onWalletCreated={() => setHasWallet(true)} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              hasWallet ? <DashboardPage /> : <Navigate to="/welcome" />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={hasWallet ? "/dashboard" : "/welcome"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;