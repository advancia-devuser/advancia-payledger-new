'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  Wallet, 
  Lock
} from 'lucide-react';

export default function CheckoutScreen() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'stripe'>('crypto');
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ETH');
  const [recipient, setRecipient] = useState('');

  const networks = ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism'];
  const currencies = ['ETH', 'BSC', 'XLM', 'USD'];

  const exchangeRate = currency === 'ETH' ? 2340 : currency === 'BSC' ? 320 : 1;
  const networkFee = 2.50;
  const total = (parseFloat(amount || '0') * exchangeRate) + networkFee;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="border-b-2 border-gray-400 bg-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <ArrowLeft 
            size={24} 
            className="text-gray-600 cursor-pointer hover:text-gray-800 transition" 
            onClick={() => router.push('/dashboard')}
          />
          <div className="text-xl font-bold text-gray-800">Send Payment</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Payment Method Selection */}
        <div className="border-2 border-gray-400 p-4 bg-white">
          <div className="text-lg font-bold text-gray-800 mb-4">Select Payment Method</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setPaymentMethod('crypto')}
              className={`border-2 p-4 cursor-pointer transition ${
                paymentMethod === 'crypto' 
                  ? 'border-gray-800 bg-gray-50' 
                  : 'border-gray-400 bg-white hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet size={24} className={paymentMethod === 'crypto' ? 'text-gray-800' : 'text-gray-600'} />
                <div>
                  <div className="font-bold text-gray-800">Cryptocurrency</div>
                  <div className="text-sm text-gray-600">ETH, BSC, XLM, ARB, OP</div>
                </div>
              </div>
            </div>
            <div 
              onClick={() => setPaymentMethod('stripe')}
              className={`border-2 p-4 cursor-pointer transition ${
                paymentMethod === 'stripe' 
                  ? 'border-gray-800 bg-gray-50' 
                  : 'border-gray-400 bg-white hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={24} className={paymentMethod === 'stripe' ? 'text-gray-800' : 'text-gray-600'} />
                <div>
                  <div className="font-bold text-gray-800">Credit Card / Stripe</div>
                  <div className="text-sm text-gray-600">Instant payment</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-2 border-gray-400 p-4 bg-white space-y-4">
          <div className="text-lg font-bold text-gray-800">Payment Details</div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Recipient Address</div>
            <div className="border-2 border-gray-400 p-3 flex items-center gap-3 bg-white">
              <User className="text-gray-400" size={20} />
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x... or wallet address"
                className="flex-1 outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Amount</div>
            <div className="flex gap-3">
              <div className="flex-1 border-2 border-gray-400 p-3 flex items-center gap-3 bg-white">
                <CreditCard className="text-gray-400" size={20} />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                />
              </div>
              <div className="border-2 border-gray-400 px-4 flex items-center bg-white">
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer"
                >
                  {currencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Network Fee</span>
              <span className="text-gray-800 font-medium">${networkFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="text-gray-800 font-medium">1 {currency} = ${exchangeRate.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-800">Total</span>
              <span className="text-gray-800">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Blockchain Selection */}
        {paymentMethod === 'crypto' && (
          <div className="border-2 border-gray-400 p-4 bg-white">
            <div className="text-sm font-medium text-gray-700 mb-3">Select Network</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {networks.map((network) => (
                <div 
                  key={network} 
                  onClick={() => setSelectedNetwork(network)}
                  className={`border-2 p-3 text-center cursor-pointer transition ${
                    selectedNetwork === network 
                      ? 'border-gray-800 bg-gray-50' 
                      : 'border-gray-400 hover:border-gray-800'
                  }`}
                >
                  <div className="font-medium text-gray-800 text-sm">{network}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={() => {
              alert('Payment sent! (Demo)');
              router.push('/dashboard');
            }}
            className="px-6 py-3 border-2 border-gray-800 bg-gray-800 text-white font-medium hover:bg-gray-700 transition"
          >
            Confirm & Send
          </button>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 border-2 border-gray-400 bg-white text-gray-800 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>

        {/* Security Notice */}
        <div className="border-2 border-blue-200 bg-blue-50 p-4 flex items-center gap-3">
          <Lock size={20} className="text-blue-600" />
          <div className="text-sm text-gray-700">
            <span className="font-medium">Secure Transaction</span> - All payments are encrypted and verified on the blockchain
          </div>
        </div>
      </div>
    </div>
  );
}
