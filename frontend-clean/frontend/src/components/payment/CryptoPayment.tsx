'use client';

import { useState } from 'react';
import { ArrowRight, Shield } from 'lucide-react';

export default function CryptoPayment() {
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [network, setNetwork] = useState('Ethereum Mainnet');

  const currencies = ['ETH', 'MATIC', 'BNB', 'XLM', 'USD', 'USDT'];
  const networks = ['Ethereum Mainnet', 'Polygon', 'BSC', 'Arbitrum', 'Optimism'];

  const estimatedUsd = parseFloat(amount || '0') * (selectedCurrency === 'ETH' ? 2450 : selectedCurrency === 'BNB' ? 320 : 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a] text-[#e8edf5] py-8 px-4" style={{ fontFamily: '"DM Sans", -apple-system, sans-serif' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-2">Make a Payment</h1>
        <p className="text-[#94a3b8] mb-8">Send crypto or fiat to anyone, anywhere</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Payment Details</h3>

            <div className="space-y-6">
              {/* Currency Selection */}
              <div>
                <label className="block text-[#94a3b8] text-sm font-semibold mb-2">Select Currency</label>
                <div className="grid grid-cols-3 gap-2">
                  {currencies.map(currency => (
                    <button
                      key={currency}
                      onClick={() => setSelectedCurrency(currency)}
                      className={`py-3 rounded-lg font-semibold text-sm transition ${
                        selectedCurrency === currency
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27]'
                          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Address */}
              <div>
                <label className="block text-[#94a3b8] text-sm font-semibold mb-2">Recipient Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#94a3b8] focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[#94a3b8] text-sm font-semibold mb-2">Amount</label>
                <div className="relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-4 pr-16 bg-white/5 border border-white/10 rounded-xl text-white text-2xl font-semibold placeholder-[#94a3b8] focus:outline-none focus:border-cyan-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] font-semibold">
                    {selectedCurrency}
                  </span>
                </div>
                <p className="text-[#94a3b8] text-sm mt-2">≈ ${estimatedUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</p>
              </div>

              {/* Network */}
              <div>
                <label className="block text-[#94a3b8] text-sm font-semibold mb-2">Network</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {networks.map(net => (
                    <option key={net} value={net} className="bg-[#1a1f3a]">{net}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-xl font-bold text-lg shadow-xl shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                Send Payment <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Transaction Summary</h3>

              <div className="space-y-4">
                {[
                  { label: 'Amount', value: `${amount || '0'} ${selectedCurrency}` },
                  { label: 'Network Fee', value: `0.002 ${selectedCurrency}` },
                  { label: 'Processing Fee', value: '$2.50' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between pb-4 border-b border-white/5">
                    <span className="text-[#94a3b8] font-semibold">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t-2 border-cyan-500/30">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-white font-bold text-lg">
                    {(parseFloat(amount || '0') + 0.002).toFixed(6)} {selectedCurrency}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex gap-4">
              <Shield size={24} className="text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-emerald-400 font-bold mb-1">Secure Transaction</h4>
                <p className="text-[#94a3b8] text-sm leading-relaxed">
                  Your payment is protected with bank-grade encryption and multi-signature verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
