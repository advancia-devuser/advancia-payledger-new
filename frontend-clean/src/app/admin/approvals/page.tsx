"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react";

interface PendingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  trustScore: number;
  requestedAmount: number;
  status: string;
  createdAt: string;
}

interface Stats {
  totalPending: number;
  highTrust: number;
  mediumTrust: number;
  lowTrust: number;
  totalAmount: number;
}

export default function AdminApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPending: 0,
    highTrust: 0,
    mediumTrust: 0,
    lowTrust: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [modalType, setModalType] = useState<"approve" | "reject">("approve");

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      const response = await fetch("/api/admin/pending-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data.users);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (userId: string) => {
    const user = pendingUsers.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setModalType("approve");
      setShowModal(true);
    }
  };

  const handleReject = (userId: string) => {
    const user = pendingUsers.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setModalType("reject");
      setShowModal(true);
    }
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;

    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      const endpoint = modalType === "approve" ? "approve" : "reject";
      const response = await fetch(
        `/api/admin/users/${selectedUser.id}/${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setPendingUsers(
          pendingUsers.filter((user) => user.id !== selectedUser.id)
        );
        setShowModal(false);
        setSelectedUser(null);

        // Update stats
        const newStats = { ...stats };
        newStats.totalPending = newStats.totalPending - 1;
        newStats.totalAmount =
          newStats.totalAmount - selectedUser.requestedAmount;

        if (selectedUser.trustScore >= 80) {
          newStats.highTrust = newStats.highTrust - 1;
        } else if (selectedUser.trustScore >= 50) {
          newStats.mediumTrust = newStats.mediumTrust - 1;
        } else {
          newStats.lowTrust = newStats.lowTrust - 1;
        }

        setStats(newStats);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Approvals</h1>
        <div className="flex items-center text-sm text-gray-500">
          <AlertCircle className="w-4 h-4 mr-1" />
          {stats.totalPending} pending approvals
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8" />
            <span className="text-2xl font-bold">{stats.totalPending}</span>
          </div>
          <div className="text-blue-200">Total Pending</div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8" />
            <span className="text-2xl font-bold">{stats.highTrust}</span>
          </div>
          <div className="text-green-200">High Trust (80+)</div>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8" />
            <span className="text-2xl font-bold">{stats.lowTrust}</span>
          </div>
          <div className="text-red-200">Low Trust (&lt;50)</div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
            <span className="text-2xl font-bold">
              ${stats.totalAmount.toFixed(0)}
            </span>
          </div>
          <div className="text-purple-200">Total Amount</div>
        </div>
      </div>

      {/* Pending Users Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Pending Approvals
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trust Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 mr-2">
                        {user.trustScore}
                      </div>
                      <div
                        className={`w-16 h-2 rounded-full ${
                          user.trustScore >= 80
                            ? "bg-green-500"
                            : user.trustScore >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        <div
                          className="h-2 rounded-full bg-gray-300"
                          style={{ width: `${user.trustScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${user.requestedAmount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {modalType === "approve" ? "Approve User" : "Reject User"}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {modalType === "approve"
                    ? `Are you sure you want to approve ${selectedUser.firstName} ${selectedUser.lastName}?`
                    : `Are you sure you want to reject ${selectedUser.firstName} ${selectedUser.lastName}?`}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleConfirm()}
                  className={`px-4 py-2 text-white text-base font-medium rounded-md w-full ${
                    modalType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {modalType === "approve" ? "Approve" : "Reject"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
