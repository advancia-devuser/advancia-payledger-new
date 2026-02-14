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
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [referralCode] = useState("ADV-" + Math.random().toString(36).substring(2, 8).toUpperCase());

  // Mock wallet data
  const mockWallets = [
    { id: "btc-1", name: "Bitcoin Wallet", currency: "BTC", balance: 0.00000000, usdValue: 0.00, icon: "₿", color: "from-orange-500 to-yellow-600" },
    { id: "eth-1", name: "Ethereum Wallet", currency: "ETH", balance: 0.000000, usdValue: 0.00, icon: "Ξ", color: "from-blue-500 to-indigo-600" },
    { id: "usdc-1", name: "USD Coin", currency: "USDC", balance: 0.00, usdValue: 0.00, icon: "$", color: "from-green-500 to-emerald-600" }
  ];

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

  const totalBalance = mockWallets.reduce((sum, wallet) => sum + wallet.usdValue, 0);

  // Mock notifications
  const mockNotifications = [
    { id: 1, type: "success", icon: "✅", title: "Account Created", message: "Welcome to Advancia PayLedger!", time: "Just now", read: false },
    { id: 2, type: "info", icon: "💰", title: "Wallet Ready", message: "Your wallets are ready to use", time: "2 min ago", read: false },
    { id: 3, type: "warning", icon: "🔐", title: "Enable 2FA", message: "Secure your account with two-factor authentication", time: "5 min ago", read: false },
    { id: 4, type: "info", icon: "📊", title: "Market Update", message: "BTC is up 5.2% today", time: "1 hour ago", read: true },
    { id: 5, type: "success", icon: "🎉", title: "Verification Complete", message: "Your identity has been verified", time: "2 hours ago", read: true }
  ];

  // Mock activity feed
  const mockActivities = [
    { id: 1, type: "login", icon: "🔓", action: "You logged in", details: "From Windows (Chrome)", time: "Just now", color: "blue" },
    { id: 2, type: "account", icon: "👤", action: "Account created", details: "Welcome to Advancia!", time: "2 min ago", color: "green" },
    { id: 3, type: "wallet", icon: "👛", action: "Wallet initialized", details: "BTC, ETH, USDC wallets added", time: "2 min ago", color: "purple" },
    { id: 4, type: "security", icon: "🔐", action: "Security check", details: "All systems secure", time: "5 min ago", color: "green" }
  ];

  // Mock search data
  const mockSearchResults = [
    { id: 1, type: "wallet", title: "Bitcoin Wallet", description: "BTC - 0.00000000", icon: "₿" },
    { id: 2, type: "wallet", title: "Ethereum Wallet", description: "ETH - 0.000000", icon: "Ξ" },
    { id: 3, type: "wallet", title: "USD Coin", description: "USDC - 0.00", icon: "$" },
    { id: 4, type: "booking", title: "Executive Suite", description: "Premium workspace", icon: "🏢" },
    { id: 5, type: "feature", title: "Send Payment", description: "Transfer funds", icon: "💸" },
    { id: 6, type: "feature", title: "Analytics", description: "View statistics", icon: "📊" }
  ];

  const filteredSearchResults = searchQuery.length > 0 
    ? mockSearchResults.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Mock FAQ data
  const mockFAQs = [
    { id: 1, category: "Getting Started", question: "How do I create a wallet?", answer: "Navigate to the Wallet tab and click 'Add Wallet'. Choose your currency and follow the setup process." },
    { id: 2, category: "Getting Started", question: "How do I verify my account?", answer: "Click on your profile, go to Settings, and complete the KYC verification process." },
    { id: 3, category: "Payments", question: "How long do transfers take?", answer: "Internal transfers are instant. External transfers may take 1-3 business days depending on the network." },
    { id: 4, category: "Payments", question: "What are the transaction fees?", answer: "Fees vary by currency. BTC: 0.0001, ETH: 0.001, USDC: $0.50. Enterprise accounts get discounted rates." },
    { id: 5, category: "Security", question: "How do I enable 2FA?", answer: "Go to Settings > Security > Two-Factor Authentication and follow the setup wizard." },
    { id: 6, category: "Security", question: "What if I lose my password?", answer: "Click 'Forgot Password' on the login page. You'll receive a reset link via email." },
    { id: 7, category: "Booking", question: "How do I book a chamber?", answer: "Go to the Booking tab, select your preferred chamber, choose a time slot, and confirm your booking." },
    { id: 8, category: "Booking", question: "Can I cancel a booking?", answer: "Yes, you can cancel up to 24 hours before the scheduled time for a full refund." }
  ];

  // Mock active sessions
  const mockSessions = [
    { id: 1, device: "Windows PC", browser: "Chrome 121", location: "New York, USA", ip: "192.168.1.1", lastActive: "Just now", current: true },
    { id: 2, device: "iPhone 15 Pro", browser: "Safari", location: "New York, USA", ip: "192.168.1.50", lastActive: "2 hours ago", current: false }
  ];

  // Mock security audit log
  const mockSecurityLog = [
    { id: 1, event: "Login successful", device: "Windows PC", time: "Just now", status: "success" },
    { id: 2, event: "Account created", device: "Windows PC", time: "5 min ago", status: "success" },
    { id: 3, event: "Email verified", device: "Windows PC", time: "6 min ago", status: "success" },
    { id: 4, event: "Password updated", device: "Unknown", time: "2 days ago", status: "info" }
  ];

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
              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-700 rounded-lg transition cursor-pointer"
                >
                  <span className="text-2xl">🔔</span>
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-gray-800 border border-purple-500 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
                    <div className="sticky top-0 bg-gray-800 border-b border-purple-500/50 p-4 flex items-center justify-between">
                      <h3 className="text-white font-bold">Notifications</h3>
                      <button 
                        onClick={() => setUnreadNotifications(0)}
                        className="text-purple-400 hover:text-purple-300 text-sm font-semibold"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="divide-y divide-gray-700">
                      {mockNotifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`p-4 hover:bg-gray-700/50 cursor-pointer transition ${!notif.read ? 'bg-purple-900/20' : ''}`}
                        >
                          <div className="flex gap-3">
                            <div className="text-2xl">{notif.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-white font-semibold text-sm">{notif.title}</h4>
                                {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                              </div>
                              <p className="text-gray-400 text-sm mb-1">{notif.message}</p>
                              <p className="text-gray-500 text-xs">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-gray-900/50 text-center border-t border-purple-500/50">
                      <button 
                        onClick={() => { setActiveTab("notifications"); setShowNotifications(false); }}
                        className="text-purple-400 hover:text-purple-300 font-semibold text-sm"
                      >
                        View All Notifications →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Global Search */}
              <div className="relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition cursor-pointer"
                >
                  <span className="text-2xl">🔍</span>
                </button>
                
                {/* Search Modal */}
                {showSearch && (
                  <div className="absolute right-0 mt-2 w-[500px] bg-gray-800 border border-purple-500 rounded-lg shadow-2xl z-50">
                    <div className="p-4">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search wallets, transactions, bookings..."
                        className="w-full bg-gray-700 border border-purple-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                        autoFocus
                      />
                    </div>
                    
                    {searchQuery.length > 0 && (
                      <div className="max-h-96 overflow-y-auto border-t border-gray-700">
                        {filteredSearchResults.length > 0 ? (
                          <div className="divide-y divide-gray-700">
                            {filteredSearchResults.map((result) => (
                              <div
                                key={result.id}
                                className="p-4 hover:bg-gray-700/50 cursor-pointer transition flex items-center gap-4"
                                onClick={() => {
                                  setShowSearch(false);
                                  setSearchQuery("");
                                  if (result.type === "wallet") setActiveTab("wallet");
                                  if (result.type === "booking") setActiveTab("booking");
                                  if (result.type === "feature") setActiveTab(result.title.toLowerCase().includes("payment") ? "payments" : "analytics");
                                }}
                              >
                                <div className="text-3xl">{result.icon}</div>
                                <div className="flex-1">
                                  <h4 className="text-white font-semibold">{result.title}</h4>
                                  <p className="text-gray-400 text-sm">{result.description}</p>
                                </div>
                                <span className="text-purple-400 text-xs uppercase font-semibold">{result.type}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center text-gray-400">
                            <span className="text-4xl block mb-2">🔍</span>
                            No results found for "{searchQuery}"
                          </div>
                        )}
                      </div>
                    )}
                    
                    {searchQuery.length === 0 && (
                      <div className="p-6 text-center text-gray-400 text-sm">
                        <p className="mb-2">Quick search tips:</p>
                        <p className="text-xs">• Search for wallets (BTC, ETH, USDC)</p>
                        <p className="text-xs">• Find bookings and chambers</p>
                        <p className="text-xs">• Access features quickly</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
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
        <nav className="bg-gray-800 border-b border-purple-500 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-6 flex gap-8">
            {["dashboard", "wallet", "payments", "booking", "healthcare", "analytics", "wireframes", "ecosystem", "activity", "notifications", "settings", "security", "referral", "api", "help", "admin"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-semibold capitalize transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab === "notifications" && unreadNotifications > 0 && (
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                )}
                {tab}
              </button>
            ))}
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* New User Welcome Banner */}
              {isNewUser && (
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-5xl">👋</span>
                        <h2 className="text-3xl font-bold">Welcome, {authName || "Friend"}!</h2>
                      </div>
                      <p className="text-indigo-100 text-lg mb-4">
                        Your Advancia PayLedger account is ready. Let's get you started with a quick tour!
                      </p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setOnboardingStep(1)}
                          className="bg-white text-purple-600 font-bold px-6 py-3 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                        >
                          Start Tour 🚀
                        </button>
                        <button 
                          onClick={() => setIsNewUser(false)}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
                        >
                          Skip for Now
                        </button>
                      </div>
                    </div>
                    <div className="text-6xl">🎉</div>
                  </div>
                </div>
              )}

              {/* Getting Started Checklist */}
              {isNewUser && (
                <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white font-bold text-xl">Getting Started Checklist</h3>
                      <p className="text-gray-400 text-sm">Complete these steps to unlock the full power of your account</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-400">{completedTasks.length}/6</p>
                      <p className="text-gray-400 text-xs">Completed</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: "profile", icon: "👤", title: "Complete Your Profile", desc: "Add your personal information", action: () => setActiveTab("admin") },
                      { id: "wallet", icon: "👛", title: "Set Up Your First Wallet", desc: "Add BTC, ETH, or USDC wallet", action: () => setActiveTab("wallet") },
                      { id: "verify", icon: "✅", title: "Verify Your Identity", desc: "KYC verification for higher limits", action: () => {} },
                      { id: "deposit", icon: "💰", title: "Make Your First Deposit", desc: "Add funds to start transacting", action: () => setActiveTab("wallet") },
                      { id: "booking", icon: "🏥", title: "Book a Chamber", desc: "Reserve your first healthcare session", action: () => setActiveTab("booking") },
                      { id: "security", icon: "🔐", title: "Enable 2FA Security", desc: "Protect your account with 2FA", action: () => {} }
                    ].map((task) => (
                      <div 
                        key={task.id}
                        onClick={() => {
                          if (!completedTasks.includes(task.id)) {
                            setCompletedTasks([...completedTasks, task.id]);
                          }
                          task.action();
                        }}
                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                          completedTasks.includes(task.id)
                            ? 'bg-green-900/30 border-green-500/50'
                            : 'bg-gray-700/30 border-purple-500/30 hover:border-purple-400 hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="text-3xl">{task.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{task.title}</h4>
                          <p className="text-gray-400 text-sm">{task.desc}</p>
                        </div>
                        {completedTasks.includes(task.id) ? (
                          <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                            ✓
                          </div>
                        ) : (
                          <div className="bg-gray-700 text-gray-400 rounded-full w-8 h-8 flex items-center justify-center border border-gray-600">
                            ○
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {completedTasks.length === 6 && (
                    <div className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-center">
                      <div className="text-4xl mb-2">🎊</div>
                      <h4 className="text-white font-bold text-xl mb-2">Congratulations!</h4>
                      <p className="text-green-100 mb-4">You've completed the setup process. Your account is fully activated!</p>
                      <button 
                        onClick={() => setIsNewUser(false)}
                        className="bg-white text-green-600 font-bold px-6 py-2 rounded-lg hover:bg-green-50 transition cursor-pointer"
                      >
                        Continue to Dashboard
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Start Guide */}
              {isNewUser && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div 
                    onClick={() => setActiveTab("wallet")}
                    className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 border border-blue-500/40 rounded-xl p-6 cursor-pointer hover:scale-105 hover:border-blue-400 transition"
                  >
                    <div className="text-4xl mb-3">💳</div>
                    <h4 className="text-white font-bold mb-2">Manage Crypto</h4>
                    <p className="text-blue-200 text-sm mb-4">Store and manage Bitcoin, Ethereum, and stablecoins securely</p>
                    <button className="text-blue-300 hover:text-blue-200 font-semibold text-sm">
                      Explore Wallets →
                    </button>
                  </div>
                  <div 
                    onClick={() => setActiveTab("booking")}
                    className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 border border-purple-500/40 rounded-xl p-6 cursor-pointer hover:scale-105 hover:border-purple-400 transition"
                  >
                    <div className="text-4xl mb-3">🏥</div>
                    <h4 className="text-white font-bold mb-2">Healthcare Access</h4>
                    <p className="text-purple-200 text-sm mb-4">Book private chambers and manage your healthcare plans</p>
                    <button className="text-purple-300 hover:text-purple-200 font-semibold text-sm">
                      View Chambers →
                    </button>
                  </div>
                  <div 
                    onClick={() => setActiveTab("analytics")}
                    className="bg-gradient-to-br from-green-900/60 to-emerald-900/60 border border-green-500/40 rounded-xl p-6 cursor-pointer hover:scale-105 hover:border-green-400 transition"
                  >
                    <div className="text-4xl mb-3">📊</div>
                    <h4 className="text-white font-bold mb-2">Track Everything</h4>
                    <p className="text-green-200 text-sm mb-4">Real-time analytics for your finances and healthcare</p>
                    <button className="text-green-300 hover:text-green-200 font-semibold text-sm">
                      See Analytics →
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Actions Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab("payments")}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl p-4 text-white transition-all hover:scale-105 shadow-lg cursor-pointer text-left"
                >
                  <div className="text-2xl mb-2">💸</div>
                  <div className="font-semibold">Send Money</div>
                  <div className="text-xs text-blue-200">Quick transfer</div>
                </button>
                <button 
                  onClick={() => setActiveTab("booking")}
                  className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl p-4 text-white transition-all hover:scale-105 shadow-lg cursor-pointer text-left"
                >
                  <div className="text-2xl mb-2">🏥</div>
                  <div className="font-semibold">Book Chamber</div>
                  <div className="text-xs text-purple-200">Healthcare visit</div>
                </button>
                <button 
                  onClick={() => setActiveTab("wallet")}
                  className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-xl p-4 text-white transition-all hover:scale-105 shadow-lg cursor-pointer text-left"
                >
                  <div className="text-2xl mb-2">👛</div>
                  <div className="font-semibold">My Wallet</div>
                  <div className="text-xs text-green-200">View balances</div>
                </button>
                <button 
                  onClick={() => {
                    // Generate CSV export
                    const reportData = `Advancia PayLedger Report - ${new Date().toLocaleDateString()}\n\n` +
                      `Account Holder: ${authName || "User"}\n` +
                      `Email: ${authEmail || "user@example.com"}\n\n` +
                      `WALLET SUMMARY\n` +
                      `Bitcoin (BTC): 0.00000000 BTC ($0.00)\n` +
                      `Ethereum (ETH): 0.000000 ETH ($0.00)\n` +
                      `USD Coin (USDC): 0.00 USDC ($0.00)\n` +
                      `Total Portfolio Value: $${totalBalance.toFixed(2)}\n\n` +
                      `TRANSACTIONS\n` +
                      `No transactions yet\n\n` +
                      `Generated on: ${new Date().toLocaleString()}`;
                    
                    const blob = new Blob([reportData], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `PayLedger-Report-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }}
                  className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 rounded-xl p-4 text-white transition-all hover:scale-105 shadow-lg cursor-pointer text-left"
                >
                  <div className="text-2xl mb-2">📥</div>
                  <div className="font-semibold">Export Report</div>
                  <div className="text-xs text-orange-200">Download CSV</div>
                </button>
              </div>

              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => setActiveTab("wallet")}
                  className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-lg cursor-pointer hover:scale-105 transition"
                >
                  <p className="text-blue-100 text-sm mb-2">Total Balance</p>
                  <p className="text-3xl font-bold mb-2">${totalBalance.toFixed(2)}</p>
                  <p className="text-blue-200 text-xs">Click to view wallets →</p>
                </div>
                <div 
                  onClick={() => setActiveTab("healthcare")}
                  className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 text-white shadow-lg cursor-pointer hover:scale-105 transition"
                >
                  <p className="text-green-100 text-sm mb-2">Healthcare Coverage</p>
                  <p className="text-3xl font-bold mb-2">$8,450</p>
                  <p className="text-green-200 text-xs">Annual limit remaining</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white shadow-lg cursor-pointer hover:scale-105 transition">
                  <p className="text-purple-100 text-sm mb-2">Monthly Transactions</p>
                  <p className="text-3xl font-bold mb-2">0</p>
                  <p className="text-purple-200 text-xs">Start transacting now</p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Recent Transactions</h3>
                  <button 
                    onClick={() => setActiveTab("payments")}
                    className="text-purple-400 hover:text-purple-300 text-sm font-semibold cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
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
                          <td colSpan={5} className="py-8 px-4 text-center">
                            <div className="text-5xl mb-3">🎉</div>
                            <p className="text-gray-400 font-semibold mb-2">No transactions yet!</p>
                            <p className="text-gray-500 text-sm mb-4">Start your first transaction to see it here</p>
                            <button 
                              onClick={() => setActiveTab("payments")}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-6 py-2 rounded-lg transition cursor-pointer inline-block"
                            >
                              Make First Transaction
                            </button>
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
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setShowSendModal(true)}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl p-4 text-white transition-all hover:scale-105 shadow-lg cursor-pointer"
                >
                  <div className="text-3xl mb-2">↗️</div>
                  <div className="font-semibold">Send</div>
                  <div className="text-xs text-blue-200">Transfer funds</div>
                </button>
                <button 
                  onClick={() => setShowReceiveModal(true)}
                  className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-xl p-4 text-white transition-all hover:scale-105 shadow-lg cursor-pointer"
                >
                  <div className="text-3xl mb-2">↙️</div>
                  <div className="font-semibold">Receive</div>
                  <div className="text-xs text-green-200">Get paid</div>
                </button>
                <button className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl p-4 text-white transition-all hover:scale-105 shadow-lg cursor-pointer">
                  <div className="text-3xl mb-2">🔄</div>
                  <div className="font-semibold">Swap</div>
                  <div className="text-xs text-purple-200">Exchange crypto</div>
                </button>
                <button className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 rounded-xl p-4 text-white transition-all hover:scale-105 shadow-lg cursor-pointer">
                  <div className="text-3xl mb-2">💳</div>
                  <div className="font-semibold">Buy</div>
                  <div className="text-xs text-orange-200">Add funds</div>
                </button>
              </div>

              {/* Total Portfolio Value */}
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-indigo-100 text-sm mb-2">Total Portfolio Value</p>
                    <p className="text-5xl font-bold mb-1">${totalBalance.toFixed(2)}</p>
                    <p className="text-indigo-200 text-sm">≈ $0.00 USD</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg px-5 py-2 font-semibold transition cursor-pointer">
                      Add Funds
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg px-5 py-2 font-semibold transition cursor-pointer">
                      Portfolio
                    </button>
                  </div>
                </div>
              </div>

              {/* Wallets Grid */}
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-white font-bold text-xl">My Wallets</h3>
                    <p className="text-gray-400 text-sm">Manage your cryptocurrency wallets</p>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-6 py-2 rounded-lg transition cursor-pointer">
                    + Add Wallet
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockWallets.map((wallet) => (
                    <div 
                      key={wallet.id}
                      onClick={() => setSelectedWallet(wallet.id === selectedWallet ? null : wallet.id)}
                      className={`bg-gradient-to-br ${wallet.color} rounded-xl p-6 text-white cursor-pointer transition-all hover:scale-105 shadow-lg ${selectedWallet === wallet.id ? 'ring-4 ring-white/50' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{wallet.icon}</div>
                        <button className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-full p-2 transition">
                          <span className="text-xl">⋮</span>
                        </button>
                      </div>
                      <div>
                        <p className="text-white/80 text-sm mb-1">{wallet.name}</p>
                        <p className="text-2xl font-bold mb-1">{wallet.balance} {wallet.currency}</p>
                        <p className="text-white/70 text-sm">≈ ${wallet.usdValue.toFixed(2)} USD</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/20 flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSendModal(true);
                          }}
                          className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg py-2 text-sm font-semibold transition"
                        >
                          Send
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowReceiveModal(true);
                          }}
                          className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg py-2 text-sm font-semibold transition"
                        >
                          Receive
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Wallet Details */}
                {selectedWallet && (
                  <div className="mt-6 bg-gray-700/50 border border-purple-500/30 rounded-lg p-6">
                    <h4 className="text-white font-semibold mb-4">Wallet Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wallet Address</span>
                        <span className="text-white font-mono">0x742d...9c3a</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network</span>
                        <span className="text-white">Mainnet</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Transactions</span>
                        <span className="text-white">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created</span>
                        <span className="text-white">Feb 14, 2026</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Wallet Activity */}
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h4 className="text-white font-bold mb-4">Recent Activity</h4>
                <div className="text-center py-8 text-gray-400">
                  <div className="text-5xl mb-3">📭</div>
                  <p>No transactions yet</p>
                  <p className="text-sm mt-2">Your wallet activity will appear here</p>
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
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-6 py-2 rounded-lg transition cursor-pointer">
                    + New Booking
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Chamber A", type: "Executive Suite", availability: "Available Now", price: "$120 / hr", status: "available", amenities: ["WiFi", "Coffee", "Privacy"] },
                    { name: "Chamber B", type: "Wellness Pod", availability: "Next: 3:30 PM", price: "$90 / hr", status: "busy", amenities: ["Massage", "Aromatherapy", "Music"] },
                    { name: "Chamber C", type: "Clinical Room", availability: "Available Tomorrow", price: "$75 / hr", status: "available", amenities: ["Medical Equipment", "Sterilized", "Professional"] }
                  ].map((chamber) => (
                    <div key={chamber.name} className="bg-gray-700/60 border border-purple-500/40 rounded-xl p-5 hover:border-purple-400 transition hover:scale-105 cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-white font-semibold text-lg">{chamber.name}</p>
                          <p className="text-purple-200 text-sm">{chamber.type}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${chamber.status === 'available' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
                          {chamber.status}
                        </span>
                      </div>
                      <div className="flex gap-2 mb-4">
                        {chamber.amenities.map((amenity, idx) => (
                          <span key={idx} className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <p className="text-gray-300">🕒 {chamber.availability}</p>
                        <p className="text-green-400 font-semibold text-lg">{chamber.price}</p>
                      </div>
                      <button className="mt-5 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg transition">
                        Book Now
                      </button>
                      <button className="mt-2 w-full border border-purple-500/50 hover:bg-purple-500/10 text-purple-300 font-semibold py-2 rounded-lg transition">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h4 className="text-white font-bold mb-4">Upcoming Bookings</h4>
                <div className="space-y-4">
                  {[
                    { date: "Feb 16, 2026", time: "10:00 AM", chamber: "Chamber B", type: "Wellness Session", status: "Confirmed", duration: "2 hours" },
                    { date: "Feb 20, 2026", time: "1:30 PM", chamber: "Chamber A", type: "Executive Meeting", status: "Pending", duration: "1 hour" }
                  ].map((booking, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-purple-500/30 rounded-lg p-5 hover:border-purple-400 hover:bg-gray-700/30 transition cursor-pointer">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-white font-semibold text-lg">{booking.chamber}</p>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${booking.status === "Confirmed" ? "bg-green-900 text-green-200" : "bg-yellow-900 text-yellow-200"}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-purple-300 text-sm mb-1">{booking.type}</p>
                        <p className="text-gray-400 text-sm">📅 {booking.date} • ⏰ {booking.time} • ⏱️ {booking.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                          Modify
                        </button>
                        <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                          Cancel
                        </button>
                      </div>
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

          {/* Wireframes Tab */}
          {activeTab === "wireframes" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold text-2xl mb-2">Platform Wireframes</h3>
                <p className="text-gray-400 mb-6">Interactive mockups and UI/UX design system</p>
                
                {/* Wireframe Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/40 rounded-xl p-6 cursor-pointer hover:scale-105 hover:border-blue-400 transition">
                    <div className="text-4xl mb-3">📱</div>
                    <h4 className="text-white font-bold mb-2">Mobile App</h4>
                    <p className="text-gray-300 text-sm mb-4">iOS & Android wireframes</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded">12 Screens</span>
                      <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded">v2.1</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/40 rounded-xl p-6 cursor-pointer hover:scale-105 hover:border-green-400 transition">
                    <div className="text-4xl mb-3">🖥️</div>
                    <h4 className="text-white font-bold mb-2">Web Dashboard</h4>
                    <p className="text-gray-300 text-sm mb-4">Desktop interface flows</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-green-900/50 text-green-200 px-2 py-1 rounded">8 Pages</span>
                      <span className="text-xs bg-emerald-900/50 text-emerald-200 px-2 py-1 rounded">v1.8</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/40 rounded-xl p-6 cursor-pointer hover:scale-105 hover:border-orange-400 transition">
                    <div className="text-4xl mb-3">⚙️</div>
                    <h4 className="text-white font-bold mb-2">Admin Panel</h4>
                    <p className="text-gray-300 text-sm mb-4">Management console</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-orange-900/50 text-orange-200 px-2 py-1 rounded">15 Views</span>
                      <span className="text-xs bg-red-900/50 text-red-200 px-2 py-1 rounded">v1.5</span>
                    </div>
                  </div>
                </div>

                {/* Wireframe Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Login Screen", type: "Auth", screens: ["Email", "Password", "2FA"], color: "blue" },
                    { title: "Dashboard Home", type: "Main", screens: ["Overview", "Quick Actions", "Stats"], color: "purple" },
                    { title: "Wallet View", type: "Finance", screens: ["Balances", "History", "Send/Receive"], color: "green" },
                    { title: "Payment Flow", type: "Transaction", screens: ["Enter Amount", "Confirm", "Success"], color: "indigo" },
                    { title: "Booking System", type: "Healthcare", screens: ["Select Chamber", "Date/Time", "Confirm"], color: "pink" },
                    { title: "User Profile", type: "Account", screens: ["Settings", "Security", "Preferences"], color: "cyan" }
                  ].map((wireframe, idx) => (
                    <div key={idx} className={`bg-gray-700/50 border border-${wireframe.color}-500/30 rounded-lg p-5 hover:border-${wireframe.color}-400 transition cursor-pointer`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-semibold">{wireframe.title}</h4>
                        <span className={`text-xs font-semibold px-2 py-1 rounded bg-${wireframe.color}-900/50 text-${wireframe.color}-200`}>
                          {wireframe.type}
                        </span>
                      </div>
                      <div className="bg-gray-900 rounded border border-gray-600 p-4 mb-4 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mx-auto mb-2 border border-gray-500 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Wireframe</span>
                          </div>
                          <p className="text-gray-500 text-xs">Interactive Mockup</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {wireframe.screens.map((screen, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                            <div className={`w-2 h-2 rounded-full bg-${wireframe.color}-500`}></div>
                            <span>{screen}</span>
                          </div>
                        ))}
                      </div>
                      <button className={`mt-4 w-full bg-${wireframe.color}-600/20 hover:bg-${wireframe.color}-600/40 border border-${wireframe.color}-500/50 text-${wireframe.color}-300 font-semibold py-2 rounded transition`}>
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design System */}
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h4 className="text-white font-bold text-xl mb-4">Design System</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition">
                    <div className="text-3xl mb-2">🎨</div>
                    <p className="text-white font-semibold text-sm">Colors</p>
                    <p className="text-gray-400 text-xs">24 Palette</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition">
                    <div className="text-3xl mb-2">📝</div>
                    <p className="text-white font-semibold text-sm">Typography</p>
                    <p className="text-gray-400 text-xs">8 Styles</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition">
                    <div className="text-3xl mb-2">🔲</div>
                    <p className="text-white font-semibold text-sm">Components</p>
                    <p className="text-gray-400 text-xs">45 Elements</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition">
                    <div className="text-3xl mb-2">✨</div>
                    <p className="text-white font-semibold text-sm">Icons</p>
                    <p className="text-gray-400 text-xs">120+ Icons</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ecosystem Tab */}
          {activeTab === "ecosystem" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold text-2xl mb-2">Platform Ecosystem</h3>
                <p className="text-gray-400 mb-6">Integrated services and partner network</p>

                {/* Central Platform */}
                <div className="relative mb-12">
                  <div className="max-w-md mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center shadow-2xl cursor-pointer hover:scale-105 transition">
                    <div className="text-5xl mb-3">🏦</div>
                    <h4 className="text-2xl font-bold mb-2">Advancia PayLedger</h4>
                    <p className="text-blue-100 text-sm">Core Platform</p>
                  </div>
                </div>

                {/* Ecosystem Components */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { icon: "💰", title: "Payment Gateway", desc: "Crypto & Fiat Processing", partners: ["Stripe", "Coinbase", "PayPal"], color: "from-green-600 to-emerald-700" },
                    { icon: "🏥", title: "Healthcare Network", desc: "Medical Service Providers", partners: ["UnitedHealth", "Aetna", "BlueCross"], color: "from-blue-600 to-cyan-700" },
                    { icon: "🔐", title: "Security Layer", desc: "Identity & Authentication", partners: ["Auth0", "Okta", "1Password"], color: "from-red-600 to-orange-700" },
                    { icon: "📊", title: "Analytics Engine", desc: "Business Intelligence", partners: ["Tableau", "PowerBI", "Looker"], color: "from-purple-600 to-pink-700" },
                    { icon: "🌐", title: "Blockchain Networks", desc: "Multi-chain Support", partners: ["Bitcoin", "Ethereum", "Polygon"], color: "from-yellow-600 to-amber-700" },
                    { icon: "💳", title: "Banking Partners", desc: "Traditional Finance", partners: ["Chase", "BofA", "Wells Fargo"], color: "from-indigo-600 to-blue-700" },
                    { icon: "📱", title: "Mobile SDKs", desc: "iOS & Android Libraries", partners: ["React Native", "Flutter", "Swift"], color: "from-teal-600 to-green-700" },
                    { icon: "🔔", title: "Notifications", desc: "Multi-channel Alerts", partners: ["Twilio", "SendGrid", "Firebase"], color: "from-pink-600 to-rose-700" }
                  ].map((component, idx) => (
                    <div key={idx} className={`bg-gradient-to-br ${component.color} rounded-xl p-6 text-white shadow-lg cursor-pointer hover:scale-105 transition`}>
                      <div className="text-4xl mb-3">{component.icon}</div>
                      <h4 className="font-bold mb-1">{component.title}</h4>
                      <p className="text-white/80 text-xs mb-4">{component.desc}</p>
                      <div className="space-y-1">
                        {component.partners.map((partner, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                            <span className="text-white/90">{partner}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Integration Flow */}
                <div className="bg-gray-700/50 border border-purple-500/30 rounded-lg p-6">
                  <h4 className="text-white font-bold mb-6">Integration Architecture</h4>
                  <div className="space-y-4">
                    {[
                      { layer: "Presentation Layer", components: ["Web App", "Mobile App", "Admin Dashboard"], color: "blue" },
                      { layer: "API Gateway", components: ["REST API", "GraphQL", "WebSocket"], color: "purple" },
                      { layer: "Business Logic", components: ["Payment Service", "Healthcare Service", "User Management"], color: "green" },
                      { layer: "Data Layer", components: ["PostgreSQL", "Redis Cache", "S3 Storage"], color: "orange" },
                      { layer: "Infrastructure", components: ["AWS/Azure", "CDN", "Load Balancer"], color: "red" }
                    ].map((layer, idx) => (
                      <div key={idx} className="flex items-center gap-4 cursor-pointer hover:bg-gray-700/30 p-3 rounded transition">
                        <div className={`bg-${layer.color}-600 text-white px-4 py-2 rounded-lg font-semibold text-sm min-w-[160px] text-center`}>
                          {layer.layer}
                        </div>
                        <div className="flex-1 flex gap-2 flex-wrap">
                          {layer.components.map((comp, i) => (
                            <span key={i} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-600">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* API Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/40 rounded-lg p-6 cursor-pointer hover:scale-105 transition">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-bold">API Status</h4>
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                  <p className="text-3xl font-bold text-green-400 mb-1">99.98%</p>
                  <p className="text-green-200 text-sm">Uptime (30 days)</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/40 rounded-lg p-6 cursor-pointer hover:scale-105 transition">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-bold">API Calls</h4>
                    <span className="text-2xl">📈</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-400 mb-1">2.4M</p>
                  <p className="text-blue-200 text-sm">Requests/day</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/40 rounded-lg p-6 cursor-pointer hover:scale-105 transition">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-bold">Response Time</h4>
                    <span className="text-2xl">⚡</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-400 mb-1">45ms</p>
                  <p className="text-purple-200 text-sm">Average latency</p>
                </div>
              </div>
            </div>
          )}

          {/*Activity Tab */}
          {activeTab === "activity" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold text-2xl mb-2">Activity Feed</h3>
                <p className="text-gray-400 mb-6">Real-time updates and account activity</p>
                
                <div className="space-y-3">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className={`flex items-start gap-4 p-4 bg-${activity.color}-900/20 border border-${activity.color}-500/30 rounded-lg hover:border-${activity.color}-400 transition cursor-pointer`}>
                      <div className="text-3xl">{activity.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">{activity.action}</h4>
                        <p className="text-gray-400 text-sm mb-2">{activity.details}</p>
                        <p className="text-gray-500 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/40 rounded-lg p-6">
                  <div className="text-3xl mb-2">📍</div>
                  <h4 className="text-white font-bold mb-1">Last Login</h4>
                  <p className="text-blue-200 text-sm">Windows (Chrome)</p>
                  <p className="text-gray-400 text-xs mt-1">192.168.1.1</p>
                </div>
                <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/40 rounded-lg p-6">
                  <div className="text-3xl mb-2">🔓</div>
                  <h4 className="text-white font-bold mb-1">Active Sessions</h4>
                  <p className="text-green-200 text-sm">1 device</p>
                  <p className="text-gray-400 text-xs mt-1">This device</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/40 rounded-lg p-6">
                  <div className="text-3xl mb-2">⏱️</div>
                  <h4 className="text-white font-bold mb-1">Account Age</h4>
                  <p className="text-purple-200 text-sm">Just created</p>
                  <p className="text-gray-400 text-xs mt-1">Feb 14, 2026</p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-bold text-2xl mb-1">All Notifications</h3>
                    <p className="text-gray-400 text-sm">{unreadNotifications} unread notifications</p>
                  </div>
                  <button 
                    onClick={() => setUnreadNotifications(0)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
                  >
                    Mark All Read
                  </button>
                </div>

                <div className="space-y-3">
                  {mockNotifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`flex items-start gap-4 p-5 rounded-lg border cursor-pointer hover:border-purple-400 transition ${
                        !notif.read ? 'bg-purple-900/20 border-purple-500/30' : 'bg-gray-700/30 border-gray-600'
                      }`}
                    >
                      <div className="text-4xl">{notif.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-bold">{notif.title}</h4>
                          {!notif.read && <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>}
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{notif.message}</p>
                        <p className="text-gray-500 text-xs">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h4 className="text-white font-bold mb-4">Notification Preferences</h4>
                <div className="space-y-3">
                  {[
                    { id: "email", label: "Email Notifications", desc: "Receive updates via email", enabled: true },
                    { id: "push", label: "Push Notifications", desc: "Browser push notifications", enabled: true },
                    { id: "sms", label: "SMS Alerts", desc: "Text message for important updates", enabled: false },
                    { id: "marketing", label: "Marketing Updates", desc: "News and promotional offers", enabled: false }
                  ].map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <div>
                        <h5 className="text-white font-semibold">{pref.label}</h5>
                        <p className="text-gray-400 text-sm">{pref.desc}</p>
                      </div>
                      <button className={`px-4 py-2 rounded-lg font-semibold transition ${pref.enabled ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 hover:bg-gray-500'} text-white cursor-pointer`}>
                        {pref.enabled ? 'On' : 'Off'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold text-2xl mb-6">Account Settings</h3>
                
                {/* Profile Section */}
                <div className="mb-8">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span>👤</span> Profile Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Full Name</label>
                      <input type="text" value={authName || "User"} className="w-full bg-gray-700 border border-purple-500/50 rounded-lg px-4 py-3 text-white" />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                      <input type="email" value={authEmail || "user@example.com"} className="w-full bg-gray-700 border border-purple-500/50 rounded-lg px-4 py-3 text-white" />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
                      <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-gray-700 border border-purple-500/50 rounded-lg px-4 py-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="mb-8">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span>🔐</span> Security
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <div>
                        <h5 className="text-white font-semibold">Two-Factor Authentication</h5>
                        <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                      </div>
                      <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <div>
                        <h5 className="text-white font-semibold">Change Password</h5>
                        <p className="text-gray-400 text-sm">Update your password regularly</p>
                      </div>
                      <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer">
                        Change
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <div>
                        <h5 className="text-white font-semibold">Active Sessions</h5>
                        <p className="text-gray-400 text-sm">Manage your logged-in devices</p>
                      </div>
                      <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer">
                        View All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span>⚙️</span> Preferences
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <div>
                        <h5 className="text-white font-semibold">Language</h5>
                        <p className="text-gray-400 text-sm">English (US)</p>
                      </div>
                      <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer">
                        Change
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <div>
                        <h5 className="text-white font-semibold">Currency</h5>
                        <p className="text-gray-400 text-sm">USD ($)</p>
                      </div>
                      <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer">
                        Change
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <div>
                        <h5 className="text-white font-semibold">Theme</h5>
                        <p className="text-gray-400 text-sm">Dark Mode</p>
                      </div>
                      <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer">
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 p-6 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <h4 className="text-red-400 font-bold mb-2">Danger Zone</h4>
                  <p className="text-gray-300 text-sm mb-4">Irreversible actions</p>
                  <div className="flex gap-3">
                    <button className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer">
                      Delete Account
                    </button>
                    <button className="bg-orange-600 hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer">
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help & Support Tab */}
          {activeTab === "help" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold text-2xl mb-2">Help & Support</h3>
                <p className="text-gray-400 mb-6">Find answers, get help, and contact our support team</p>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/40 rounded-lg p-6 cursor-pointer hover:border-blue-400 transition">
                    <div className="text-4xl mb-3">📚</div>
                    <h4 className="text-white font-bold mb-2">Documentation</h4>
                    <p className="text-gray-300 text-sm">Comprehensive guides and tutorials</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/40 rounded-lg p-6 cursor-pointer hover:border-green-400 transition">
                    <div className="text-4xl mb-3">💬</div>
                    <h4 className="text-white font-bold mb-2">Live Chat</h4>
                    <p className="text-gray-300 text-sm">Chat with support team (9AM-6PM)</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/40 rounded-lg p-6 cursor-pointer hover:border-purple-400 transition">
                    <div className="text-4xl mb-3">📧</div>
                    <h4 className="text-white font-bold mb-2">Email Support</h4>
                    <p className="text-gray-300 text-sm">support@advanciapayledger.com</p>
                  </div>
                </div>

                {/* FAQs by Category */}
                <div className="space-y-6">
                  <h4 className="text-white font-bold text-xl">Frequently Asked Questions</h4>
                  
                  {["Getting Started", "Payments", "Security", "Booking"].map((category) => (
                    <div key={category} className="bg-gray-700/30 border border-gray-600 rounded-lg p-6">
                      <h5 className="text-white font-bold mb-4 flex items-center gap-2">
                        <span className="text-purple-400">▶</span> {category}
                      </h5>
                      <div className="space-y-4">
                        {mockFAQs
                          .filter((faq) => faq.category === category)
                          .map((faq) => (
                            <div key={faq.id} className="border-l-4 border-purple-500 pl-4 py-2">
                              <h6 className="text-white font-semibold mb-2">{faq.question}</h6>
                              <p className="text-gray-400 text-sm">{faq.answer}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Form */}
                <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6 mt-8">
                  <h4 className="text-white font-bold mb-4">Still Need Help?</h4>
                  <p className="text-gray-400 text-sm mb-4">Send us a message and we'll get back to you within 24 hours</p>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Subject</label>
                      <input type="text" placeholder="What do you need help with?" className="w-full bg-gray-700 border border-purple-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400" />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Category</label>
                      <select className="w-full bg-gray-700 border border-purple-500/50 rounded-lg px-4 py-3 text-white">
                        <option>General Question</option>
                        <option>Account Issue</option>
                        <option>Payment Problem</option>
                        <option>Technical Support</option>
                        <option>Feature Request</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">Message</label>
                      <textarea rows={5} placeholder="Describe your issue in detail..." className="w-full bg-gray-700 border border-purple-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400"></textarea>
                    </div>
                    <button type="button" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-lg transition cursor-pointer">
                      Send Message
                    </button>
                  </form>
                </div>

                {/* System Status */}
                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/40 rounded-lg p-6 mt-8">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-green-400">●</span> System Status
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Platform</span>
                      <span className="text-green-400 font-semibold text-sm">Operational</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">API</span>
                      <span className="text-green-400 font-semibold text-sm">99.98% Uptime</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Payments</span>
                      <span className="text-green-400 font-semibold text-sm">All Systems Go</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Center Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold text-2xl mb-2">Security Center</h3>
                <p className="text-gray-400 mb-6">Manage your account security and privacy settings</p>

                {/* Security Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/40 rounded-lg p-6">
                    <div className="text-4xl mb-3">🛡️</div>
                    <h4 className="text-white font-bold mb-2">Security Score</h4>
                    <p className="text-green-200 text-3xl font-bold mb-2">65/100</p>
                    <p className="text-gray-400 text-sm">Enable 2FA to improve</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/40 rounded-lg p-6">
                    <div className="text-4xl mb-3">🔑</div>
                    <h4 className="text-white font-bold mb-2">2FA Status</h4>
                    <p className="text-orange-200 text-lg font-bold mb-2">Not Enabled</p>
                    <button 
                      onClick={() => setShow2FAModal(true)}
                      className="text-blue-300 hover:text-blue-200 text-sm font-semibold"
                    >
                      Set up now →
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/40 rounded-lg p-6">
                    <div className="text-4xl mb-3">📱</div>
                    <h4 className="text-white font-bold mb-2">Active Devices</h4>
                    <p className="text-purple-200 text-3xl font-bold mb-2">{mockSessions.length}</p>
                    <button 
                      onClick={() => setShowSessionsModal(true)}
                      className="text-purple-300 hover:text-purple-200 text-sm font-semibold"
                    >
                      Manage devices →
                    </button>
                  </div>
                </div>

                {/* Recent Security Activity */}
                <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6 mb-6">
                  <h4 className="text-white font-bold mb-4">Security Audit Log</h4>
                  <div className="space-y-3">
                    {mockSecurityLog.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                          <div>
                            <h5 className="text-white font-semibold text-sm">{log.event}</h5>
                            <p className="text-gray-400 text-xs">{log.device}</p>
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs">{log.time}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Recommendations */}
                <div className="bg-orange-900/20 border border-orange-500/40 rounded-lg p-6">
                  <h4 className="text-orange-400 font-bold mb-4">Security Recommendations</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-orange-400 text-xl">⚠️</span>
                      <div className="flex-1">
                        <h5 className="text-white font-semibold mb-1">Enable Two-Factor Authentication</h5>
                        <p className="text-gray-400 text-sm mb-2">Add an extra layer of security to your account</p>
                        <button 
                          onClick={() => setShow2FAModal(true)}
                          className="bg-orange-600 hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition cursor-pointer"
                        >
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-400 text-xl">ℹ️</span>
                      <div className="flex-1">
                        <h5 className="text-white font-semibold mb-1">Review Active Sessions</h5>
                        <p className="text-gray-400 text-sm">Check for unrecognized devices and sign them out</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✅</span>
                      <div className="flex-1">
                        <h5 className="text-white font-semibold mb-1">Strong Password Detected</h5>
                        <p className="text-gray-400 text-sm">Your password meets security requirements</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Referral Program Tab */}
          {activeTab === "referral" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold text-2xl mb-2">Referral Program</h3>
                <p className="text-gray-400 mb-6">Invite friends and earn rewards together</p>

                {/* Referral Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/40 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-3">💰</div>
                    <h4 className="text-white font-bold mb-2">Total Earned</h4>
                    <p className="text-green-200 text-3xl font-bold">$0.00</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/40 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-3">👥</div>
                    <h4 className="text-white font-bold mb-2">Referrals</h4>
                    <p className="text-blue-200 text-3xl font-bold">0</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/40 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-3">🎁</div>
                    <h4 className="text-white font-bold mb-2">Pending Rewards</h4>
                    <p className="text-purple-200 text-3xl font-bold">$0.00</p>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/40 rounded-lg p-8 mb-6">
                  <h4 className="text-white font-bold text-xl mb-4 text-center">Your Referral Code</h4>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="bg-gray-900 border border-purple-500 rounded-lg px-8 py-4">
                      <p className="text-purple-300 text-3xl font-mono font-bold tracking-wider">{referralCode}</p>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(referralCode);
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-4 rounded-lg transition cursor-pointer"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <p className="text-center text-gray-400 text-sm">Share this code with friends to earn rewards</p>
                </div>

                {/* How It Works */}
                <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6 mb-6">
                  <h4 className="text-white font-bold mb-4">How It Works</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-5xl mb-3">1️⃣</div>
                      <h5 className="text-white font-semibold mb-2">Share Your Code</h5>
                      <p className="text-gray-400 text-sm">Send your referral code to friends and family</p>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl mb-3">2️⃣</div>
                      <h5 className="text-white font-semibold mb-2">They Sign Up</h5>
                      <p className="text-gray-400 text-sm">Your friend creates an account using your code</p>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl mb-3">3️⃣</div>
                      <h5 className="text-white font-semibold mb-2">Both Earn Rewards</h5>
                      <p className="text-gray-400 text-sm">You both get $25 bonus credit after their first transaction</p>
                    </div>
                  </div>
                </div>

                {/* Reward Tiers */}
                <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6">
                  <h4 className="text-white font-bold mb-4">Reward Tiers</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h5 className="text-white font-semibold">Bronze (1-5 referrals)</h5>
                        <p className="text-gray-400 text-sm">$25 per referral</p>
                      </div>
                      <span className="px-4 py-2 bg-orange-900 text-orange-200 rounded-lg font-semibold">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg opacity-50">
                      <div>
                        <h5 className="text-white font-semibold">Silver (6-15 referrals)</h5>
                        <p className="text-gray-400 text-sm">$35 per referral</p>
                      </div>
                      <span className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-semibold">Locked</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg opacity-50">
                      <div>
                        <h5 className="text-white font-semibold">Gold (16+ referrals)</h5>
                        <p className="text-gray-400 text-sm">$50 per referral + exclusive perks</p>
                      </div>
                      <span className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg font-semibold">Locked</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Documentation Tab */}
          {activeTab === "api" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-purple-500 shadow-lg">
                <h3 className="text-white font-bold text-2xl mb-2">API Documentation</h3>
                <p className="text-gray-400 mb-6">Integrate Advancia PayLedger into your applications</p>

                {/* API Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/40 rounded-lg p-6">
                    <div className="text-4xl mb-3">🔗</div>
                    <h4 className="text-white font-bold mb-2">REST API</h4>
                    <p className="text-blue-200 text-sm mb-3">Full RESTful API access</p>
                    <p className="text-gray-400 text-xs">Version 2.0</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/40 rounded-lg p-6">
                    <div className="text-4xl mb-3">⚡</div>
                    <h4 className="text-white font-bold mb-2">Response Time</h4>
                    <p className="text-green-200 text-3xl font-bold mb-2">45ms</p>
                    <p className="text-gray-400 text-xs">Average globally</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/40 rounded-lg p-6">
                    <div className="text-4xl mb-3">✅</div>
                    <h4 className="text-white font-bold mb-2">Uptime</h4>
                    <p className="text-purple-200 text-3xl font-bold mb-2">99.98%</p>
                    <p className="text-gray-400 text-xs">Last 30 days</p>
                  </div>
                </div>

                {/* API Key */}
                <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6 mb-6">
                  <h4 className="text-white font-bold mb-4">API Keys</h4>
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Production Key</span>
                      <span className="text-green-400 text-xs font-semibold">Active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 bg-gray-900 text-purple-300 font-mono text-sm px-4 py-2 rounded">
                        adv_live_••••••••••••••••••••1234
                      </code>
                      <button className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer text-sm">
                        Copy
                      </button>
                    </div>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer">
                    + Generate New Key
                  </button>
                </div>

                {/* Quick Start */}
                <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6 mb-6">
                  <h4 className="text-white font-bold mb-4">Quick Start</h4>
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <p className="text-gray-400 text-xs mb-2">Base URL</p>
                    <code className="text-blue-300 font-mono text-sm">https://api.advanciapayledger.com/v2</code>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-2">Example Request</p>
                    <pre className="text-green-300 font-mono text-xs overflow-x-auto">
{`curl -X GET https://api.advanciapayledger.com/v2/wallets \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                    </pre>
                  </div>
                </div>

                {/* API Endpoints */}
                <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6">
                  <h4 className="text-white font-bold mb-4">Available Endpoints</h4>
                  <div className="space-y-3">
                    {[
                      { method: "GET", endpoint: "/wallets", desc: "List all wallets" },
                      { method: "POST", endpoint: "/payments", desc: "Create a payment" },
                      { method: "GET", endpoint: "/transactions", desc: "Get transaction history" },
                      { method: "POST", endpoint: "/bookings", desc: "Create a booking" },
                      { method: "GET", endpoint: "/user/profile", desc: "Get user profile" },
                      { method: "PUT", endpoint: "/user/settings", desc: "Update settings" }
                    ].map((endpoint, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
                        <span className={`px-3 py-1 rounded font-mono text-xs font-bold ${
                          endpoint.method === 'GET' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="flex-1 text-purple-300 font-mono text-sm">{endpoint.endpoint}</code>
                        <span className="text-gray-400 text-sm">{endpoint.desc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer">
                      View Full Documentation →
                    </button>
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

        {/* Send Modal */}
        {showSendModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSendModal(false)}>
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-purple-500 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-2xl">Send Crypto</h3>
                <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Select Wallet</label>
                  <select className="w-full bg-gray-700 border border-purple-500 rounded-lg px-4 py-3 text-white">
                    <option>Bitcoin Wallet (0.00 BTC)</option>
                    <option>Ethereum Wallet (0.00 ETH)</option>
                    <option>USD Coin (0.00 USDC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Recipient Address</label>
                  <input type="text" placeholder="0x742d35Cc6634C0532925a3b844Bc..." className="w-full bg-gray-700 border border-purple-500 rounded-lg px-4 py-3 text-white placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Amount</label>
                  <input type="number" placeholder="0.00" className="w-full bg-gray-700 border border-purple-500 rounded-lg px-4 py-3 text-white placeholder-gray-400" />
                </div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Network Fee</span>
                    <span className="text-white font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total</span>
                    <span className="text-white font-semibold">$0.00</span>
                  </div>
                </div>
                <button type="button" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition cursor-pointer">
                  Send Transaction
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Receive Modal */}
        {showReceiveModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReceiveModal(false)}>
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-purple-500 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-2xl">Receive Crypto</h3>
                <button onClick={() => setShowReceiveModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Select Wallet</label>
                  <select className="w-full bg-gray-700 border border-purple-500 rounded-lg px-4 py-3 text-white">
                    <option>Bitcoin Wallet</option>
                    <option>Ethereum Wallet</option>
                    <option>USD Coin</option>
                  </select>
                </div>
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-400 font-mono text-xs">QR Code</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Wallet Address</label>
                  <div className="flex gap-2">
                    <input type="text" value="0x742d35Cc6634C0532925a3b844Bc9c3a" readOnly className="flex-1 bg-gray-700 border border-purple-500 rounded-lg px-4 py-3 text-white font-mono text-sm" />
                    <button className="bg-purple-600 hover:bg-purple-500 px-4 py-3 rounded-lg text-white font-semibold transition">
                      Copy
                    </button>
                  </div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-200">
                  <p className="font-semibold mb-1">⚠️ Important</p>
                  <p className="text-xs">Only send crypto to this address. Sending other tokens may result in permanent loss.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2FA Setup Modal */}
        {show2FAModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShow2FAModal(false)}>
            <div className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full border border-purple-500 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-2xl">Enable Two-Factor Authentication</h3>
                <button onClick={() => setShow2FAModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
                    <h4 className="text-white font-bold">Download Authenticator App</h4>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">Install Google Authenticator or Authy on your mobile device</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition cursor-pointer text-sm">
                      📱 iOS App Store
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition cursor-pointer text-sm">
                      🤖 Google Play
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">2</div>
                    <h4 className="text-white font-bold">Scan QR Code</h4>
                  </div>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-gray-400 font-mono text-xs">2FA QR Code</span>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3 mb-2">
                    <p className="text-gray-400 text-xs mb-1">Manual Entry Code</p>
                    <code className="text-purple-300 font-mono text-sm">JBSW Y3DP EHPK 3PXP</code>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold">3</div>
                    <h4 className="text-white font-bold">Enter Verification Code</h4>
                  </div>
                  <input 
                    type="text" 
                    placeholder="000000" 
                    maxLength={6}
                    className="w-full bg-gray-700 border border-green-500 rounded-lg px-4 py-3 text-white text-center font-mono text-2xl tracking-widest placeholder-gray-500"
                  />
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition cursor-pointer">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Management Modal */}
        {showSessionsModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSessionsModal(false)}>
            <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-purple-500 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white font-bold text-2xl">Active Sessions</h3>
                  <p className="text-gray-400 text-sm">Manage devices with access to your account</p>
                </div>
                <button onClick={() => setShowSessionsModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              
              <div className="space-y-4">
                {mockSessions.map((session) => (
                  <div key={session.id} className={`p-6 rounded-lg border ${session.current ? 'bg-green-900/20 border-green-500/40' : 'bg-gray-700/30 border-gray-600'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">
                          {session.device.includes('iPhone') ? '📱' : '💻'}
                        </div>
                        <div>
                          <h4 className="text-white font-bold mb-1">{session.device}</h4>
                          <p className="text-gray-400 text-sm mb-2">{session.browser}</p>
                          {session.current && (
                            <span className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              Current Session
                            </span>
                          )}
                        </div>
                      </div>
                      {!session.current && (
                        <button className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-lg transition cursor-pointer text-sm">
                          Sign Out
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Location</p>
                        <p className="text-white">{session.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">IP Address</p>
                        <p className="text-white font-mono">{session.ip}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Last Active</p>
                        <p className="text-white">{session.lastActive}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition cursor-pointer">
                  Sign Out All Other Sessions
                </button>
              </div>
            </div>
          </div>
        )}
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
