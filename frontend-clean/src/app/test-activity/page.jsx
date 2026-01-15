"use client";

import React, { useState, useEffect } from "react";
import { Activity, CheckCircle, XCircle } from "lucide-react";

export default function TestActivityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const fetchMyActivity = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/my-activity");
      if (!response.ok) throw new Error("Failed to fetch activity");

      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      console.error("Error:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const testActivity = async () => {
    try {
      setTestResult(null);

      // Test different API calls to generate activity
      const tests = [
        { name: "Wallet Check", url: "/api/wallet" },
        { name: "Health Check", url: "/api/health" },
        { name: "Dashboard Data", url: "/api/dashboard" },
      ];

      for (const test of tests) {
        try {
          const response = await fetch(test.url);
          const success = response.ok;

          setTestResult((prev) => ({
            ...prev,
            [test.name]: success ? "success" : "failed",
          }));
        } catch (error) {
          setTestResult((prev) => ({
            ...prev,
            [test.name]: "error",
          }));
        }

        // Small delay between calls
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Refresh logs after testing
      setTimeout(fetchMyActivity, 1000);
    } catch (error) {
      console.error("Test failed:", error);
    }
  };

  useEffect(() => {
    fetchMyActivity();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Activity className="mr-3" />
          Activity Logging Test
        </h1>

        {/* Test Controls */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Activity Logging</h2>
          <button
            onClick={testActivity}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Test Activity
          </button>

          {testResult && (
            <div className="mt-4 space-y-2">
              {Object.entries(testResult).map(([test, result]) => (
                <div key={test} className="flex items-center space-x-2">
                  <span className="font-medium">{test}:</span>
                  {result === "success" && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {result === "failed" && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  {result === "error" && (
                    <XCircle className="w-5 h-5 text-orange-600" />
                  )}
                  <span className="text-sm text-gray-600 capitalize">
                    {result}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Logs */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Recent Activity</h2>
            <button
              onClick={fetchMyActivity}
              disabled={loading}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading && logs.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Loading activity logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p>No activity logs found. Try generating some test activity!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {log.action}
                      </div>
                      <div className="text-sm text-gray-600">
                        {log.endpoint}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {log.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm text-gray-600">
                          {log.responseTime ? `${log.responseTime}ms` : "N/A"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {log.ipAddress && (
                    <div className="text-xs text-gray-500 mt-2">
                      IP: {log.ipAddress} |{" "}
                      {log.userAgent?.split(" ")[0] || "Unknown"}
                    </div>
                  )}
                </div>
              ))}

              {logs.length > 10 && (
                <div className="text-center text-sm text-gray-500 pt-2">
                  Showing 10 of {logs.length} logs
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            How Activity Logging Works:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Every API call you make is automatically logged</li>
            <li>• Response times are tracked for performance monitoring</li>
            <li>• Success/failure status helps identify issues</li>
            <li>• IP addresses and user agents are recorded for security</li>
            <li>• This provides HIPAA-compliant audit trails</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
