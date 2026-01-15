import { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CONTRACT_ABI = [
  'function createSubscription(address merchant, uint256 interval, string subscriptionId) payable',
  'function paySubscription(string subscriptionId) payable',
  'function cancelSubscription(string subscriptionId)',
  'function isPaymentDue(string subscriptionId) view returns (bool)'
];

interface SubscriptionFormProps {
  provider: ethers.BrowserProvider | null;
  userAddress: string;
}

export default function SubscriptionForm({ provider, userAddress }: SubscriptionFormProps) {
  const [merchantAddress, setMerchantAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [intervalDays, setIntervalDays] = useState('30');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const createSubscription = async () => {
    if (!provider || !userAddress) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!merchantAddress || !amount || !subscriptionId) {
      setStatus({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    setIsProcessing(true);
    setStatus(null);

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const amountWei = ethers.parseEther(amount);
      const intervalSeconds = parseInt(intervalDays) * 24 * 60 * 60;
      
      const tx = await contract.createSubscription(
        merchantAddress,
        intervalSeconds,
        subscriptionId,
        { value: amountWei }
      );

      setStatus({ type: 'success', message: `Transaction submitted: ${tx.hash}` });
      
      await tx.wait();
      
      setStatus({ 
        type: 'success', 
        message: `Subscription created! First payment processed. Next payment due in ${intervalDays} days.` 
      });
      
      setMerchantAddress('');
      setAmount('');
      setSubscriptionId('');
    } catch (err: any) {
      console.error('Subscription error:', err);
      setStatus({ 
        type: 'error', 
        message: err.reason || err.message || 'Subscription creation failed' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const paySubscription = async () => {
    if (!provider || !userAddress || !subscriptionId || !amount) {
      setStatus({ type: 'error', message: 'Please provide subscription ID and amount' });
      return;
    }

    setIsProcessing(true);
    setStatus(null);

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const amountWei = ethers.parseEther(amount);
      
      const tx = await contract.paySubscription(subscriptionId, {
        value: amountWei
      });

      setStatus({ type: 'success', message: `Payment submitted: ${tx.hash}` });
      
      await tx.wait();
      
      setStatus({ type: 'success', message: 'Subscription payment confirmed!' });
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

  const cancelSubscription = async () => {
    if (!provider || !userAddress || !subscriptionId) {
      setStatus({ type: 'error', message: 'Please provide subscription ID' });
      return;
    }

    setIsProcessing(true);
    setStatus(null);

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tx = await contract.cancelSubscription(subscriptionId);

      setStatus({ type: 'success', message: `Cancellation submitted: ${tx.hash}` });
      
      await tx.wait();
      
      setStatus({ type: 'success', message: 'Subscription cancelled successfully!' });
      setSubscriptionId('');
    } catch (err: any) {
      console.error('Cancellation error:', err);
      setStatus({ 
        type: 'error', 
        message: err.reason || err.message || 'Cancellation failed' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Subscription Management</h2>
      
      <div className="space-y-6">
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Subscription</h3>
          
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
                Amount per Payment (ETH)
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
                Billing Interval (Days)
              </label>
              <input
                type="number"
                value={intervalDays}
                onChange={(e) => setIntervalDays(e.target.value)}
                placeholder="30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscription ID
              </label>
              <input
                type="text"
                value={subscriptionId}
                onChange={(e) => setSubscriptionId(e.target.value)}
                placeholder="sub_123456"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={createSubscription}
              disabled={isProcessing || !userAddress}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
            >
              {isProcessing ? 'Processing...' : 'Create Subscription'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Manage Existing Subscription</h3>
          
          <div className="flex gap-2">
            <button
              onClick={paySubscription}
              disabled={isProcessing || !userAddress}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-semibold"
            >
              Pay Now
            </button>
            <button
              onClick={cancelSubscription}
              disabled={isProcessing || !userAddress}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>

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
