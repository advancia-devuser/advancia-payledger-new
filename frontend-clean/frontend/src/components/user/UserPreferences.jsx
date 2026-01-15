"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  CreditCard,
  Bell,
  Shield,
  Smartphone,
  Monitor,
  Globe,
  Moon,
  Sun,
  Check,
  X,
  Save,
  RefreshCw,
} from "lucide-react";

export default function UserPreferences() {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPreferences();
    fetchPaymentMethods();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/preferences", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch preferences");

      const data = await response.json();
      setPreferences(data.preferences);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/preferences/payment-methods", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch payment methods");

      const data = await response.json();
      setPaymentMethods(data.paymentMethods);
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    }
  };

  const updatePreferences = async (updates) => {
    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update preferences");

      const data = await response.json();
      setPreferences(data.preferences);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSinglePreference = async (field, value) => {
    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/preferences/${field}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) throw new Error("Failed to update preference");

      const data = await response.json();
      setPreferences(data.preferences);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading preferences...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <Settings className="mr-3" />
          User Preferences
        </h1>

        {success && (
          <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <Check className="w-4 h-4 mr-2" />
            Preferences saved successfully!
          </div>
        )}

        {error && (
          <div className="flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-lg">
            <X className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
      </div>

      {/* Payment Preferences */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <CreditCard className="mr-2" />
          Payment Preferences
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Payment Method
            </label>
            <select
              value={preferences?.preferredPaymentMethod || ""}
              onChange={(e) =>
                updateSinglePreference("preferredPaymentMethod", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            >
              <option value="">Select payment method</option>
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.icon} {method.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={preferences?.currency || "USD"}
              onChange={(e) =>
                updateSinglePreference("currency", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Bell className="mr-2" />
          Notification Preferences
        </h2>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-sm">📧</span>
              </div>
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-500">
                  Receive updates via email
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.emailNotifications || false}
              onChange={(e) =>
                updateSinglePreference("emailNotifications", e.target.checked)
              }
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              disabled={saving}
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-sm">💬</span>
              </div>
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-gray-500">
                  Receive updates via SMS
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.smsNotifications || false}
              onChange={(e) =>
                updateSinglePreference("smsNotifications", e.target.checked)
              }
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              disabled={saving}
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-sm">🔔</span>
              </div>
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-500">
                  Receive push notifications
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.pushNotifications || false}
              onChange={(e) =>
                updateSinglePreference("pushNotifications", e.target.checked)
              }
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              disabled={saving}
            />
          </label>
        </div>
      </div>

      {/* Security Preferences */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Shield className="mr-2" />
          Security Preferences
        </h2>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-sm">🔐</span>
              </div>
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-gray-500">
                  Add an extra layer of security
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.twoFactorEnabled || false}
              onChange={(e) =>
                updateSinglePreference("twoFactorEnabled", e.target.checked)
              }
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              disabled={saving}
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-sm">👆</span>
              </div>
              <div>
                <div className="font-medium">Biometric Authentication</div>
                <div className="text-sm text-gray-500">
                  Use fingerprint or face ID
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.biometricEnabled || false}
              onChange={(e) =>
                updateSinglePreference("biometricEnabled", e.target.checked)
              }
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              disabled={saving}
            />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-sm">💾</span>
              </div>
              <div>
                <div className="font-medium">Auto Backup</div>
                <div className="text-sm text-gray-500">
                  Automatically backup your data
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.autoBackup || false}
              onChange={(e) =>
                updateSinglePreference("autoBackup", e.target.checked)
              }
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              disabled={saving}
            />
          </label>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Monitor className="mr-2" />
          Display Preferences
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={preferences?.language || "en"}
              onChange={(e) =>
                updateSinglePreference("language", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={preferences?.timezone || "UTC"}
              onChange={(e) =>
                updateSinglePreference("timezone", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>

          <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                {preferences?.darkMode ? (
                  <Moon className="w-4 h-4 text-white" />
                ) : (
                  <Sun className="w-4 h-4 text-yellow-400" />
                )}
              </div>
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-gray-500">Use dark theme</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.darkMode || false}
              onChange={(e) =>
                updateSinglePreference("darkMode", e.target.checked)
              }
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              disabled={saving}
            />
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={fetchPreferences}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          disabled={saving}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </button>

        <button
          onClick={() => updatePreferences(preferences)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
