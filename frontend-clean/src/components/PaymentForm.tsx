import { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CONTRACT_ABI = [
  'function makePayment(address merchant, string orderId) payable',
  'function createSubscription(address merchant, uint256 interval, string subscriptionId) payable',
  'function paySubscription(string subscriptionId) payable',
  'function cancelSubscription(string subscriptionId)',
  'event PaymentMade(address indexed payer, address indexed merchant, uint256 amount, uint8 paymentType, string orderId, uint256 timestamp)',
  'event SubscriptionCreated(address indexed subscriber, address indexed merchant, uint256 amount, uint256 interval, string subscriptionId, uint256 timestamp)'
];

interface PaymentFormProps {
  provider: ethers.BrowserProvider | null;
  userAddress: string;
}

export default function PaymentForm({ provider, userAddress }: PaymentFormProps) {
  const [merchantAddress, setMerchantAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const makePayment = async () => {
    if (!provider || !userAddress) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!merchantAddress || !amount || !orderId) {
      setStatus({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    setIsProcessing(true);
    setStatus(null);

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const amountWei = ethers.parseEther(amount);
      
      const tx = await contract.makePayment(merchantAddress, orderId, {
        value: amountWei
      });

      setStatus({ type: 'success', message: `Transaction submitted: ${tx.hash}` });
      
      await tx.wait();
      
      setStatus({ type: 'success', message: 'Payment confirmed! Check your wallet.' });
      
      setMerchantAddress('');
      setAmount('');
      setOrderId('');
    } catch (err: any) {
      console.error('Payment error:', err);
      setStatus({ 
        type: 'error', 
        message: err.reason || err.message || 'Payment failed' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Make Payment</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Merchant Address
          </label>
          <input
            type="text"
            value={merchantAddress}
            onChange={(e) => setMerchantAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order ID
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="order_123456"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={makePayment}
          disabled={isProcessing || !userAddress}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>

        {status && (
          <div className={`p-4 rounded-lg ${
            status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
