"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Wallet,
  CreditCard,
  TrendingUp,
  Bell,
  Download,
  Upload,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { authService } from "@/lib/auth";

interface UserData {
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  balance: number;
  cryptoBalance: number;
  trustScore: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
}

export default function DarkDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
    loadTransactions();
  }, []);

  const loadUserData = async () => {
    try {
      if (!authService.isAuthenticated()) {
        router.push("/login");
        return;
      }

      const response = await authService.fetchWithAuth("/api/dashboard/stats");
      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          router.push("/login");
          return;
        }
        throw new Error("Failed to load user data");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
      authService.logout();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await authService.fetchWithAuth(
        "/api/dashboard/transactions?page=1&limit=5"
      );
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([loadUserData(), loadTransactions()]);
    setRefreshing(false);
  };

  const formatAmount = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return numAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-[#94a3b8]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const totalBalance = (user?.balance || 0) + (user?.cryptoBalance || 0);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a] text-[#e8edf5]"
      style={{ fontFamily: '"DM Sans", -apple-system, sans-serif' }}
    >
      {/* Header */}
      <header className="bg-[#0a0e27]/80 backdrop-blur-xl border-b border-cyan-500/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center font-extrabold text-xl text-[#0a0e27] shadow-lg shadow-cyan-500/30">
                A
              </div>
              <div>
                <h1 className="font-bold text-xl">Advancia Pay</h1>
                <p className="text-[#94a3b8] text-sm">
                  Welcome back, {user?.firstName || "User"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </button>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition flex items-center gap-2 font-semibold disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0a0e27] rounded-lg font-bold shadow-lg shadow-cyan-500/30 flex items-center gap-2">
                <Download size={18} />
                Deposit
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Balance */}
          <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-cyan-500/30">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <p className="text-[#0a0e27]/80 font-semibold mb-1">
                Total Balance
              </p>
              <h2 className="text-4xl font-extrabold text-[#0a0e27] mb-3">
                ${formatAmount(totalBalance)}
              </h2>
              <div className="flex items-center gap-2 text-[#0a0e27]">
                <TrendingUp size={16} />
                <span className="font-semibold">+12.5% this month</span>
              </div>
            </div>
          </div>

          {/* Available USD */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <p className="text-[#94a3b8] font-semibold mb-1">Available USD</p>
            <h2 className="text-4xl font-extrabold text-white mb-3">
              ${formatAmount(user?.balance || 0)}
            </h2>
            <button className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 font-semibold text-sm hover:bg-emerald-500/30 transition">
              Withdraw to Bank
            </button>
          </div>

          {/* Crypto Holdings */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <p className="text-[#94a3b8] font-semibold mb-1">Crypto Holdings</p>
            <h2 className="text-4xl font-extrabold text-white mb-3">
              ${formatAmount(user?.cryptoBalance || 0)}
            </h2>
            <div className="flex gap-2 flex-wrap">
              {["ETH", "MATIC", "BNB", "XLM"].map((token) => (
                <span
                  key={token}
                  className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-semibold text-purple-400"
                >
                  {token}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">
              Recent Transactions
            </h3>
            <button className="text-cyan-400 font-semibold flex items-center gap-1 hover:text-cyan-300 transition">
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-[#94a3b8]">
                <Wallet size={48} className="mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:bg-white/[0.04] transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        tx.type === "DEPOSIT"
                          ? "bg-emerald-500/20"
                          : tx.type === "WITHDRAWAL"
                          ? "bg-red-500/20"
                          : "bg-amber-500/20"
                      }`}
                    >
                      {tx.type === "DEPOSIT" ? (
                        <Download size={20} className="text-emerald-400" />
                      ) : tx.type === "WITHDRAWAL" ? (
                        <Upload size={20} className="text-red-400" />
                      ) : (
                        <CreditCard size={20} className="text-amber-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white capitalize">
                        {tx.type.toLowerCase()}
                      </p>
                      <p className="text-[#94a3b8] text-sm">
                        {tx.currency} • {formatDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        tx.type === "DEPOSIT"
                          ? "text-emerald-400"
                          : "text-white"
                      }`}
                    >
                      {tx.type === "DEPOSIT" ? "+" : "-"}$
                      {formatAmount(tx.amount)}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.status === "COMPLETED"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : tx.status === "PENDING"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {tx.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            {
              icon: Download,
              label: "Deposit",
              color: "from-cyan-400 to-blue-500",
            },
            {
              icon: Upload,
              label: "Withdraw",
              color: "from-emerald-400 to-emerald-600",
            },
            {
              icon: CreditCard,
              label: "Send Payment",
              color: "from-purple-400 to-purple-600",
            },
            {
              icon: Wallet,
              label: "Manage Wallet",
              color: "from-amber-400 to-amber-600",
            },
          ].map((action, idx) => (
            <button
              key={idx}
              className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.05] transition group"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg`}
              >
                <action.icon size={24} className="text-white" />
              </div>
              <p className="font-semibold text-white">{action.label}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
