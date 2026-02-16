'use client';

import { useState, useEffect } from 'react';
import { authApi, walletApi, transactionApi } from '../lib/api';

export default function TestIsolationPage() {
  const [user1Data, setUser1Data] = useState<any>(null);
  const [user2Data, setUser2Data] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testUserIsolation = async () => {
    setLoading(true);
    
    try {
      // Test User 1 (Alice)
      const user1Login = await authApi.login('user1@test.com', 'Test123456');
      if (user1Login.data?.token) {
        const user1Wallets = await walletApi.getWallets();
        const user1Transactions = await transactionApi.getTransactions();
        
        setUser1Data({
          user: user1Login.data.user,
          wallets: user1Wallets.data?.wallets || [],
          transactions: user1Transactions.data?.transactions || []
        });
      }

      // Test User 2 (Bob)
      const user2Login = await authApi.login('user2@test.com', 'Test123456');
      if (user2Login.data?.token) {
        const user2Wallets = await walletApi.getWallets();
        const user2Transactions = await transactionApi.getTransactions();
        
        setUser2Data({
          user: user2Login.data.user,
          wallets: user2Wallets.data?.wallets || [],
          transactions: user2Transactions.data?.transactions || []
        });
      }
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Isolation Test</h1>
        
        <button
          onClick={testUserIsolation}
          disabled={loading}
          className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test User Isolation'}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User 1 Data */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">User 1 (Alice)</h2>
            {user1Data ? (
              <div className="space-y-4">
                <div>
                  <strong>Email:</strong> {user1Data.user?.email}
                </div>
                <div>
                  <strong>User ID:</strong> {user1Data.user?.id}
                </div>
                <div>
                  <strong>Wallets ({user1Data.wallets.length}):</strong>
                  <ul className="ml-4 mt-2 space-y-1">
                    {user1Data.wallets.map((wallet: any) => (
                      <li key={wallet.id} className="text-sm">
                        {wallet.currency}: {wallet.balance} ({wallet.type})
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Transactions ({user1Data.transactions.length}):</strong>
                  <ul className="ml-4 mt-2 space-y-1">
                    {user1Data.transactions.map((tx: any) => (
                      <li key={tx.id} className="text-sm">
                        {tx.type} {tx.amount} {tx.currency} - {tx.status}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Not tested yet</p>
            )}
          </div>

          {/* User 2 Data */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-600 mb-4">User 2 (Bob)</h2>
            {user2Data ? (
              <div className="space-y-4">
                <div>
                  <strong>Email:</strong> {user2Data.user?.email}
                </div>
                <div>
                  <strong>User ID:</strong> {user2Data.user?.id}
                </div>
                <div>
                  <strong>Wallets ({user2Data.wallets.length}):</strong>
                  <ul className="ml-4 mt-2 space-y-1">
                    {user2Data.wallets.map((wallet: any) => (
                      <li key={wallet.id} className="text-sm">
                        {wallet.currency}: {wallet.balance} ({wallet.type})
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Transactions ({user2Data.transactions.length}):</strong>
                  <ul className="ml-4 mt-2 space-y-1">
                    {user2Data.transactions.map((tx: any) => (
                      <li key={tx.id} className="text-sm">
                        {tx.type} {tx.amount} {tx.currency} - {tx.status}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Not tested yet</p>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Expected Results:</h3>
          <ul className="list-disc list-inside text-yellow-700 space-y-1">
            <li>Alice should see only her BTC wallet and transaction</li>
            <li>Bob should see only his ETH wallet and no transactions</li>
            <li>Each user should have different User IDs</li>
            <li>No data crossover between users</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
