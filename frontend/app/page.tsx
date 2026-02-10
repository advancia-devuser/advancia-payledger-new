"use client";

import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Advancia Pay Ledger
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome to Your Financial Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            Your comprehensive cryptocurrency payment platform with built-in
            healthcare management.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                💰 Payments
              </h3>
              <p className="text-blue-600">Process crypto payments securely</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                🏥 Healthcare
              </h3>
              <p className="text-green-600">Manage healthcare subscriptions</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                📊 Analytics
              </h3>
              <p className="text-purple-600">View financial insights</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                🔒 Security
              </h3>
              <p className="text-orange-600">Enterprise-grade security</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
