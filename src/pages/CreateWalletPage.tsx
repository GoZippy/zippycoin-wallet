import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Copy, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useWalletStore } from '../store/walletStore';

const CreateWalletPage: React.FC = () => {
  const navigate = useNavigate();
  const createWallet = useWalletStore(state => state.createWallet);
  
  const [step, setStep] = useState(1);
  const [walletName, setWalletName] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [verification, setVerification] = useState<number[]>([]);
  const [verificationWords, setVerificationWords] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWallet = async () => {
    if (!walletName.trim()) return;
    
    setIsCreating(true);
    try {
      const { mnemonic: generatedMnemonic } = await createWallet(walletName);
      setMnemonic(generatedMnemonic);
      setStep(2);
      
      // Generate verification indices
      const words = generatedMnemonic.split(' ');
      const indices = Array.from({ length: 4 }, () => 
        Math.floor(Math.random() * words.length)
      ).sort((a, b) => a - b);
      
      setVerification(indices);
      setVerificationWords(new Array(4).fill(''));
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
    // Show toast notification
  };

  const handleVerification = () => {
    const words = mnemonic.split(' ');
    const isValid = verification.every((index, i) => 
      verificationWords[i].toLowerCase().trim() === words[index].toLowerCase()
    );
    
    if (isValid) {
      setStep(4);
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      // Show error
      alert('Verification failed. Please check the words and try again.');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step >= num 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step > num ? <CheckCircle className="w-4 h-4" /> : num}
          </div>
          {num < 4 && (
            <div className={`w-12 h-1 ${
              step > num ? 'bg-blue-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <Card className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Create New Wallet</h2>
        <p className="text-gray-600">
          Your wallet will be secured with quantum-resistant cryptography
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Wallet Name
        </label>
        <input
          type="text"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          placeholder="My ZippyCoin Wallet"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={handleCreateWallet}
        loading={isCreating}
        disabled={!walletName.trim()}
        className="w-full"
      >
        Generate Wallet
      </Button>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Save Your Recovery Phrase</h2>
        <p className="text-gray-600">
          Write down these 24 words in order. This is the only way to recover your wallet.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Recovery Phrase</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMnemonic(!showMnemonic)}
            >
              {showMnemonic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopyMnemonic}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showMnemonic ? (
          <div className="grid grid-cols-3 gap-3">
            {mnemonic.split(' ').map((word, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded border">
                <span className="text-xs text-gray-500 mr-2">{index + 1}.</span>
                <span className="font-mono">{word}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Click the eye icon to reveal your recovery phrase</p>
          </div>
        )}
      </div>

      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-orange-800 mb-1">Important Security Notice</p>
            <ul className="text-orange-700 space-y-1">
              <li>• Never share your recovery phrase with anyone</li>
              <li>• Store it in a secure, offline location</li>
              <li>• Anyone with this phrase can access your funds</li>
            </ul>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={() => setStep(3)}
        className="w-full"
        disabled={!showMnemonic}
      >
        I've Saved My Recovery Phrase
      </Button>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verify Recovery Phrase</h2>
        <p className="text-gray-600">
          Please enter the requested words to verify you saved them correctly
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {verification.map((wordIndex, i) => (
          <div key={i}>
            <label className="block text-sm font-medium mb-2">
              Word #{wordIndex + 1}
            </label>
            <input
              type="text"
              value={verificationWords[i]}
              onChange={(e) => {
                const newWords = [...verificationWords];
                newWords[i] = e.target.value;
                setVerificationWords(newWords);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the word"
            />
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={handleVerification}
        className="w-full"
        disabled={verificationWords.some(word => !word.trim())}
      >
        Verify Wallet
      </Button>
    </Card>
  );

  const renderStep4 = () => (
    <Card className="max-w-md mx-auto text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h2 className="text-2xl font-bold mb-4">Wallet Created Successfully!</h2>
      <p className="text-gray-600 mb-6">
        Your ZippyCoin wallet has been created and secured. You'll be redirected to your dashboard.
      </p>
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container">
        {renderStepIndicator()}
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default CreateWalletPage;