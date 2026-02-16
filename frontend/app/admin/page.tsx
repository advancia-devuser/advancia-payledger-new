'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { isSupabaseFrontendEnabled, supabase } from '@/app/lib/supabaseClient';

function getAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
  const list = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return list.length > 0 ? list : ['admin@advanciapayledger.com'];
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [users, setUsers] = useState<Array<{ id: string; email: string; firstName: string; lastName: string; createdAt: string }>>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

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

  useEffect(() => {
    let cancelled = false;
    setIsLoadingUsers(true);

    const load = async () => {
      try {
        if (isSupabaseFrontendEnabled() && supabase) {
          const { data, error } = await supabase
            .from('registered_users')
            .select('user_id,email,first_name,last_name,created_at')
            .order('created_at', { ascending: false });

          if (cancelled) return;
          if (error) {
            setUsers([]);
            return;
          }

          const mapped = (data || []).map((r: any) => ({
            id: String(r.user_id),
            email: String(r.email || ''),
            firstName: String(r.first_name || ''),
            lastName: String(r.last_name || ''),
            createdAt: String(r.created_at || ''),
          }));
          setUsers(mapped);
          return;
        }

        const token = typeof window === 'undefined' ? null : localStorage.getItem('authToken');
        const res = await fetch('/api/admin/users', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (cancelled) return;
        setUsers(Array.isArray(data?.users) ? data.users : []);
      } catch {
        if (cancelled) return;
        setUsers([]);
      } finally {
        if (cancelled) return;
        setIsLoadingUsers(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

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

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900">Registered Users</h2>
          <p className="text-sm text-gray-600">Only admins can see this list.</p>

          {isLoadingUsers ? (
            <div className="mt-4 text-gray-700">Loading…</div>
          ) : users.length === 0 ? (
            <div className="mt-4 text-gray-700">No users yet.</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">User ID</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="p-2 text-gray-900">{u.email}</td>
                      <td className="p-2 text-gray-700">{(u.firstName || '') + ' ' + (u.lastName || '')}</td>
                      <td className="p-2 text-gray-700 font-mono">{u.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
