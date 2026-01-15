"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/lib/auth";

interface User {
  id: string;
  email: string;
  username: string;
  usdBalance: number;
  cryptoBalance: number;
  role: string;
  status: string;
}

interface TransferHistory {
  id: string;
  action: string;
  details: string;
  createdAt: string;
  ipAddress: string;
}

export default function SuperAdminConsole() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "send" | "withdraw" | "view" | "history"
  >("send");

  // Form states
  const [targetUserId, setTargetUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"USD" | "CRYPTO">("USD");
  const [reason, setReason] = useState("");
  const [notifyUser, setNotifyUser] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // View states
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [transferHistory, setTransferHistory] = useState<TransferHistory[]>([]);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser || currentUser.role !== "SUPERADMIN") {
      router.push("/admin/dashboard");
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleSendFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setMessage(null);

    try {
      const response = await authService.fetchWithAuth(
        "/api/internal/admin-funds/send-to-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: targetUserId,
            amount: parseFloat(amount),
            currency,
            reason,
            notifyUser,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Successfully sent ${amount} ${currency} to user`,
        });
        setTargetUserId("");
        setAmount("");
        setReason("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to send funds",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to send funds",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdrawFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setMessage(null);

    try {
      const response = await authService.fetchWithAuth(
        "/api/internal/admin-funds/withdraw-from-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: targetUserId,
            amount: parseFloat(amount),
            currency,
            reason,
            notifyUser,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Successfully withdrew ${amount} ${currency} from user`,
        });
        setTargetUserId("");
        setAmount("");
        setReason("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to withdraw funds",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to withdraw funds",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleViewBalance = async () => {
    if (!targetUserId) return;

    setProcessing(true);
    setMessage(null);

    try {
      const response = await authService.fetchWithAuth(
        `/api/internal/admin-funds/user-balance/${targetUserId}`
      );
      const data = await response.json();

      if (response.ok) {
        setViewedUser(data);
      } else {
        setMessage({ type: "error", text: data.error || "User not found" });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to fetch user balance",
      });
    } finally {
      setProcessing(false);
    }
  };

  const loadTransferHistory = async () => {
    try {
      const response = await authService.fetchWithAuth(
        "/api/internal/admin-funds/transfer-history?limit=50"
      );
      const data = await response.json();

      if (response.ok) {
        setTransferHistory(data.transfers || []);
      }
    } catch (error) {
      console.error("Failed to load transfer history:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      loadTransferHistory();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading Super Admin Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-purple-400 hover:text-purple-300 transition"
              >
                ← Back to Admin
              </Link>
              <div className="h-6 w-px bg-purple-500/30"></div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Super Admin Console
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-purple-300 text-sm">🔐 {user?.email}</span>
              <button
                onClick={() => {
                  authService.logout();
                  router.push("/login");
                }}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Banner */}
        <div className="mb-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-red-300 font-semibold">
                Confidential - Internal Use Only
              </p>
              <p className="text-red-200/80 text-sm">
                All actions are logged and audited. Use responsibly.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { id: "send", label: "💸 Send Funds", icon: "💸" },
            { id: "withdraw", label: "💰 Withdraw Funds", icon: "💰" },
            { id: "view", label: "👁️ View Balance", icon: "👁️" },
            { id: "history", label: "📜 History", icon: "📜" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/5 text-purple-300 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.type === "success"
                ? "bg-green-500/20 border border-green-500/30 text-green-300"
                : "bg-red-500/20 border border-red-500/30 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Content */}
        <div className="bg-gradient-to-br from-gray-800/50 to-purple-900/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
          {/* Send Funds Tab */}
          {activeTab === "send" && (
            <form onSubmit={handleSendFunds} className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-300 mb-6">
                Send Funds to User
              </h2>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none"
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 font-semibold mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-300 font-semibold mb-2">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) =>
                      setCurrency(e.target.value as "USD" | "CRYPTO")
                    }
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="CRYPTO">CRYPTO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">
                  Reason (Internal)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none"
                  placeholder="Reason for sending funds..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="notifyUser"
                  checked={notifyUser}
                  onChange={(e) => setNotifyUser(e.target.checked)}
                  className="w-5 h-5 rounded border-purple-500/30 bg-black/30 text-purple-500 focus:ring-purple-500"
                />
                <label htmlFor="notifyUser" className="text-purple-300">
                  Send email notification to user
                </label>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition shadow-lg shadow-green-500/30 disabled:opacity-50"
              >
                {processing ? "Processing..." : "💸 Send Funds"}
              </button>
            </form>
          )}

          {/* Withdraw Funds Tab */}
          {activeTab === "withdraw" && (
            <form onSubmit={handleWithdrawFunds} className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-300 mb-6">
                Withdraw Funds from User
              </h2>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none"
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 font-semibold mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-300 font-semibold mb-2">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) =>
                      setCurrency(e.target.value as "USD" | "CRYPTO")
                    }
                    className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="CRYPTO">CRYPTO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">
                  Reason (Internal)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none"
                  placeholder="Reason for withdrawing funds..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="notifyUserWithdraw"
                  checked={notifyUser}
                  onChange={(e) => setNotifyUser(e.target.checked)}
                  className="w-5 h-5 rounded border-purple-500/30 bg-black/30 text-purple-500 focus:ring-purple-500"
                />
                <label htmlFor="notifyUserWithdraw" className="text-purple-300">
                  Send email notification to user
                </label>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/30 disabled:opacity-50"
              >
                {processing ? "Processing..." : "💰 Withdraw Funds"}
              </button>
            </form>
          )}

          {/* View Balance Tab */}
          {activeTab === "view" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-300 mb-6">
                View User Balance
              </h2>

              <div className="flex space-x-4">
                <input
                  type="text"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="flex-1 px-4 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none"
                  placeholder="Enter user ID"
                />
                <button
                  onClick={handleViewBalance}
                  disabled={processing || !targetUserId}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition shadow-lg shadow-purple-500/30 disabled:opacity-50"
                >
                  {processing ? "Loading..." : "👁️ View"}
                </button>
              </div>

              {viewedUser && (
                <div className="mt-8 space-y-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-purple-300 mb-4">
                      User Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-purple-400 text-sm">Email</p>
                        <p className="text-white font-semibold">
                          {viewedUser.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-purple-400 text-sm">Username</p>
                        <p className="text-white font-semibold">
                          {viewedUser.username}
                        </p>
                      </div>
                      <div>
                        <p className="text-purple-400 text-sm">Role</p>
                        <p className="text-white font-semibold">
                          {viewedUser.role}
                        </p>
                      </div>
                      <div>
                        <p className="text-purple-400 text-sm">Status</p>
                        <p className="text-white font-semibold">
                          {viewedUser.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
                      <p className="text-green-400 text-sm mb-2">USD Balance</p>
                      <p className="text-3xl font-bold text-white">
                        ${viewedUser.usdBalance.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6">
                      <p className="text-blue-400 text-sm mb-2">
                        Crypto Balance
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {viewedUser.cryptoBalance.toFixed(8)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-300 mb-6">
                Transfer History
              </h2>

              <div className="space-y-3">
                {transferHistory.length === 0 ? (
                  <p className="text-purple-400 text-center py-8">
                    No transfer history found
                  </p>
                ) : (
                  transferHistory.map((transfer) => {
                    const details = JSON.parse(transfer.details);
                    return (
                      <div
                        key={transfer.id}
                        className="bg-black/30 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">
                                {transfer.action === "ADMIN_FUND_TRANSFER"
                                  ? "💸"
                                  : "💰"}
                              </span>
                              <div>
                                <p className="text-white font-semibold">
                                  {transfer.action === "ADMIN_FUND_TRANSFER"
                                    ? "Funds Sent"
                                    : "Funds Withdrawn"}
                                </p>
                                <p className="text-purple-400 text-sm">
                                  {new Date(
                                    transfer.createdAt
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="ml-11 space-y-1 text-sm">
                              <p className="text-purple-300">
                                <span className="text-purple-400">Amount:</span>{" "}
                                {details.amount} {details.currency}
                              </p>
                              <p className="text-purple-300">
                                <span className="text-purple-400">
                                  User ID:
                                </span>{" "}
                                {details.targetUserId}
                              </p>
                              {details.reason && (
                                <p className="text-purple-300">
                                  <span className="text-purple-400">
                                    Reason:
                                  </span>{" "}
                                  {details.reason}
                                </p>
                              )}
                              <p className="text-purple-400 text-xs">
                                IP: {transfer.ipAddress}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
