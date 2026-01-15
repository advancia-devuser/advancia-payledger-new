"use client";

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;

    fetchAnalytics();
    fetchRealTimeMetrics();

    // Set up real-time updates
    const interval = setInterval(fetchRealTimeMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [dateRange, user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/analytics?dateRange=${dateRange}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeMetrics = async () => {
    try {
      const response = await fetch("/api/admin/analytics/realtime", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRealTimeMetrics(data.data);
      }
    } catch (error) {
      console.error("Error fetching real-time metrics:", error);
    }
  };

  const exportData = async (format) => {
    try {
      const response = await fetch(
        `/api/admin/analytics/export?dateRange=${dateRange}&format=${format}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-${dateRange}-${
          new Date().toISOString().split("T")[0]
        }.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const formatPercentage = (num) => {
    return `${num.toFixed(2)}%`;
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportData("json")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => exportData("csv")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Bar */}
      {realTimeMetrics && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600">Recent Transactions</div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatNumber(realTimeMetrics.recentTransactions)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600">Active Users</div>
                <div className="text-2xl font-bold text-green-900">
                  {formatNumber(realTimeMetrics.activeUsers)}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-yellow-600">Recent Alerts</div>
                <div className="text-2xl font-bold text-yellow-900">
                  {formatNumber(realTimeMetrics.recentAlerts)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600">System Load</div>
                <div className="text-2xl font-bold text-purple-900">
                  {formatPercentage(realTimeMetrics.systemLoad.cpu)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              "overview",
              "transactions",
              "users",
              "fraud",
              "financial",
              "performance",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {analytics && (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Users
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {formatNumber(analytics.overview.totalUsers)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatNumber(analytics.overview.activeUsers)} active
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Transactions
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {formatNumber(analytics.overview.totalTransactions)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatNumber(analytics.overview.todayTransactions)} today
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Volume
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {formatCurrency(analytics.overview.totalVolume)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(analytics.overview.todayVolume)} today
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                      Success Rate
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {formatPercentage(analytics.overview.successRate)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatPercentage(analytics.overview.monthlyGrowth)}{" "}
                      growth
                    </p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Transaction Volume
                    </h3>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      {/* Chart would go here */}
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p>Transaction volume chart</p>
                        <p className="text-sm mt-2">
                          Daily: {analytics.transactions.dailyData.length} days
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Payment Methods
                    </h3>
                    <div className="space-y-2">
                      {analytics.transactions.paymentMethods.map((method) => (
                        <div
                          key={method.method}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {method.method}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${method.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {formatPercentage(method.percentage)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === "transactions" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Daily Transactions
                    </h3>
                    <div className="h-80 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📈</div>
                        <p>Daily transaction chart</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Status Breakdown
                    </h3>
                    <div className="space-y-3">
                      {analytics.transactions.statusBreakdown.map((status) => (
                        <div
                          key={status.status}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {status.status}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${status.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {formatNumber(status.count)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Risk Distribution
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    {analytics.transactions.riskDistribution.map((risk) => (
                      <div key={risk.level} className="text-center">
                        <div
                          className={`text-2xl font-bold ${
                            risk.level === "CRITICAL"
                              ? "text-red-600"
                              : risk.level === "HIGH"
                              ? "text-orange-600"
                              : risk.level === "MEDIUM"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        >
                          {risk.count}
                        </div>
                        <div className="text-sm text-gray-600">
                          {risk.level}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatPercentage(risk.percentage)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      New Users
                    </h3>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">👥</div>
                        <p>New users chart</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      User Retention
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Day 1</span>
                        <span className="text-sm font-medium">
                          {formatPercentage(analytics.users.userRetention.day1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Day 7</span>
                        <span className="text-sm font-medium">
                          {formatPercentage(analytics.users.userRetention.day7)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Day 30</span>
                        <span className="text-sm font-medium">
                          {formatPercentage(
                            analytics.users.userRetention.day30
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Top Users
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Transactions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Volume
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.users.topUsers.map((user, index) => (
                          <tr key={user.userId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatNumber(user.transactionCount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(user.totalVolume)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Fraud Tab */}
            {activeTab === "fraud" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Fraud Trends
                    </h3>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🚨</div>
                        <p>Fraud trends chart</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Top Risk Factors
                    </h3>
                    <div className="space-y-2">
                      {analytics.fraud.topRiskFactors.map((factor) => (
                        <div
                          key={factor.factor}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {factor.factor}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-red-600 h-2 rounded-full"
                                style={{ width: `${factor.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {factor.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Geographic Risks
                    </h3>
                    <div className="space-y-2">
                      {analytics.fraud.geographicRisks.map((geo) => (
                        <div
                          key={geo.country}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {geo.country}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-red-600">
                              {geo.riskCount}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({geo.riskScore})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Device Analysis
                    </h3>
                    <div className="space-y-2">
                      {analytics.fraud.deviceAnalysis.map((device) => (
                        <div
                          key={device.deviceType}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {device.deviceType}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-red-600">
                              {device.riskCount}
                            </span>
                            <span className="text-xs text-gray-500">
                              / {device.totalCount}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Tab */}
            {activeTab === "financial" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Revenue
                    </h3>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">💰</div>
                        <p>Revenue chart</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Currency Breakdown
                    </h3>
                    <div className="space-y-2">
                      {analytics.financial.currencyBreakdown.map((currency) => (
                        <div
                          key={currency.currency}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {currency.currency}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${currency.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {formatCurrency(currency.volume)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Profit Margins
                  </h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p>Profit margin chart</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === "performance" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      System Health
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Uptime</span>
                        <span className="text-sm font-medium text-green-600">
                          {formatPercentage(
                            analytics.performance.systemHealth.uptime
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Error Rate
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          {formatPercentage(
                            analytics.performance.systemHealth.errorRate
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Avg Response Time
                        </span>
                        <span className="text-sm font-medium">
                          {analytics.performance.systemHealth.avgResponseTime}ms
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Active Connections
                        </span>
                        <span className="text-sm font-medium">
                          {formatNumber(
                            analytics.performance.systemHealth.activeConnections
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Database Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Queries
                        </span>
                        <span className="text-sm font-medium">
                          {formatNumber(
                            analytics.performance.databaseStats.totalQueries
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Avg Query Time
                        </span>
                        <span className="text-sm font-medium">
                          {analytics.performance.databaseStats.avgQueryTime}ms
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Slow Queries
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          {analytics.performance.databaseStats.slowQueries}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      API Response Times
                    </h3>
                    <div className="h-48 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-3xl mb-2">⚡</div>
                        <p>Response time chart</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
