import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Decimal } from 'decimal.js';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useWalletStore } from '../store/walletStore';

const SendPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentAccount, sendTransaction, usdPrice } = useWalletStore();
  
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [fee, setFee] = useState('0.001');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const balance = new Decimal(currentAccount?.balance || '0');
  const sendAmount = new Decimal(amount || '0');
  const feeAmount = new Decimal(fee);
  const total = sendAmount.plus(feeAmount);
  const usdAmount = sendAmount.mul(usdPrice);

  const isValidAmount = sendAmount.gt(0) && total.lte(balance);
  const isValidRecipient = recipient.startsWith('zpc1') && recipient.length === 43;

  const handleSend = async () => {
    if (!isValidAmount || !isValidRecipient) return;
    
    setIsProcessing(true);
    try {
      const txId = await sendTransaction(recipient, amount, memo);
      setTransactionId(txId);
      setStep(3);
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Recipient</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            ZippyCoin Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="zpc1..."
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500">
              <QrCode className="w-5 h-5" />
            </button>
          </div>
          {recipient && !isValidRecipient && (
            <p className="text-red-500 text-sm mt-1">Invalid ZippyCoin address</p>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Amount</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Amount (ZPC)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.0001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => setAmount(balance.minus(feeAmount).toString())}
              className="absolute right-3 top-2.5 text-blue-500 text-sm hover:underline"
            >
              Max
            </button>
          </div>
          {amount && (
            <p className="text-gray-500 text-sm mt-1">
              ≈ ${usdAmount.toFixed(2)} USD
            </p>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Available Balance:</span>
            <span className="font-mono">{balance.toFixed(4)} ZPC</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Network Fee</h3>
        
        <div className="space-y-3">
          {[
            { label: 'Standard', fee: '0.001', time: '~1 min' },
            { label: 'Fast', fee: '0.005', time: '~30 sec' },
            { label: 'Instant', fee: '0.01', time: '~10 sec' }
          ].map((option) => (
            <label key={option.label} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="fee"
                  value={option.fee}
                  checked={fee === option.fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono">{option.fee} ZPC</div>
                <div className="text-sm text-gray-500">
                  ${new Decimal(option.fee).mul(usdPrice).toFixed(3)}
                </div>
              </div>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Memo (Optional)</h3>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Add a note for this transaction"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </Card>

      <Button
        variant="primary"
        size="lg"
        onClick={() => setStep(2)}
        disabled={!isValidAmount || !isValidRecipient}
        className="w-full"
      >
        Review Transaction
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <Card>
      <div className="text-center mb-6">
        <Send className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Confirm Transaction</h2>
        <p className="text-gray-600">
          Please review all details carefully before sending
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">To:</span>
          <span className="font-mono text-sm">
            {recipient.slice(0, 10)}...{recipient.slice(-6)}
          </span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Amount:</span>
          <div className="text-right">
            <div className="font-semibold">{sendAmount.toFixed(4)} ZPC</div>
            <div className="text-sm text-gray-500">${usdAmount.toFixed(2)} USD</div>
          </div>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Network Fee:</span>
          <div className="text-right">
            <div>{feeAmount.toFixed(4)} ZPC</div>
            <div className="text-sm text-gray-500">
              ${feeAmount.mul(usdPrice).toFixed(3)} USD
            </div>
          </div>
        </div>
        
        <div className="flex justify-between py-2 font-semibold text-lg">
          <span>Total:</span>
          <div className="text-right">
            <div>{total.toFixed(4)} ZPC</div>
            <div className="text-sm text-gray-500">
              ${total.mul(usdPrice).toFixed(2)} USD
            </div>
          </div>
        </div>

        {memo && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Memo:</div>
            <div className="text-sm">{memo}</div>
          </div>
        )}
      </div>

      {total.gt(balance) && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 text-sm">Insufficient balance</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(1)}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSend}
          loading={isProcessing}
          disabled={total.gt(balance)}
          className="flex-1"
        >
          Send Transaction
        </Button>
      </div>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h2 className="text-2xl font-bold mb-4">Transaction Sent!</h2>
      <p className="text-gray-600 mb-6">
        Your transaction has been broadcast to the network and is being processed.
      </p>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <div className="text-sm text-gray-600 mb-1">Transaction ID:</div>
        <div className="font-mono text-sm break-all">{transactionId}</div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/dashboard')}
          className="flex-1"
        >
          Back to Dashboard
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            setStep(1);
            setRecipient('');
            setAmount('');
            setMemo('');
            setTransactionId('');
          }}
          className="flex-1"
        >
          Send Another
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Send ZippyCoin</h1>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default SendPage;