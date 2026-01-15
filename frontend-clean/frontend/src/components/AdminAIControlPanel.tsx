"use client";
import React, { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  aiEnabled: boolean;
  aiMonthlyLimit: number;
  monthlySpent: number;
  utilizationPercent: number;
}

interface Analytics {
  summary: {
    totalCost: number;
    totalTokens: number;
    totalRequests: number;
    avgCostPerRequest: number;
  };
  topUsers: Array<{ userId: string; _sum: { costUsd: number } }>;
  modelUsage: Array<{
    model: string;
    provider: string;
    _sum: { costUsd: number };
  }>;
  costByProvider: Array<{ provider: string; _sum: { costUsd: number } }>;
}

export function AdminAIControlPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");

      // Fetch users
      const usersResponse = await fetch("/api/admin/ai/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch analytics
      const analyticsResponse = await fetch("/api/admin/ai/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch status
      const statusResponse = await fetch("/api/admin/ai/status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setStatus(statusData);
      }
    } catch (error) {
      console.error("Error fetching AI data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserAI = async (userId: string, enabled: boolean) => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      const response = await fetch(`/api/admin/ai/users/${userId}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, aiEnabled: enabled } : user
          )
        );
      }
    } catch (error) {
      console.error("Error toggling user AI:", error);
    }
  };

  const updateUserLimit = async (userId: string, limit: number) => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      const response = await fetch(`/api/admin/ai/users/${userId}/limit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ limit }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, aiMonthlyLimit: limit } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating user limit:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      {status && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">AI Service Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  status.overall === "healthy" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <p className="text-sm text-gray-600">Overall Status</p>
              <p className="font-semibold capitalize">{status.overall}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {status.activeModels || 0}
              </div>
              <p className="text-sm text-gray-600">Active Models</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {status.queueSize || 0}
              </div>
              <p className="text-sm text-gray-600">Queue Size</p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Overview */}
      {analytics && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Usage Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-xl font-bold">
                ${analytics.summary.totalCost.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tokens</p>
              <p className="text-xl font-bold">
                {analytics.summary.totalTokens.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-xl font-bold">
                {analytics.summary.totalRequests.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Cost/Request</p>
              <p className="text-xl font-bold">
                ${analytics.summary.avgCostPerRequest.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Model Usage */}
          <div className="space-y-4">
            <h3 className="font-semibold">Model Usage</h3>
            <div className="space-y-2">
              {analytics.modelUsage.map((model, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">
                    {model.model} ({model.provider})
                  </span>
                  <span className="text-sm font-medium">
                    ${model._sum.costUsd.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Management */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">User AI Access</h2>
          <button
            onClick={() => setShowUserModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Manage Users
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">AI Status</th>
                <th className="text-left p-2">Monthly Limit</th>
                <th className="text-left p-2">Spent</th>
                <th className="text-left p-2">Utilization</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleUserAI(user.id, !user.aiEnabled)}
                      className={`px-2 py-1 rounded text-xs ${
                        user.aiEnabled
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {user.aiEnabled ? "Enabled" : "Disabled"}
                    </button>
                  </td>
                  <td className="p-2">${user.aiMonthlyLimit}</td>
                  <td className="p-2">${user.monthlySpent.toFixed(2)}</td>
                  <td className="p-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          user.utilizationPercent > 80
                            ? "bg-red-500"
                            : user.utilizationPercent > 60
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(user.utilizationPercent, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {user.utilizationPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Edit User AI Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">User</label>
                <div>
                  <div className="font-medium">{selectedUser.username}</div>
                  <div className="text-gray-500">{selectedUser.email}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  AI Status
                </label>
                <button
                  onClick={() =>
                    toggleUserAI(selectedUser.id, !selectedUser.aiEnabled)
                  }
                  className={`px-3 py-2 rounded text-sm ${
                    selectedUser.aiEnabled
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {selectedUser.aiEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Monthly Limit ($)
                </label>
                <input
                  type="number"
                  value={selectedUser.aiMonthlyLimit}
                  onChange={(e) => {
                    const newLimit = parseFloat(e.target.value);
                    setSelectedUser({
                      ...selectedUser,
                      aiMonthlyLimit: newLimit,
                    });
                  }}
                  className="w-full border rounded px-3 py-2"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Usage
                </label>
                <div className="text-gray-600">
                  ${selectedUser.monthlySpent.toFixed(2)} of $
                  {selectedUser.aiMonthlyLimit}(
                  {selectedUser.utilizationPercent.toFixed(1)}%)
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  updateUserLimit(selectedUser.id, selectedUser.aiMonthlyLimit);
                  setShowUserModal(false);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
