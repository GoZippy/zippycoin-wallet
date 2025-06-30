import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, QrCode, Share, Download } from 'lucide-react';
import QRCodeGenerator from 'qrcode';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useWalletStore } from '../store/walletStore';

const ReceivePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentAccount } = useWalletStore();
  
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const address = currentAccount?.address || '';

  React.useEffect(() => {
    generateQRCode();
  }, [address, amount, memo]);

  const generateQRCode = async () => {
    try {
      const paymentData = {
        address,
        amount: amount || undefined,
        memo: memo || undefined
      };
      
      const dataString = amount || memo 
        ? `zippycoin:${address}?${new URLSearchParams(paymentData).toString()}`
        : address;
      
      const qrUrl = await QRCodeGenerator.toDataURL(dataString, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleShare = async () => {
    const paymentUrl = amount || memo 
      ? `zippycoin:${address}?amount=${amount}&memo=${encodeURIComponent(memo)}`
      : address;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ZippyCoin Payment Request',
          text: `Send ZippyCoin to: ${address}${amount ? ` Amount: ${amount} ZPC` : ''}`,
          url: paymentUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(paymentUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.download = `zippycoin-qr-${address.slice(-8)}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

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
          <h1 className="text-2xl font-bold">Receive ZippyCoin</h1>
        </div>

        <div className="space-y-6">
          {/* QR Code Section */}
          <Card className="text-center">
            <h3 className="text-lg font-semibold mb-4">Your Wallet Address</h3>
            
            <div className="bg-white p-6 rounded-lg inline-block mb-4">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
              ) : (
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <div className="font-mono text-sm break-all mb-2">{address}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyAddress}
                className={copySuccess ? 'text-green-500' : ''}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copySuccess ? 'Copied!' : 'Copy Address'}
              </Button>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadQR}>
                <Download className="w-4 h-4 mr-2" />
                Save QR
              </Button>
            </div>
          </Card>

          {/* Payment Request Section */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Customize Payment Request</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Request Amount (Optional)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.0001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Specify an amount to request from the sender
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Note (Optional)
                </label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="What is this payment for?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Add context for the payment request
                </p>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">How to Receive ZippyCoin</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium">Share your address or QR code</p>
                  <p className="text-gray-600">
                    Send your wallet address or show the QR code to the person sending you ZippyCoin
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium">Wait for the transaction</p>
                  <p className="text-gray-600">
                    The sender will broadcast the transaction to the ZippyCoin network
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium">Receive confirmation</p>
                  <p className="text-gray-600">
                    You'll see the incoming transaction in your wallet within minutes
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <QrCode className="w-3 h-3" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-blue-800 mb-1">Security Notice</p>
                <p className="text-blue-700">
                  Your wallet address is safe to share publicly. However, for privacy reasons, 
                  consider generating a new address for each transaction if receiving large amounts.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReceivePage;