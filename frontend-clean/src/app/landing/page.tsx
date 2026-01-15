"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [email, setEmail] = useState("");

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Email submitted:", email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-bold text-white">
            Advancia Pay
          </div>
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition text-sm lg:text-base"
            >
              Features
            </a>
            <Link
              href="/bin-checker"
              className="text-gray-300 hover:text-white transition text-sm lg:text-base"
            >
              BIN Checker
            </Link>
            <Link
              href="/narratives"
              className="text-gray-300 hover:text-white transition text-sm lg:text-base"
            >
              About
            </Link>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-white transition text-sm lg:text-base"
            >
              Pricing
            </a>
            <Link
              href="/auth/login"
              className="text-gray-300 hover:text-white transition text-sm lg:text-base"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 lg:px-6 py-2 rounded-lg transition text-sm lg:text-base"
            >
              Get Started
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden text-white p-2">
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Want to get crypto-friendly virtual payment card?
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 px-4">
            Perfect for online shopping, advertising, and media buying
          </p>

          <form onSubmit={handleGetStarted} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </form>

          <p className="text-gray-400 text-sm">
            No credit check required • Instant approval • Free to create
          </p>
        </div>

        {/* Card Preview */}
        <div className="mt-16 max-w-md mx-auto">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition">
            <div className="flex justify-between items-start mb-12">
              <div className="text-white text-sm font-semibold">
                VIRTUAL CARD
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
            </div>
            <div className="text-white text-2xl font-mono mb-8 tracking-wider">
              •••• •••• •••• 4242
            </div>
            <div className="flex justify-between text-white">
              <div>
                <div className="text-xs opacity-70">CARDHOLDER</div>
                <div className="font-semibold">YOUR NAME</div>
              </div>
              <div>
                <div className="text-xs opacity-70">EXPIRES</div>
                <div className="font-semibold">12/28</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Why Choose Advancia Pay?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500 hover:border-purple-400 transition">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
              PREMIUM CARD
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Advancia PayLedger Card
            </h3>
            <p className="text-gray-300">
              Premium virtual payment card for all your online payments. Instant
              issuance with your name, 12 premium BINs and 99.5% success rate.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Instant Issuance
            </h3>
            <p className="text-gray-300">
              Get your virtual card in just 5 minutes. No waiting, no paperwork,
              no hassle.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Crypto-Friendly
            </h3>
            <p className="text-gray-300">
              Fund your card with cryptocurrency. Seamlessly convert crypto to
              fiat for everyday spending.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Online Shopping
            </h3>
            <p className="text-gray-300">
              Shop anywhere online. Accepted at millions of merchants worldwide.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Media Buying</h3>
            <p className="text-gray-300">
              Perfect for advertising campaigns on Facebook, TikTok and all
              major platforms.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              BIN Verification
            </h3>
            <p className="text-gray-300">
              Free BIN checker tool to verify card information. Check issuing
              bank, country, card type and more.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Get Started in 3 Simple Steps
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
              1
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Sign Up</h3>
              <p className="text-gray-300">
                Create your account in under 2 minutes. Just email and password
                required.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
              2
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Fund Your Account
              </h3>
              <p className="text-gray-300">
                Add funds using cryptocurrency or traditional payment methods.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
              3
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Create Your Card
              </h3>
              <p className="text-gray-300">
                Generate your virtual card instantly and start spending online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Simple, Transparent Pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-transparent hover:border-purple-600 transition">
            <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
            <div className="text-4xl font-bold text-white mb-6">Free</div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                1 Virtual Card
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                $500 monthly limit
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Basic support
              </li>
            </ul>
            <Link
              href="/auth/register"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition"
            >
              Get Started
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-600 transform scale-105 shadow-2xl">
            <div className="bg-purple-600 text-white text-sm font-bold px-4 py-1 rounded-full inline-block mb-4">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
            <div className="text-4xl font-bold text-white mb-6">
              $9.99<span className="text-lg text-gray-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                5 Virtual Cards
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                $5,000 monthly limit
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Priority support
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Lower fees
              </li>
            </ul>
            <Link
              href="/auth/register"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition"
            >
              Get Started
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-transparent hover:border-purple-600 transition">
            <h3 className="text-2xl font-bold text-white mb-4">Business</h3>
            <div className="text-4xl font-bold text-white mb-6">
              $29.99<span className="text-lg text-gray-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Unlimited Cards
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                $50,000 monthly limit
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                24/7 support
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Lowest fees
              </li>
            </ul>
            <Link
              href="/auth/register"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Your Virtual Card?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Advancia Pay for their online
            payments
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold mb-4">Advancia Pay</h4>
            <p className="text-gray-400 text-sm">
              Crypto-friendly virtual payment cards for the modern world.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Security
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  href="/narratives"
                  className="hover:text-white transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm pt-8 border-t border-white/10">
          © 2026 Advancia Pay. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
