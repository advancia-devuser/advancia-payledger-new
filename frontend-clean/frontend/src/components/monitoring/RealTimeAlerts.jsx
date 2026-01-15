"use client";

import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../contexts/AuthContext";

const RealTimeAlerts = () => {
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const newSocket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
      {
        transports: ["websocket"],
        upgrade: false,
      }
    );

    setSocket(newSocket);

    // Connect and authenticate
    newSocket.emit("authenticate", {
      userId: user.id,
      token: localStorage.getItem("token"),
    });

    newSocket.on("authenticated", (data) => {
      if (data.success) {
        setIsConnected(true);
        console.log("Connected to real-time monitoring");
      }
    });

    newSocket.on("authentication_error", (error) => {
      console.error("Authentication failed:", error);
      setIsConnected(false);
    });

    // Handle initial alerts
    newSocket.on("initial_alerts", (initialAlerts) => {
      setAlerts(initialAlerts);
      setUnreadCount(initialAlerts.filter((alert) => !alert.isRead).length);
    });

    // Handle new alerts
    newSocket.on("transaction_alert", (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show browser notification
      if (Notification.permission === "granted") {
        new Notification(alert.title, {
          body: alert.message,
          icon: "/favicon.ico",
          tag: alert.id,
        });
      }
    });

    // Handle admin alerts
    newSocket.on("admin_alert", (alert) => {
      if (user.role === "ADMIN") {
        setAlerts((prev) => [alert, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      newSocket.close();
    };
  }, [user]);

  const acknowledgeAlert = async (alertId) => {
    try {
      const response = await fetch(
        `/api/monitoring/alerts/${alertId}/acknowledge`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === alertId ? { ...alert, isRead: true } : alert
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Emit to socket
        socket?.emit("acknowledge_alert", { alertId });
      }
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500 text-white";
      case "HIGH":
        return "bg-orange-500 text-white";
      case "MEDIUM":
        return "bg-yellow-500 text-black";
      case "LOW":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "🚨";
      case "HIGH":
        return "⚠️";
      case "MEDIUM":
        return "⚡";
      case "LOW":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="relative">
      {/* Alert Bell Button */}
      <button
        onClick={() => setShowAlerts(!showAlerts)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Connection Status */}
        <div
          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </button>

      {/* Alerts Dropdown */}
      {showAlerts && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Transaction Alerts</h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-gray-500">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} unread alert{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Alerts List */}
          <div className="overflow-y-auto max-h-80">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="mb-2">🔔</div>
                <p>No alerts at this time</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !alert.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Severity Icon */}
                    <div
                      className={`p-2 rounded-full ${getSeverityColor(
                        alert.severity
                      )}`}
                    >
                      <span className="text-lg">
                        {getSeverityIcon(alert.severity)}
                      </span>
                    </div>

                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {alert.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(alert.timestamp)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        {alert.message}
                      </p>

                      {alert.amount && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Amount:</span> $
                          {alert.amount} {alert.currency}
                        </div>
                      )}

                      {alert.riskScore && (
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Risk Score:</span>{" "}
                          {alert.riskScore}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-3 flex items-center space-x-2">
                        {!alert.isRead && (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                          >
                            Mark as Read
                          </button>
                        )}

                        {alert.transactionId && (
                          <button
                            onClick={() =>
                              window.open(
                                `/transactions/${alert.transactionId}`,
                                "_blank"
                              )
                            }
                            className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                          >
                            View Transaction
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => window.open("/monitoring/alerts", "_blank")}
              className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Alerts →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeAlerts;
