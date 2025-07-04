import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateWallet = () => {
    navigate('/create');
  };

  const handleImportWallet = () => {
    navigate('/create'); // TODO: Add import flow
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            className="w-24 h-24 bg-blue-500 rounded-3xl mx-auto mb-6 flex items-center justify-center"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to <span className="text-blue-500">ZippyCoin</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            The world's first quantum-resistant, trust-based cryptocurrency wallet
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Shield,
              title: "Quantum-Resistant",
              description: "Protected against future quantum computers with advanced cryptography"
            },
            {
              icon: Key,
              title: "You Control Your Keys",
              description: "Your private keys never leave your device. True self-custody."
            },
            {
              icon: Lock,
              title: "Hardware Security",
              description: "Leverages your device's secure hardware for maximum protection"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card hover className="text-center h-full">
              <feature.icon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-md mx-auto space-y-4"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateWallet}
            className="w-full"
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Create New Wallet
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleImportWallet}
            className="w-full"
          >
            Import Existing Wallet
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;