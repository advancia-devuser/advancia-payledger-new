'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BINInfo {
  bin: string;
  brand: string;
  type: string;
  category: string;
  issuer: string;
  country: string;
  countryCode: string;
  website: string;
  phone: string;
  valid: boolean;
}

export default function BINCheckerPage() {
  const [binNumber, setBinNumber] = useState('');
  const [binInfo, setBinInfo] = useState<BINInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (binNumber.length < 6) {
      setError('Please enter at least 6 digits');
      setLoading(false);
      return;
    }

    try {
      // Call BIN checker API
      const response = await fetch(`/api/bin-checker/${binNumber.substring(0, 6)}`);
      const data = await response.json();

      if (data.valid) {
        setBinInfo(data);
      } else {
        setError('Invalid BIN number');
      }
    } catch (err) {
      setError('Failed to check BIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/landing" className="text-2xl font-bold text-white">
            Advancia Pay
          </Link>
          <div className="flex items-center space-x-8">
            <Link href="/landing" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link href="/auth/login" className="text-gray-300 hover:text-white transition">Login</Link>
            <Link href="/auth/register" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              BIN Checker Tool
            </h1>
            <p className="text-xl text-gray-300">
              Verify card BIN/IIN codes and get detailed information about card issuers
            </p>
          </div>

          {/* BIN Checker Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <form onSubmit={handleCheck} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Enter BIN/IIN (First 6 digits of card number)
                </label>
                <input
                  type="text"
                  value={binNumber}
                  onChange={(e) => setBinNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                  placeholder="e.g., 424242"
                  className="w-full px-6 py-4 rounded-lg text-gray-900 text-xl font-mono focus:outline-none focus:ring-2 focus:ring-purple-600"
                  maxLength={16}
                />
                <p className="text-gray-400 text-sm mt-2">
                  Enter at least the first 6 digits of any card number
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || binNumber.length < 6}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? 'Checking...' : 'Check BIN'}
              </button>
            </form>
          </div>

          {/* BIN Information Display */}
          {binInfo && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Card Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">BIN/IIN</div>
                    <div className="text-white font-mono text-lg">{binInfo.bin}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Card Brand</div>
                    <div className="text-white text-lg font-semibold">{binInfo.brand}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Card Type</div>
                    <div className="text-white text-lg">{binInfo.type}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Card Category</div>
                    <div className="text-white text-lg">{binInfo.category}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Issuing Bank</div>
                    <div className="text-white text-lg">{binInfo.issuer}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Country</div>
                    <div className="text-white text-lg">{binInfo.country} ({binInfo.countryCode})</div>
                  </div>

                  {binInfo.website && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Bank Website</div>
                      <a href={binInfo.website} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-lg">
                        {binInfo.website}
                      </a>
                    </div>
                  )}

                  {binInfo.phone && (
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Bank Phone</div>
                      <div className="text-white text-lg">{binInfo.phone}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* What is BIN Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">What is a BIN?</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                A BIN (Bank Identification Number) is the first 6 digits of a payment card number. It identifies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payment network (Visa, Mastercard, etc.)</li>
                <li>Issuing bank (Citi, Wells Fargo, TD, etc.)</li>
                <li>Country of issuance</li>
                <li>Type of card (Credit or Debit)</li>
                <li>Card category (Standard, Classic, Gold, Platinum, etc.)</li>
              </ul>
            </div>
          </div>

          {/* How BIN Verification Works */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">How BIN Verification Works</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                The BIN concept was established by the International Organization for Standardization (ISO) to simplify and standardize the identification process for banks. BINs are part of the global financial system.
              </p>
              
              <div className="space-y-3">
                <h3 className="text-white font-semibold">Verification Process:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Customer enters card details for a purchase</li>
                  <li>Payment system reads the BIN to identify the issuing bank</li>
                  <li>Payment request is sent to the issuing bank</li>
                  <li>Bank verifies the BIN data to prevent fraud</li>
                  <li>Transaction is approved or declined based on verification</li>
                </ol>
              </div>

              <p className="text-sm text-gray-400 mt-4">
                The Major Industry Identifier (MII) is the first digit: 1-2 for airlines, 4-5 for banks/financial institutions like Visa or MasterCard.
              </p>
            </div>
          </div>

          {/* How to Use Guide */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">How to Use BIN Checker</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Enter BIN Number</h3>
                  <p className="text-gray-300">Enter the first 6 digits of any card number into the search field above.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Click Check</h3>
                  <p className="text-gray-300">Click the "Check BIN" button to verify the number.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">View Results</h3>
                  <p className="text-gray-300">See complete information about the card issuer, including card type, bank name, country, and other details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
