"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Clock,
  User,
  Globe,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ActivityLogViewer({ userId, isAdmin = false }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchAction, setSearchAction] = useState("");
  const [summary, setSummary] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin
        ? `/api/admin/activity/${userId}?page=${page}&limit=50${
            searchAction ? `&action=${searchAction}` : ""
          }`
        : `/api/admin/my-activity?page=${page}&limit=50${
            searchAction ? `&action=${searchAction}` : ""
          }`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch activity logs");

      const data = await response.json();
      setLogs(data.logs);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!isAdmin) return;

    try {
      const response = await fetch("/api/admin/activity-summary?days=7");
      if (!response.ok) throw new Error("Failed to fetch summary");

      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, searchAction, userId, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchSummary();
    }
  }, [isAdmin]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionIcon = (action) => {
    if (action.includes("GET")) return <Search className="w-4 h-4" />;
    if (action.includes("POST")) return <User className="w-4 h-4" />;
    if (action.includes("PUT")) return <Activity className="w-4 h-4" />;
    if (action.includes("DELETE")) return <XCircle className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getSuccessColor = (success) => {
    return success ? "text-green-600" : "text-red-600";
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading activity logs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Activity className="mr-2" />
          Activity Logs
        </h2>
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Filter by action..."
            value={searchAction}
            onChange={(e) => setSearchAction(e.target.value)}
            className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Summary for Admin */}
      {isAdmin && summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">
              Total Activities
            </h3>
            <p className="text-2xl font-bold">
              {summary.summary.totalActivities}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <p className="text-2xl font-bold text-green-600">
              {summary.summary.successRate}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">
              Failed Activities
            </h3>
            <p className="text-2xl font-bold text-red-600">
              {summary.summary.failedActivities}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-500">
              Avg Response Time
            </h3>
            <p className="text-2xl font-bold">
              {summary.summary.avgResponseTime}ms
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endpoint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getActionIcon(log.action)}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.endpoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {log.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`ml-1 text-sm ${getSuccessColor(
                          log.success
                        )}`}
                      >
                        {log.success ? "Success" : "Failed"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.responseTime ? `${log.responseTime}ms` : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {log.ipAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(log.timestamp)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!loading && logs.length === 0 && !error && (
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No activity logs
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No activity recorded yet.
          </p>
        </div>
      )}
    </div>
  );
}
