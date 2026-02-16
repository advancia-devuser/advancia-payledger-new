'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import AuthForm from '@/app/components/AuthForm';
import { walletApi } from '@/app/lib/api';
import { isSupabaseFrontendEnabled } from '@/app/lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [wallets, setWallets] = useState<Array<{ id: string; currency: string; balance: number; type: string }>>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(false);

  useEffect(() => {
    if (isSupabaseFrontendEnabled()) {
      setIsLoadingWallets(false);
      setWallets([]);
      return;
    }

    if (!isAuthenticated) {
      setWallets([]);
      return;
    }

    let cancelled = false;
    setIsLoadingWallets(true);
    walletApi.getWallets().then((res) => {
      if (cancelled) return;
      setWallets(res.data?.wallets || []);
      setIsLoadingWallets(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const balanceByCurrency = useMemo(() => {
    const map = new Map<string, number>();
    for (const wallet of wallets) {
      map.set(wallet.currency.toUpperCase(), Number(wallet.balance) || 0);
    }
    return map;
  }, [wallets]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <p className="text-gray-600 mb-6">Sign in to view your profile and balances.</p>
          <AuthForm redirectTo="/dashboard" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.firstName || user.email}</h1>
            <p className="text-gray-600 text-sm">Profile dashboard</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 hover:bg-gray-100"
            >
              Home
            </button>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="text-gray-700"><span className="font-semibold">Email:</span> {user.email}</div>
            <div className="text-gray-700"><span className="font-semibold">User ID:</span> {user.id}</div>
            <div className="text-gray-700"><span className="font-semibold">Name:</span> {(user.firstName || '') + ' ' + (user.lastName || '')}</div>
            <div className="text-gray-700"><span className="font-semibold">Status:</span> Active</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Balances</h2>
          <p className="text-gray-600 text-sm mb-4">New accounts start with empty balances.</p>

          {isLoadingWallets ? (
            <div className="text-gray-600">Loading balances…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['BTC', 'ETH', 'USDT'].map((currency) => (
                <div key={currency} className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600">{currency}</div>
                  <div className="text-2xl font-bold text-gray-900">{balanceByCurrency.get(currency) ?? 0}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
