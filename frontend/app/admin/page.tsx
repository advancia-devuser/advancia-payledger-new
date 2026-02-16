'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

function getAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const isAdmin = useMemo(() => {
    if (!user?.email) return false;
    const admins = getAdminEmails();
    if (admins.length === 0) return false;
    return admins.includes(user.email.toLowerCase());
  }, [user?.email]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/dashboard');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-700">Not authorized.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 text-sm">Management view</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
          >
            Back
          </button>
        </div>

        <div className="mt-6 text-gray-700">
          Admin tools go here.
        </div>
      </div>
    </div>
  );
}
