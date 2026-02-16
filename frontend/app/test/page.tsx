'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { walletApi, transactionApi } from '@/app/lib/api';
import AuthForm from '@/app/components/AuthForm';

/**
 * API Test Page
 * Demonstrates full backend integration with authentication, wallets, and transactions
 */
export default function ApiTestPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: string }>({});

  // Load wallets and transactions when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setWallets([]);
      setTransactions([]);
    }
  }, [isAuthenticated]);

  async function loadData() {
    setIsLoadingData(true);
    
    // Load wallets
    const walletsResponse = await walletApi.getWallets();
    if (walletsResponse.data?.wallets) {
      setWallets(walletsResponse.data.wallets);
      setTestResults(prev => ({ ...prev, wallets: '✅ Loaded successfully' }));
    }

    // Load transactions
    const txResponse = await transactionApi.getTransactions({ limit: 10 });
    if (txResponse.data?.transactions) {
      setTransactions(txResponse.data.transactions);
      setTestResults(prev => ({ ...prev, transactions: '✅ Loaded successfully' }));
    }

    setIsLoadingData(false);
  }

  async function testCreateWallet() {
    const currencies = ['BTC', 'ETH', 'USDT', 'USD'];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const type = currency === 'USD' ? 'fiat' : 'crypto';
    
    const response = await walletApi.createWallet(
      type,
      currency,
      type === 'crypto' ? '0x' + Math.random().toString(36).substring(2, 42) : undefined
    );

    if (response.data) {
      setTestResults(prev => ({ ...prev, createWallet: '✅ Wallet created' }));
      loadData();
    } else {
      setTestResults(prev => ({ ...prev, createWallet: '❌ ' + response.error }));
    }
  }

  async function testCreateTransaction() {
    if (wallets.length === 0) {
      setTestResults(prev => ({ ...prev, createTx: '❌ No wallets available' }));
      return;
    }

    const wallet = wallets[0];
    const response = await transactionApi.createTransaction(
      'receive',
      wallet.currency,
      Math.random() * 10,
      '0x' + Math.random().toString(36).substring(2, 42)
    );

    if (response.data) {
      setTestResults(prev => ({ ...prev, createTx: '✅ Transaction created' }));
      loadData();
    } else {
      setTestResults(prev => ({ ...prev, createTx: '❌ ' + response.error }));
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Backend API Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Testing in-memory backend integration
          </p>
          <div className="mt-2 inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
            Backend: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}
          </div>
        </div>

        {/* Authentication Section */}
        <div className="mb-8">
          <AuthForm redirectTo={null} />
        </div>

        {/* Authenticated Features */}
        {isAuthenticated && user && (
          <div className="space-y-8">
            {/* User Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">👤 Authenticated User</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">ID:</span> {user.id}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-semibold">Name:</span> {user.firstName} {user.lastName}
                </div>
              </div>
            </div>

            {/* API Tests */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">🔧 API Tests</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={loadData}
                  disabled={isLoadingData}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition"
                >
                  {isLoadingData ? 'Loading...' : '🔄 Refresh Data'}
                </button>
                <button
                  onClick={testCreateWallet}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  💰 Create Random Wallet
                </button>
                <button
                  onClick={testCreateTransaction}
                  disabled={wallets.length === 0}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition"
                >
                  📤 Create Transaction
                </button>
              </div>

              {/* Test Results */}
              {Object.keys(testResults).length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded border">
                  <h3 className="font-semibold mb-2">Test Results:</h3>
                  {Object.entries(testResults).map(([key, result]) => (
                    <div key={key} className="text-sm">
                      <span className="font-mono text-gray-600">{key}:</span> {result}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wallets Display */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">
                💳 Wallets ({wallets.length})
              </h2>
              {wallets.length === 0 ? (
                <p className="text-gray-500">No wallets yet. Create one to get started!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {wallet.currency}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Type: <span className="font-semibold">{wallet.type}</span>
                      </div>
                      <div className="text-lg font-semibold mb-2">
                        Balance: {wallet.balance}
                      </div>
                      {wallet.address && (
                        <div className="text-xs text-gray-500 font-mono truncate">
                          {wallet.address}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transactions Display */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">
                📊 Transactions ({transactions.length})
              </h2>
              {transactions.length === 0 ? (
                <p className="text-gray-500">No transactions yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Currency</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              tx.type === 'send' ? 'bg-red-100 text-red-800' :
                              tx.type === 'receive' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-4 py-2 font-semibold">{tx.currency}</td>
                          <td className="px-4 py-2 text-right font-mono">{tx.amount}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                              tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-500">
                            {new Date(tx.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>✅ In-memory backend - data resets on server restart</p>
          <p className="mt-2">
            See{' '}
            <a
              href="https://github.com/advancia-devuser/advancia-payledger-new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
            {' '}for source code
          </p>
        </div>
      </div>
    </div>
  );
}
