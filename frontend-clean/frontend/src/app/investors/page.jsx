"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Brain,
  Globe,
  BarChart,
} from "lucide-react";

export default function InvestorsPage() {
  const [activeSection, setActiveSection] = useState("problem");

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  const navigation = [
    { id: "problem", label: "Problem", icon: Shield },
    { id: "solution", label: "Solution", icon: Brain },
    { id: "market", label: "Market", icon: TrendingUp },
    { id: "traction", label: "Traction", icon: BarChart },
    { id: "business", label: "Business Model", icon: DollarSign },
    { id: "team", label: "Team", icon: Users },
    { id: "ask", label: "The Ask", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Advancia Pay Ledger
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <Link
              href="mailto:contact@advancia-pay.com"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Seed Investment Opportunity
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Building the Future of
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Healthcare Payments
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The first unified platform combining cryptocurrency payments with
            healthcare facility operations. Think "Stripe + Coinbase meets Epic
            Systems."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 text-gray-700">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold">$850B TAM</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">5 User Roles</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">25+ AI Agents</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Globe className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">6 Blockchains</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  $3.5M
                </div>
                <div className="text-gray-600">Seed Round</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  $15M
                </div>
                <div className="text-gray-600">Pre-Money Valuation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  18mo
                </div>
                <div className="text-gray-600">Path to Series A</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Problem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Healthcare payment systems are broken. Medical facilities lose{" "}
              <span className="font-bold text-red-600">
                $127 billion annually
              </span>{" "}
              to payment processing inefficiencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: DollarSign,
                title: "High Fees",
                description: "2-5% per transaction + 15-25% hidden fees",
                color: "red",
              },
              {
                icon: Clock,
                title: "Slow Settlements",
                description: "3-7 day delays strain facility cash flow",
                color: "orange",
              },
              {
                icon: Shield,
                title: "Limited Options",
                description: "No crypto support during emergencies",
                color: "yellow",
              },
              {
                icon: Globe,
                title: "Cross-Border Issues",
                description: "No transparency in medical tourism payments",
                color: "blue",
              },
            ].map((problem, index) => {
              const Icon = problem.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                >
                  <div
                    className={`w-12 h-12 bg-${problem.color}-100 rounded-lg flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 text-${problem.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{problem.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">The Cost of Inaction</h3>
            <p className="text-lg mb-6">
              First-mover advantage exists NOW before traditional fintech
              players enter this space.
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div>
                <div className="text-3xl font-bold">400M+</div>
                <div className="text-blue-100">Global crypto users</div>
              </div>
              <div>
                <div className="text-3xl font-bold">$2.8T</div>
                <div className="text-blue-100">Medical tourism market</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advancia Pay Ledger unifies cryptocurrency payments with
              healthcare facility operations.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  What We Do
                </h3>
                <div className="space-y-4">
                  {[
                    "Multi-blockchain wallet infrastructure (6 networks)",
                    "Real-time payment processing with instant settlement",
                    "Healthcare facility management system",
                    "AI-powered intelligence (25+ agents)",
                    "Seamless fiat integration with Stripe",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  The "Aha!" Moment
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>📍 Patient in Mexico pays in USDC on phone</p>
                  <p>⚡ Facility receives USD in seconds</p>
                  <p>💰 0.3% fee instead of 3-5%</p>
                  <p>📋 Full compliance audit trail generated</p>
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg text-center">
                  <p className="font-bold text-blue-600">
                    One Platform. Every Payment Method. Zero Friction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Section */}
      <section id="market" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Market Size
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Massive opportunity at the intersection of healthcare and
              cryptocurrency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">$850B</div>
              <div className="text-gray-900 font-semibold mb-2">
                Total Addressable Market
              </div>
              <div className="text-gray-600 text-sm">
                Global healthcare payments + crypto processing + healthcare
                software
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                $85B
              </div>
              <div className="text-gray-900 font-semibold mb-2">
                Serviceable Addressable Market
              </div>
              <div className="text-gray-600 text-sm">
                126K hospitals + 450K outpatient facilities
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">
                $850M
              </div>
              <div className="text-gray-900 font-semibold mb-2">
                Serviceable Obtainable Market
              </div>
              <div className="text-gray-600 text-sm">
                Year 3 target: 50K facilities at 4% penetration
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Market Trends in Our Favor
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  trend:
                    "Crypto payments growing 3x faster than traditional fintech",
                  growth: "67% CAGR",
                },
                {
                  trend:
                    "Healthcare digital transformation accelerated post-pandemic",
                  growth: "15% CAGR",
                },
                {
                  trend:
                    "$2.8T medical tourism industry seeking payment solutions",
                  growth: "High demand",
                },
                {
                  trend: "Regulatory clarity improving globally",
                  growth: "MiCA in EU",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{item.trend}</span>
                  <span className="font-semibold text-green-600">
                    {item.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Traction Section */}
      <section id="traction" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Traction</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Production-ready platform with proven technical infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { metric: "80+", label: "Database Models", detail: "Prisma ORM" },
              {
                metric: "6",
                label: "Blockchain Networks",
                detail: "Full integration",
              },
              { metric: "25+", label: "AI Agents", detail: "Claude + Ollama" },
              {
                metric: "5",
                label: "User Roles",
                detail: "Complete auth system",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.metric}
                </div>
                <div className="font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-600 text-sm">{stat.detail}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Development Milestones Achieved
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "✅ Multi-blockchain wallet infrastructure",
                "✅ Complete KYC/compliance pipeline",
                "✅ Admin dashboard with real-time analytics",
                "✅ Automated withdrawal processing",
                "✅ Healthcare facility management system",
                "✅ Stripe payment integration",
                "✅ Full audit logging and security",
              ].map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    {milestone.substring(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Section */}
      <section id="business" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Business Model
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple revenue streams with exceptional unit economics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Transaction Fees",
                description: "Primary revenue stream",
                details: [
                  "Crypto: 0.3% - 0.5% per transaction",
                  "Traditional: 1.5% - 2% (Stripe + markup)",
                  "5-10x cheaper than competitors",
                ],
              },
              {
                title: "SaaS Subscription",
                description: "Recurring revenue",
                details: [
                  "Basic: $199/month (500 transactions)",
                  "Professional: $499/month (2K transactions)",
                  "Enterprise: $1,499/month (unlimited)",
                ],
              },
              {
                title: "Premium Features",
                description: "High-margin add-ons",
                details: [
                  "Multi-currency conversion: 0.2% fee",
                  "Advanced analytics: $99/month",
                  "Custom AI agents: $5K-$25K",
                  "API access: $299/month",
                ],
              },
            ].map((revenue, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {revenue.title}
                </h3>
                <p className="text-gray-600 mb-4">{revenue.description}</p>
                <ul className="space-y-2">
                  {revenue.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Unit Economics at Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-2xl font-bold mb-2">$1,099</div>
                <div className="text-blue-100">
                  Monthly revenue per facility
                </div>
                <div className="text-sm text-blue-200 mt-1">
                  $600 transactions + $499 SaaS
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">79%</div>
                <div className="text-blue-100">Gross margin</div>
                <div className="text-sm text-blue-200 mt-1">
                  $225 costs per facility
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">10.5:1</div>
                <div className="text-blue-100">LTV/CAC ratio</div>
                <div className="text-sm text-blue-200 mt-1">
                  $26,376 LTV vs $2,500 CAC
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Technical excellence with proven execution capabilities.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Founder & CTO
                </h3>
                <p className="text-gray-600">@advancia/devuser</p>
                <p className="text-blue-600">
                  Full-stack + blockchain expertise
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Technical Achievements
                </h4>
                <ul className="space-y-3">
                  {[
                    "Architected 80+ model database schema",
                    "Integrated 5 blockchain networks with real-time monitoring",
                    "Deployed 25+ AI agents using Claude & Ollama",
                    "Built complete monorepo from scratch",
                    "Automated deployment across Railway & Vercel",
                  ].map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Unfair Advantages
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      icon: "🔥",
                      text: "Deep technical execution - fully functional platform",
                    },
                    {
                      icon: "🚀",
                      text: "AI-first architecture with 25+ specialized agents",
                    },
                    {
                      icon: "🏥",
                      text: "Healthcare domain knowledge in facility management",
                    },
                    {
                      icon: "⚡",
                      text: "18-month technical lead over competitors",
                    },
                  ].map((advantage, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <span className="text-lg">{advantage.icon}</span>
                      <span className="text-gray-700 text-sm">
                        {advantage.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Ask Section */}
      <section id="ask" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Ask</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us in building the future of healthcare payments.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
            <div className="text-center mb-8">
              <div className="text-5xl font-bold mb-4">$3.5 Million</div>
              <div className="text-xl text-blue-100 mb-2">Seed Round</div>
              <div className="text-lg text-blue-200">
                $15M pre-money valuation
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
              {[
                { amount: "$1.4M", label: "Team Expansion", percent: "40%" },
                { amount: "$1.05M", label: "Go-to-Market", percent: "30%" },
                {
                  amount: "$700K",
                  label: "Product Development",
                  percent: "20%",
                },
                { amount: "$245K", label: "Compliance & Legal", percent: "7%" },
                { amount: "$105K", label: "Working Capital", percent: "3%" },
              ].map((allocation, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                >
                  <div className="text-2xl font-bold mb-1">
                    {allocation.amount}
                  </div>
                  <div className="text-sm text-blue-100 mb-1">
                    {allocation.label}
                  </div>
                  <div className="text-xs text-blue-200">
                    {allocation.percent}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              18-Month Milestones
            </h3>
            <div className="space-y-6">
              {[
                {
                  phase: "Months 1-6: Launch & Validate",
                  goals: [
                    "Close 100 facilities ($1.5M monthly volume)",
                    "Achieve $165K MRR",
                    "Hire core team",
                    "Deploy AI fraud detection",
                  ],
                },
                {
                  phase: "Months 7-12: Scale & Expand",
                  goals: [
                    "Grow to 500 facilities ($7.5M monthly volume)",
                    "Hit $550K MRR (3.3x growth)",
                    "Launch in Dubai & Thailand",
                    "Secure strategic partnership",
                  ],
                },
                {
                  phase: "Months 13-18: Accelerate",
                  goals: [
                    "Scale to 1,500 facilities",
                    "Achieve $1.65M MRR → $20M ARR run rate",
                    "Launch white-label solution",
                    "Raise Series A at $80-100M valuation",
                  ],
                },
              ].map((phase, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {phase.split(":")[0]}
                  </h4>
                  <p className="text-gray-600 mb-3">{phase.split(":")[1]}</p>
                  <ul className="space-y-2">
                    {phase.goals.map((goal, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Investment Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "🚀 Massive, underserved market: $850B TAM",
                "🚀 Technical lead: 18-month head start",
                "🚀 Multiple revenue streams: Fees + SaaS + Premium",
                "🚀 Exceptional unit economics: 79% gross margin",
                "🚀 Capital efficient: Built pre-seed with minimal capital",
                "🚀 Clear path to Series A: 18-month milestones",
              ].map((highlight, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 text-left"
                >
                  <p className="text-gray-800 text-sm">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">The Big Vision</h3>
              <p className="text-lg mb-6">
                Today: Healthcare facilities struggling with outdated payment
                systems
                <br />
                <span className="font-bold">
                  In 18 months: The standard for crypto payments in healthcare
                  globally
                </span>
                <br />
                In 5 years: The operating system for financial infrastructure in
                healthcare
              </p>
              <p className="text-xl font-semibold mb-8">
                We're not just building a payment processor.
                <br />
                We're building the financial rails for the future of healthcare.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="mailto:contact@advancia-pay.com"
                  className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-lg"
                >
                  Let's Talk
                </Link>
                <Link
                  href="/sitemap"
                  className="px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
                >
                  View Platform
                </Link>
              </div>

              <div className="mt-8 text-blue-100">
                <p>📧 contact@advancia-pay.com</p>
                <p>🌐 www.advancia-pay.com</p>
                <p>📅 Schedule a demo →</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            This pitch deck is confidential and proprietary. © 2025 Advancia Pay
            Ledger. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
