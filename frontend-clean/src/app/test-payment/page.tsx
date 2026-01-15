"use client";

import { useState, useEffect } from "react";
import NOWPaymentsEmbed from "@/components/payment/NOWPaymentsEmbed";
import NOWPaymentsButton from "@/components/payment/NOWPaymentsButton";
import NOWPaymentsWidget from "@/components/payment/NOWPaymentsWidget";

export default function TestPaymentPage() {
  const [showEmbed, setShowEmbed] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [amount, setAmount] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState<
    "embed" | "button" | "widget"
  >("embed");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@advanciapayledger.com",
          password: "SuperAdmin123!",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        alert("Logged in successfully!");
      } else {
        alert("Login failed. Check backend logs.");
      }
    } catch (error) {
      alert("Login error: " + error.message);
    }
  };

  const quickAmounts = [1, 10, 50, 100, 200];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🧪 NOWPayments Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test crypto payment integration without sending real payments
          </p>
        </div>

        {/* Login Section */}
        {!isLoggedIn && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-4">
              🔐 Authentication Required
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">
              You need to log in to test payments. Use the admin account for
              testing.
            </p>
            <button
              onClick={handleLogin}
              className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
            >
              🔑 Login as Admin (admin@advanciapayledger.com)
            </button>
          </div>
        )}

        {/* Logged In Status */}
        {isLoggedIn && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">
              ✅ Logged In
            </h3>
            <p className="text-green-700 dark:text-green-300">
              You can now test all payment components!
            </p>
          </div>
        )}

        {/* Component Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Select Component to Test
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedComponent("embed")}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedComponent === "embed"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div className="text-3xl mb-2">🖼️</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                iFrame Embed
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended
              </div>
            </button>

            <button
              onClick={() => setSelectedComponent("button")}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedComponent === "button"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div className="text-3xl mb-2">🔘</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                Button
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                New Window
              </div>
            </button>

            <button
              onClick={() => setSelectedComponent("widget")}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedComponent === "widget"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div className="text-3xl mb-2">📱</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                Widget
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Custom UI
              </div>
            </button>
          </div>
        </div>

        {/* Amount Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Select Amount
          </h2>
          <div className="grid grid-cols-5 gap-4 mb-4">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  amount === amt
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <div className="text-2xl font-bold text-blue-600">${amt}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Custom amount"
              min="1"
            />
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Test Payment Flow
          </h2>

          {selectedComponent === "embed" && (
            <button
              onClick={() => isLoggedIn && setShowEmbed(true)}
              disabled={!isLoggedIn}
              className={`w-full px-6 py-4 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl ${
                isLoggedIn
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              🖼️ Test iFrame Embed - ${amount}
              {!isLoggedIn && " (Login Required)"}
            </button>
          )}

          {selectedComponent === "button" && (
            <NOWPaymentsButton
              amount={amount}
              currency="USD"
              payCurrency="USDT"
              orderId={`test_${Date.now()}`}
              description={`Test payment $${amount}`}
              onSuccess={(paymentId) => {
                console.log("✅ Payment successful:", paymentId);
                alert(`Payment successful! ID: ${paymentId}`);
              }}
              onError={(error) => {
                console.error("❌ Payment error:", error);
                alert(`Payment error: ${error}`);
              }}
              className="w-full"
            >
              🔘 Test Button Payment - ${amount}
            </NOWPaymentsButton>
          )}

          {selectedComponent === "widget" && (
            <button
              onClick={() => isLoggedIn && setShowWidget(true)}
              disabled={!isLoggedIn}
              className={`w-full px-6 py-4 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl ${
                isLoggedIn
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              📱 Test Widget - ${amount}
              {!isLoggedIn && " (Login Required)"}
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">
            ℹ️ Testing Information
          </h3>
          <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
            <li>
              ✅ <strong>No real payment required</strong> - Test the UI flow
            </li>
            <li>
              ✅ <strong>Invoice page will load</strong> - See payment details
            </li>
            <li>
              ✅ <strong>QR codes will display</strong> - Verify UI components
            </li>
            <li>
              ⚠️ <strong>Webhook won't fire</strong> - No real crypto sent
            </li>
            <li>
              ⚠️ <strong>Balance won't update</strong> - No funds received
            </li>
            <li>
              💡 <strong>Complete with $1-2</strong> - To test webhook later
            </li>
          </ul>
        </div>

        {/* Console Output */}
        <div className="bg-gray-900 rounded-2xl p-6 mt-6">
          <h3 className="text-lg font-bold text-white mb-2">
            📊 Console Output
          </h3>
          <p className="text-gray-400 text-sm">
            Open browser console (F12) to see payment events
          </p>
        </div>
      </div>

      {/* iFrame Embed Modal */}
      <NOWPaymentsEmbed
        isOpen={showEmbed}
        amount={amount}
        currency="USD"
        payCurrency="USDT"
        orderId={`test_embed_${Date.now()}`}
        description={`Test payment $${amount}`}
        onSuccess={(paymentId) => {
          console.log("✅ Embed payment successful:", paymentId);
          alert(
            `Payment successful! ID: ${paymentId}\n\nCheck console for details.`
          );
          setShowEmbed(false);
        }}
        onError={(error) => {
          console.error("❌ Embed payment error:", error);
          alert(`Payment error: ${error}`);
        }}
        onClose={() => {
          console.log("🔒 Embed closed");
          setShowEmbed(false);
        }}
      />

      {/* Widget Modal */}
      <NOWPaymentsWidget
        isOpen={showWidget}
        amount={amount}
        currency="USD"
        payCurrency="USDT"
        orderId={`test_widget_${Date.now()}`}
        description={`Test payment $${amount}`}
        onSuccess={(paymentId) => {
          console.log("✅ Widget payment successful:", paymentId);
          alert(
            `Payment successful! ID: ${paymentId}\n\nCheck console for details.`
          );
          setShowWidget(false);
        }}
        onError={(error) => {
          console.error("❌ Widget payment error:", error);
          alert(`Payment error: ${error}`);
        }}
        onClose={() => {
          console.log("🔒 Widget closed");
          setShowWidget(false);
        }}
      />
    </div>
  );
}
