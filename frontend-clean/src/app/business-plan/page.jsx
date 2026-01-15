"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Brain,
  Globe,
  BarChart,
  Target,
  Zap,
  CheckCircle,
  FileText,
  Download,
  Mail,
  Phone,
} from "lucide-react";

export default function BusinessPlanPage() {
  const [activeSection, setActiveSection] = useState("executive");

  const navigation = [
    { id: "executive", label: "Executive Summary", icon: Target },
    { id: "problem", label: "Problem Statement", icon: Shield },
    { id: "solution", label: "Our Solution", icon: Brain },
    { id: "market", label: "Market Analysis", icon: TrendingUp },
    { id: "business", label: "Business Model", icon: DollarSign },
    { id: "team", label: "Team & Hiring", icon: Users },
    { id: "funding", label: "Funding Requirements", icon: Globe },
    { id: "milestones", label: "Milestones & Roadmap", icon: BarChart },
    { id: "risks", label: "Risk Analysis", icon: Shield },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  const financialData = [
    {
      year: "Year 1",
      users: "2,000",
      volume: "$10M",
      revenue: "$250K",
      net: "-$550K",
    },
    {
      year: "Year 2",
      users: "5,000",
      volume: "$50M",
      revenue: "$1.5M",
      net: "-$300K",
    },
    {
      year: "Year 3",
      users: "12,000",
      volume: "$200M",
      revenue: "$5.2M",
      net: "+$1.7M",
    },
    {
      year: "Year 4-5",
      users: "25,000+",
      volume: "$500M+",
      revenue: "$12M+",
      net: "+$5M+",
    },
  ];

  const milestones = [
    {
      phase: "Q1 2026",
      status: "current",
      items: ["Security audit", "Beta launch", "Compliance process"],
    },
    {
      phase: "Q2 2026",
      status: "upcoming",
      items: ["HIPAA certification", "50 providers", "$50K volume"],
    },
    {
      phase: "Q3 2026",
      status: "upcoming",
      items: ["150+ providers", "EMR partnerships", "$150K volume"],
    },
    {
      phase: "Q4 2026",
      status: "upcoming",
      items: ["PCI-DSS compliance", "300+ providers", "$400K volume"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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

            <div className="flex items-center space-x-4">
              <Link
                href="mailto:advancia@devuser"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25"
              >
                Contact Us
              </Link>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Target className="w-4 h-4 mr-2" />
            Business Plan 2026
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Advancia Pay Ledger
            <span className="block text-3xl text-blue-600 mt-2">
              Business Plan
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionary fintech platform bridging cryptocurrency payments with
            healthcare management, positioned at the intersection of two massive
            growth markets.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 text-gray-700">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold">$4.3T Healthcare Market</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">420M+ Crypto Users</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">6 Blockchain Networks</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  $1.5M
                </div>
                <div className="text-gray-600">Seed Round</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  18-24mo
                </div>
                <div className="text-gray-600">Runway to Profitability</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  $12.4B
                </div>
                <div className="text-gray-600">Healthcare Market by 2028</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section id="executive" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Executive Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  The Opportunity
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Advancia Pay Ledger uniquely positions itself at the
                  intersection of the $12.4 billion healthcare payments market
                  and accelerating cryptocurrency adoption with 420+ million
                  users worldwide. Our platform addresses critical pain points
                  in both sectors through innovative technology integration.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Our Solution
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  A unified platform offering multi-blockchain cryptocurrency
                  payments, traditional payment integration, comprehensive
                  healthcare facility management, and AI-powered automation with
                  25+ integrated agents.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Market Validation
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Fully functional MVP with multi-blockchain support, payment
                  processing, healthcare operations, and AI integration
                  demonstrates technical feasibility and readiness to scale.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Key Differentiators
                </h3>
                <ul className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Only platform combining crypto payments and healthcare
                      management
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Multi-blockchain support (6 networks) with instant
                      conversion
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      25+ AI agents for automation and intelligent insights
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Comprehensive healthcare facility management system
                    </span>
                  </div>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Funding Requirements
                </h3>
                <p className="text-gray-700 mb-4">
                  Seeking $1.5M seed round for team building, infrastructure
                  scaling, and market expansion.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">
                      Team Building:
                    </span>
                    <span className="text-gray-600">35% ($525K)</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      Infrastructure:
                    </span>
                    <span className="text-gray-600">40% ($600K)</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      Marketing:
                    </span>
                    <span className="text-gray-600">15% ($225K)</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      Operations:
                    </span>
                    <span className="text-gray-600">10% ($150K)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Projections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Financial Projections
          </h2>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active Providers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {financialData.map((year, index) => (
                    <tr
                      key={index}
                      className={index === 2 ? "bg-green-50" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {year.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {year.users}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {year.volume}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {year.revenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`font-semibold ${
                            year.net.startsWith("+")
                              ? "text-green-600"
                              : year.net.startsWith("-")
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {year.net}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Key Assumptions
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Average transaction size: $250</li>
                <li>• Provider frequency: 20 transactions/month</li>
                <li>• 70% adoption rate among onboarded providers</li>
                <li>• Customer acquisition cost: $200 per provider</li>
                <li>• Average customer lifetime: 4+ years</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Revenue Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction Fees</span>
                  <span className="font-medium">60%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subscriptions</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Healthcare Features</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">API/Integration</span>
                  <span className="font-medium">5%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Path to Profitability
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Year 1-2: Investment phase</li>
                <li>• Year 3: Achieve profitability</li>
                <li>• Year 4-5: Scale to $5M+ net profit</li>
                <li>• Strong unit economics with LTV:CAC of 10:1</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Milestones & Roadmap
          </h2>

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        milestone.status === "current"
                          ? "bg-green-500 animate-pulse"
                          : milestone.status === "upcoming"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {milestone.phase}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      milestone.status === "current"
                        ? "bg-green-100 text-green-800"
                        : milestone.status === "upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {milestone.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {milestone.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Why Invest in Advancia?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Massive Market Opportunity
              </h3>
              <p className="text-blue-100">
                $4.3T healthcare market meets $2T+ cryptocurrency market at the
                perfect intersection
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Proven Technology
              </h3>
              <p className="text-blue-100">
                Fully functional platform with multi-blockchain support and
                healthcare management
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Unique Positioning
              </h3>
              <p className="text-blue-100">
                No direct competitors offering integrated crypto payments and
                healthcare management
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Defensible Moat
              </h3>
              <p className="text-blue-100">
                Complex technical integration creates high barriers to entry for
                competitors
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Experienced Leadership
              </h3>
              <p className="text-blue-100">
                Founder has successfully built complete platform infrastructure
                demonstrating execution capability
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Clear Path to Profitability
              </h3>
              <p className="text-blue-100">
                Revenue model validated with profitability achieved within 36
                months
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Ready to Transform Healthcare Payments?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join us in revolutionizing healthcare payments through
            cryptocurrency innovation
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="mailto:advancia@devuser"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </Link>
            <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="w-5 h-5" />
              Download Full Business Plan
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Investment Terms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Seeking</h4>
                <p className="text-gray-700">$1.5M Seed Round</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Structure</h4>
                <p className="text-gray-700">
                  Convertible note or priced equity
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Runway</h4>
                <p className="text-gray-700">18-24 months to profitability</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Expected Milestones
                </h4>
                <p className="text-gray-700">
                  300+ providers, $400K+ monthly volume
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2026 Advancia Pay Ledger. This business plan is confidential and
            proprietary.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Last Updated: January 2026 | Version 1.0
          </p>
        </div>
      </footer>
    </div>
  );
}

// Metadata removed - use layout.jsx for metadata
