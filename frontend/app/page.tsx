"use client";

import React, { useState } from "react";

// Landing page data
const features = [
  {
    icon: "💳",
    title: "Crypto Payments",
    description: "Send and receive payments in Bitcoin, Ethereum, and stablecoins instantly."
  },
  {
    icon: "🏥",
    title: "Healthcare Integration",
    description: "Manage healthcare subscriptions and claims with built-in insurance support."
  },
  {
    icon: "🔒",
    title: "Enterprise Security",
    description: "Bank-grade encryption and multi-factor authentication for your assets."
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Process transactions in milliseconds with global liquidity."
  },
  {
    icon: "📊",
    title: "Advanced Analytics",
    description: "Real-time insights into your finances and healthcare spending."
  },
  {
    icon: "🌍",
    title: "Global Access",
    description: "Available in 150+ countries with 24/7 customer support."
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Entrepreneur",
    message: "Advancia revolutionized how I manage my international payments and healthcare.",
    avatar: "SC"
  },
  {
    name: "Marcus Johnson",
    role: "Freelancer",
    message: "Finally, a platform that understands both crypto and healthcare needs.",
    avatar: "MJ"
  },
  {
    name: "Elena Rodriguez",
    role: "Business Owner",
    message: "The best solution for managing healthcare and payments in one place.",
    avatar: "ER"
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    features: ["5 transactions/month", "Basic healthcare support", "Email support"]
  },
  {
    name: "Professional",
    price: "$9.99",
    period: "/month",
    features: ["Unlimited transactions", "Advanced healthcare", "Priority support", "Analytics dashboard"],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Custom integrations", "Dedicated account manager", "API access", "White-label options"]
  }
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthed, setIsAuthed] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [lastLoginUser, setLastLoginUser] = useState<{ name: string; email: string } | null>(null);

  // Dashboard data
  const mockTransactions: Array<{
    id: number;
    type: string;
    amount: number;
    status: string;
    date: string;
    recipient?: string;
    description?: string;
  }> = [];

  const mockBalance = [
    { name: "USD Balance", value: 0, usd: 0 }
  ];

  const totalBalance = mockBalance.reduce((sum, asset) => sum + asset.usd, 0);

  if (currentPage === "dashboard" && !isAuthed) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
        <header className="bg-gray-900/80 border-b border-indigo-500/40 backdrop-blur sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80" onClick={() => setCurrentPage("landing")}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AP</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Advancia</h1>
            </div>
            <button
              onClick={() => setCurrentPage("landing")}
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Back to Home
            </button>
          </div>
        </header>

        <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Welcome to your PayLedger</h2>
            <p className="text-gray-300 text-lg">
              Log in or create your account to unlock the dashboard, view balances, and book chambers.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setAuthMode("login")}
                className={`px-6 py-2 rounded-lg font-semibold transition ${authMode === "login" ? "bg-indigo-600" : "bg-white/10 hover:bg-white/20"}`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("create")}
                className={`px-6 py-2 rounded-lg font-semibold transition ${authMode === "create" ? "bg-indigo-600" : "bg-white/10 hover:bg-white/20"}`}
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="bg-gray-900/70 border border-indigo-500/40 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-2">
              {authMode === "login" ? "Sign in" : "Create your account"}
            </h3>
            <p className="text-gray-400 mb-6">
              {authMode === "login" ? "Access your dashboard instantly." : "It only takes a minute."}
            </p>
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setLastLoginUser({
                  name: authName || "New User",
                  email: authEmail || "newuser@example.com"
                });
                setIsAuthed(true);
                setActiveTab("dashboard");
              }}
            >
              {authMode === "create" && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(event) => setAuthName(event.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-gray-800 border border-indigo-500/60 rounded px-4 py-2 text-white placeholder-gray-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-gray-800 border border-indigo-500/60 rounded px-4 py-2 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-indigo-500/60 rounded px-4 py-2 text-white placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded transition"
              >
                {authMode === "login" ? "Login" : "Create Account"}
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  if (currentPage === "dashboard") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-purple-500 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80" onClick={() => setCurrentPage("landing")}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AP</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Advancia</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-300 text-sm">Welcome back</p>
                <p className="text-white font-semibold">{authName || "User"}</p>
              </div>
              <button
                onClick={() => {
                  setIsAuthed(false);
                  setCurrentPage("landing");
                }}
                className="text-sm text-gray-300 hover:text-white transition"
              >
                Log out
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full cursor-pointer hover:opacity-80"></div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-gray-800 border-b border-purple-500">
          <div className="max-w-7xl mx-auto px-6 flex gap-8">
            {["dashboard", "wallet", "payments", "booking", "healthcare", "analytics", "admin"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-lg cursor-pointer hover:scale-105 transition">
                  <p className="text-blue-100 text-sm mb-2">Total Balance</p>
                  <p className="text-3xl font-bold mb-2">${totalBalance.toFixed(2)}</p>
                  <p className="text-blue-200 text-xs">No activity yet</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 text-white shadow-lg cursor-pointer hover:scale-105 transition">
                  <p className="text-green-100 text-sm mb-2">Healthcare Coverage</p>
                  <p className="text-3xl font-bold mb-2">$8,450</p>
                  <p className="text-green-200 text-xs">Annual limit remaining</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white shadow-lg cursor-pointer hover:scale-105 transition">
                  <p className="text-purple-100 text-sm mb-2">Monthly Transactions</p>
                  <p className="text-3xl font-bold mb-2">142</p>
                  <p className="text-purple-200 text-xs">+12% from last month</p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-purple-500">
                        <th className="text-left text-purple-300 py-2 px-4">Type</th>
                        <th className="text-left text-purple-300 py-2 px-4">Details</th>
                        <th className="text-left text-purple-300 py-2 px-4">Amount</th>
                        <th className="text-left text-purple-300 py-2 px-4">Status</th>
                        <th className="text-left text-purple-300 py-2 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTransactions.length === 0 ? (
                        <tr className="border-b border-gray-700">
                          <td colSpan={5} className="py-6 px-4 text-gray-400 text-center">
                            No transactions yet.
                          </td>
                        </tr>
                      ) : (
                        mockTransactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-700 transition cursor-pointer">
                            <td className="py-3 px-4">
                              <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-900 text-blue-200">
                                {tx.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-300">{tx.recipient || tx.description}</td>
                            <td className="py-3 px-4 text-green-400 font-semibold">${tx.amount}</td>
                            <td className="py-3 px-4">
                              <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-900 text-green-200">
                                {tx.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400">{tx.date}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-white font-bold text-xl">Wallet</h3>
                    <p className="text-gray-400 text-sm">New accounts start with empty wallets.</p>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-6 py-2 rounded transition">
                    Add Wallet
                  </button>
                </div>
                <div className="border border-purple-500/30 rounded-lg p-6 text-center text-gray-400">
                  No wallets connected yet.
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold mb-4">Send Payment</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Recipient Address</label>
                    <input type="text" placeholder="0x742d35Cc6634C0532925a3b844Bc..." className="w-full bg-gray-700 border border-purple-500 rounded px-4 py-2 text-white placeholder-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Amount</label>
                      <input type="number" placeholder="0.00" className="w-full bg-gray-700 border border-purple-500 rounded px-4 py-2 text-white placeholder-gray-400" />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Currency</label>
                      <select className="w-full bg-gray-700 border border-purple-500 rounded px-4 py-2 text-white">
                        <option>BTC</option>
                        <option>ETH</option>
                        <option>USDC</option>
                      </select>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded transition cursor-pointer">
                    Send Payment (MOCK)
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Booking Tab */}
          {activeTab === "booking" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-white font-bold text-xl">Chamber Booking</h3>
                    <p className="text-gray-400 text-sm">Reserve a private chamber for your next session.</p>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-6 py-2 rounded transition">
                    New Booking
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Chamber A", type: "Executive Suite", availability: "Available Now", price: "$120 / hr" },
                    { name: "Chamber B", type: "Wellness Pod", availability: "Next: 3:30 PM", price: "$90 / hr" },
                    { name: "Chamber C", type: "Clinical Room", availability: "Available Tomorrow", price: "$75 / hr" }
                  ].map((chamber) => (
                    <div key={chamber.name} className="bg-gray-700/60 border border-purple-500/40 rounded-xl p-5 hover:border-purple-400 transition">
                      <p className="text-white font-semibold text-lg">{chamber.name}</p>
                      <p className="text-purple-200 text-sm">{chamber.type}</p>
                      <div className="mt-4 space-y-2 text-sm">
                        <p className="text-gray-300">{chamber.availability}</p>
                        <p className="text-green-400 font-semibold">{chamber.price}</p>
                      </div>
                      <button className="mt-5 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded transition">
                        Book Chamber
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h4 className="text-white font-bold mb-4">Upcoming Bookings</h4>
                <div className="space-y-4">
                  {[
                    { date: "Feb 16, 2026", time: "10:00 AM", chamber: "Chamber B", status: "Confirmed" },
                    { date: "Feb 20, 2026", time: "1:30 PM", chamber: "Chamber A", status: "Pending" }
                  ].map((booking, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-purple-500/30 rounded-lg p-4">
                      <div>
                        <p className="text-white font-semibold">{booking.chamber}</p>
                        <p className="text-gray-400 text-sm">{booking.date} • {booking.time}</p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${booking.status === "Confirmed" ? "bg-green-900 text-green-200" : "bg-yellow-900 text-yellow-200"}`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Healthcare Tab */}
          {activeTab === "healthcare" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-lg p-6 text-white shadow-lg cursor-pointer hover:scale-105 transition">
                  <p className="text-green-100 text-sm mb-2">Active Plans</p>
                  <p className="text-3xl font-bold mb-2">3</p>
                  <p className="text-green-200 text-xs">Premium, Standard, Basic</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-cyan-800 rounded-lg p-6 text-white shadow-lg cursor-pointer hover:scale-105 transition">
                  <p className="text-blue-100 text-sm mb-2">Coverage Amount</p>
                  <p className="text-3xl font-bold mb-2">$50,000</p>
                  <p className="text-blue-200 text-xs">Annual coverage limit</p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold mb-4">Key Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded">
                    <p className="text-gray-300 text-sm">Total Transactions</p>
                    <p className="text-white font-bold text-xl">2,847</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded">
                    <p className="text-gray-300 text-sm">Total Volume</p>
                    <p className="text-white font-bold text-xl">$487,250</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded">
                    <p className="text-gray-300 text-sm">Success Rate</p>
                    <p className="text-white font-bold text-xl">98.5%</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded">
                    <p className="text-gray-300 text-sm">Uptime</p>
                    <p className="text-white font-bold text-xl">99.98%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Tab */}
          {activeTab === "admin" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold text-xl mb-2">Admin Management</h3>
                <p className="text-gray-400 text-sm mb-6">Latest user login activity.</p>
                <div className="space-y-4">
                  {lastLoginUser ? (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-purple-500/30 rounded-lg p-4">
                      <div>
                        <p className="text-white font-semibold">{lastLoginUser.name}</p>
                        <p className="text-gray-400 text-sm">{lastLoginUser.email}</p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-900 text-green-200">
                        Logged in
                      </span>
                    </div>
                  ) : (
                    <div className="border border-purple-500/30 rounded-lg p-6 text-center text-gray-400">
                      No users have logged in yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-md border-b border-purple-500/30 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">AP</span>
            </div>
            <span className="text-xl font-bold">Advancia</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="hover:text-purple-400 transition cursor-pointer">Features</a>
            <a href="#pricing" className="hover:text-purple-400 transition cursor-pointer">Pricing</a>
            <a href="#testimonials" className="hover:text-purple-400 transition cursor-pointer">Testimonials</a>
            <a href="#contact" className="hover:text-purple-400 transition cursor-pointer">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAuthMode("login");
                setCurrentPage("dashboard");
              }}
              className="px-5 py-2 rounded-lg font-semibold transition bg-white/10 hover:bg-white/20"
            >
              Login
            </button>
            <button
              onClick={() => {
                setAuthMode("create");
                setCurrentPage("dashboard");
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-2 rounded-lg font-semibold transition cursor-pointer flex items-center gap-2"
            >
              Create Account →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Crypto Payments + Healthcare
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The world's first unified platform for cryptocurrency payments and healthcare management. Send money globally, manage health insurance, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => {
                setAuthMode("create");
                setCurrentPage("dashboard");
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 cursor-pointer"
            >
              Create Account
            </button>
            <button className="border-2 border-purple-400 hover:bg-purple-400/10 px-8 py-4 rounded-lg font-bold text-lg transition cursor-pointer">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-12 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20 cursor-pointer hover:border-purple-500/60 transition">
              <p className="text-3xl font-bold text-green-400">500K+</p>
              <p className="text-gray-400 text-sm">Active Users</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20 cursor-pointer hover:border-purple-500/60 transition">
              <p className="text-3xl font-bold text-blue-400">$2.5B+</p>
              <p className="text-gray-400 text-sm">Processed</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20 cursor-pointer hover:border-purple-500/60 transition">
              <p className="text-3xl font-bold text-purple-400">150+</p>
              <p className="text-gray-400 text-sm">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-black/20 border-y border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Powerful Features</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Everything you need to manage your finances and healthcare in one integrated platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-8 rounded-lg hover:border-purple-500/60 transition cursor-pointer hover:scale-105">
                <p className="text-4xl mb-4">{feature.icon}</p>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Sign Up", desc: "Create your account in 2 minutes" },
              { step: "2", title: "Connect Wallet", desc: "Link your crypto wallets securely" },
              { step: "3", title: "Manage Health", desc: "Add your healthcare providers" },
              { step: "4", title: "Start Trading", desc: "Send payments, manage health instantly" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4 cursor-pointer hover:scale-105 transition">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold hover:shadow-lg hover:shadow-purple-500/50">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-black/20 border-y border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Loved by Users Worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-8 rounded-lg cursor-pointer hover:border-purple-500/60 transition hover:scale-105">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center font-bold cursor-pointer">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">"{testimonial.message}"</p>
                <p className="text-yellow-400 mt-4">★★★★★</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-gray-400 text-center mb-16">Choose the plan that fits your needs</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div key={idx} className={`rounded-lg p-8 transition transform hover:scale-105 cursor-pointer ${
                plan.popular 
                  ? "bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-purple-300 shadow-lg shadow-purple-500/50" 
                  : "bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 hover:border-purple-500/60"
              }`}>
                {plan.popular && <div className="text-purple-200 text-sm font-bold mb-2">MOST POPULAR</div>}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-6">
                  {plan.price}
                  {plan.period && <span className="text-lg text-gray-300">{plan.period}</span>}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={() => {
                  setAuthMode("create");
                  setCurrentPage("dashboard");
                }} className={`w-full py-3 rounded-lg font-bold transition cursor-pointer ${
                  plan.popular
                    ? "bg-white text-purple-600 hover:bg-gray-100"
                    : "bg-purple-600 hover:bg-purple-500 text-white"
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="contact" className="py-20 px-6 bg-black/20 border-y border-purple-500/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8">Get the latest news about our features and updates</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 cursor-text"
            />
            <button onClick={() => alert(`Subscribed: ${email}`)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-3 rounded-lg font-bold transition cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">Features</a></li>
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">About</a></li>
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">Terms</a></li>
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">Twitter</a></li>
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">LinkedIn</a></li>
                <li><a href="#" className="hover:text-purple-400 cursor-pointer">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-500/20 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Advancia Pay Ledger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
