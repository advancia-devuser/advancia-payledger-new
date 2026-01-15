"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  Zap,
  TrendingUp,
  CreditCard,
  Globe,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  BarChart3,
  Wallet,
  Users,
  Clock,
} from "lucide-react";
import Logo from "@/components/Logo";

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Multi-layer encryption with 2FA and biometric authentication",
    },
    {
      icon: Zap,
      title: "Instant Transactions",
      description: "Real-time processing with blockchain verification",
    },
    {
      icon: Globe,
      title: "Multi-Currency Support",
      description: "USD, EUR, BTC, ETH, USDT and 50+ cryptocurrencies",
    },
    {
      icon: CreditCard,
      title: "Virtual & Physical Cards",
      description: "Instant virtual cards with global acceptance",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time insights and detailed transaction reports",
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Role-based access control for organizations",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime SLA" },
    { value: "$2B+", label: "Processed Volume" },
    { value: "150+", label: "Countries Supported" },
    { value: "50K+", label: "Active Users" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Logo size="md" showText={true} variant="gradient" />
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                href="#security"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Security
              </Link>
              <Link
                href="#pricing"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Get Started
              </Link>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <Link
                href="#features"
                className="block text-gray-700 hover:text-blue-600 py-2"
              >
                Features
              </Link>
              <Link
                href="#security"
                className="block text-gray-700 hover:text-blue-600 py-2"
              >
                Security
              </Link>
              <Link
                href="#pricing"
                className="block text-gray-700 hover:text-blue-600 py-2"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="block text-gray-700 hover:text-blue-600 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-center"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Next-Generation
              </span>
              <br />
              <span className="text-gray-900">Financial Platform</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Secure digital payments, virtual cards, and crypto management in
              one powerful platform. Built for businesses and individuals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <Link
                href="#features"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all inline-flex items-center justify-center gap-2"
              >
                <BarChart3 size={20} />
                View Features
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage digital payments and finances
              efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section
        id="security"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Security First
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your funds and data protected with military-grade security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Lock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                End-to-End Encryption
              </h3>
              <p className="text-gray-600 mb-4">
                All data encrypted using AES-256 encryption standard. Your
                sensitive information is protected at rest and in transit.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>SSL/TLS 1.3 Protocol</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Zero-knowledge architecture</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Regular security audits</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Advanced Protection
              </h3>
              <p className="text-gray-600 mb-4">
                Multi-layer security with real-time fraud detection and
                prevention systems monitoring every transaction.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Two-factor authentication (2FA)</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Biometric verification</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>24/7 fraud monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses and individuals managing their finances
            with Advancia PayLedger
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Create Free Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo size="sm" showText={true} variant="light" />
              <p className="text-sm text-gray-400 mt-4">
                Enterprise financial platform for the modern world.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="hover:text-white transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#security" className="hover:text-white transition">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 Advancia PayLedger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
