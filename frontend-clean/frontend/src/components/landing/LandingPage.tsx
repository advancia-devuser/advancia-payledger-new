"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  Zap,
  Users,
  CreditCard,
  Activity,
  Globe,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Menu,
  X,
  Star,
  MessageCircle,
} from "lucide-react";
import Testimonials from "@/components/ui/Testimonials";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const features = [
    {
      icon: Users,
      title: "Role-Based Access",
      description: "6-level hierarchy with granular permissions",
    },
    {
      icon: Activity,
      title: "Activity Logging",
      description: "Complete audit trails for all actions",
    },
    {
      icon: Shield,
      title: "Security First",
      description: "JWT, 2FA, rate limiting, and more",
    },
    {
      icon: BarChart3,
      title: "Trust Scores",
      description: "User evaluation & engagement tracking",
    },
    {
      icon: Users,
      title: "Invitation System",
      description: "Controlled onboarding process",
    },
    {
      icon: MessageCircle,
      title: "Email Templates",
      description: "Postmark integration for notifications",
    },
    {
      icon: Globe,
      title: "Multi-Currency Support",
      description: "USD, BTC, ETH, USDT support",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live balance and transaction updates",
    },
    {
      icon: CreditCard,
      title: "Debit Card Management",
      description: "Virtual and physical card support",
    },
    {
      icon: Activity,
      title: "Medbed Bookings",
      description: "Healthcare integration system",
    },
    {
      icon: Star,
      title: "Rewards System",
      description: "Bonus programs and incentives",
    },
    {
      icon: MessageCircle,
      title: "Live Support Chat",
      description: "24/7 customer support",
    },
    {
      icon: Globe,
      title: "Mobile Responsive",
      description: "Optimized for all devices",
    },
    {
      icon: Zap,
      title: "Web3 Integration",
      description: "Ethereum wallet connectivity",
    },
    {
      icon: Settings,
      title: "Automated Workflows",
      description: "RPA automation capabilities",
    },
    {
      icon: BarChart3,
      title: "Admin Dashboard",
      description: "Comprehensive control panel",
    },
    {
      icon: Activity,
      title: "Advanced Analytics",
      description: "KPI tracking and insights",
    },
    {
      icon: AlertTriangle,
      title: "Fraud Detection",
      description: "Security monitoring system",
    },
  ];

  const securityFeatures = [
    { name: "JWT Authentication", icon: Lock },
    { name: "2FA Support", icon: Shield },
    { name: "Rate Limiting", icon: Activity },
    { name: "End-to-End Encryption", icon: Lock },
    { name: "Audit Logs", icon: BarChart3 },
    { name: "IP Filtering", icon: Globe },
    { name: "Input Validation", icon: CheckCircle2 },
    { name: "Security Monitoring", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Advancia Pay Ledger
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("security")}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Security
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Testimonials
              </button>
              <Link
                href="/faq"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-purple-600"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 animate-[slideDown_0.3s_ease-out]">
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left text-gray-700 hover:text-purple-600 py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("security")}
                className="block w-full text-left text-gray-700 hover:text-purple-600 py-2"
              >
                Security
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="block w-full text-left text-gray-700 hover:text-purple-600 py-2"
              >
                Testimonials
              </button>
              <Link
                href="/faq"
                className="block text-gray-700 hover:text-purple-600 py-2"
              >
                FAQ
              </Link>
              <Link
                href="/login"
                className="block text-gray-700 hover:text-purple-600 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-center"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Enterprise Fintech Platform
            </span>
            <br />
            <span className="text-gray-900">Built for Modern Businesses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Secure, scalable, and feature-rich financial management platform
            with real-time updates, multi-currency support, and advanced
            security features.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-medium">30-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-medium">24/7 Live Support</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-medium">SSL Encrypted</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/register"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <button
              onClick={() => scrollToSection("features")}
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all"
            >
              View Demo
            </button>
          </div>

          {/* Admin Approval Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> New registrations require admin approval.
              You&apos;ll receive an email once your account is activated.
            </p>
          </div>

          {/* Feature Cards Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {features.slice(0, 4).map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105"
              >
                <feature.icon className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your finances efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 transform hover:scale-105"
              >
                <feature.icon className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section
        id="security"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your data and transactions are protected with bank-level security
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100"
              >
                <feature.icon className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900">{feature.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by businesses worldwide
            </p>
          </div>
          <Testimonials autoRotate={true} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of businesses using Advancia Pay Ledger
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Advancia Pay Ledger
              </h3>
              <p className="text-sm">
                Enterprise fintech platform for modern businesses
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/support"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="hover:text-white transition-colors"
                  >
                    Technical Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support/chat"
                    className="hover:text-white transition-colors"
                  >
                    Live Chat
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Status */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal & Status</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    System Operational
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              © {new Date().getFullYear()} Advancia Pay Ledger. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Live Chat Widget */}
      <ChatbotWidget />
    </div>
  );
}
