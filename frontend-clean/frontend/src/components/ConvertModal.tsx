'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExchangeRate {
  usd: number;
  name: string;
}

interface Rates {
  [key: string]: ExchangeRate;
}

export default function ConvertModal({ isOpen, onClose }: ConvertModalProps) {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [rate, setRate] = useState(0);
  const [rates, setRates] = useState<Rates>({});
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', type: 'fiat' },
    { code: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto' },
    { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', type: 'crypto' },
    { code: 'USDT', name: 'Tether', symbol: '₮', type: 'crypto' },
    { code: 'USDC', name: 'USD Coin', symbol: '$', type: 'crypto' },
    { code: 'BNB', name: 'Binance Coin', symbol: 'BNB', type: 'crypto' },
    { code: 'SOL', name: 'Solana', symbol: 'SOL', type: 'crypto' },
    { code: 'XRP', name: 'Ripple', symbol: 'XRP', type: 'crypto' },
    { code: 'ADA', name: 'Cardano', symbol: 'ADA', type: 'crypto' },
    { code: 'DOGE', name: 'Dogecoin', symbol: 'Ð', type: 'crypto' },
    { code: 'TRX', name: 'Tron', symbol: 'TRX', type: 'crypto' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchRates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (amount && rates[fromCurrency] && rates[toCurrency]) {
      calculateConversion();
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/convert/rates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setRates(data.rates);
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateConversion = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setConvertedAmount(0);
      setFee(0);
      setRate(0);
      return;
    }

    let converted = 0;
    let exchangeRate = 0;

    if (fromCurrency === 'USD') {
      exchangeRate = rates[toCurrency]?.usd || 0;
      converted = amountNum / exchangeRate;
    } else if (toCurrency === 'USD') {
      exchangeRate = rates[fromCurrency]?.usd || 0;
      converted = amountNum * exchangeRate;
    } else {
      const fromRate = rates[fromCurrency]?.usd || 0;
      const toRate = rates[toCurrency]?.usd || 0;
      const usdAmount = amountNum * fromRate;
      converted = usdAmount / toRate;
      exchangeRate = fromRate / toRate;
    }

    const conversionFee = converted * 0.005; // 0.5% fee
    setConvertedAmount(converted - conversionFee);
    setFee(conversionFee);
    setRate(exchangeRate);
  };

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setConverting(true);
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fromCurrency,
          toCurrency,
          amount: parseFloat(amount)
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Successfully converted ${amount} ${fromCurrency} to ${data.conversion.to.amount.toFixed(8)} ${toCurrency}`);
        setAmount('');
        setConvertedAmount(0);
        onClose();
      } else {
        alert(`Conversion failed: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to process conversion. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Convert Currency</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* From Currency */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              From
            </label>
            <div className="flex gap-3">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              To
            </label>
            <div className="flex gap-3">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </option>
                ))}
              </select>
              <div className="flex-1 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 font-semibold">
                {convertedAmount > 0 ? convertedAmount.toFixed(8) : '0.00'}
              </div>
            </div>
          </div>

          {/* Conversion Details */}
          {convertedAmount > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Exchange Rate:</span>
                <span className="text-gray-900 font-semibold">
                  1 {fromCurrency} = {rate.toFixed(8)} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fee (0.5%):</span>
                <span className="text-gray-900 font-semibold">
                  {fee.toFixed(8)} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-purple-200">
                <span className="text-gray-900 font-semibold">You'll receive:</span>
                <span className="text-purple-600 font-bold">
                  {convertedAmount.toFixed(8)} {toCurrency}
                </span>
              </div>
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={converting || !amount || parseFloat(amount) <= 0 || loading}
            className={`w-full py-4 rounded-lg font-semibold text-white transition ${
              converting || !amount || parseFloat(amount) <= 0 || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {converting ? 'Converting...' : loading ? 'Loading rates...' : 'Convert Now'}
          </button>

          {/* Info */}
          <div className="text-center text-xs text-gray-500">
            <p>Conversions are processed instantly</p>
            <p className="mt-1">Real-time exchange rates • 0.5% conversion fee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
