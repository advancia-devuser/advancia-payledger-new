"use client";

import Link from "next/link";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How quickly can I start using Advancia Pay?",
    answer:
      "Your account review typically completes within 1-2 business days. Once approved, you'll receive a welcome email and gain immediate access to all platform features including payments, Wellness Chambers, and your personalized dashboard.",
  },
  {
    question: "What payment options do I have?",
    answer:
      "We offer maximum flexibility with traditional payments via Stripe (credit/debit cards) and cryptocurrency payments supporting 235+ digital currencies including Bitcoin, Ethereum, USDT, and more through NOWPayments. Choose what works best for you!",
  },
  {
    question: "How do you protect my information?",
    answer:
      "Your security is our priority. We use bank-level encryption, multi-factor authentication, and industry-leading security practices. Your data is protected with the same standards used by major financial institutions worldwide.",
  },
  {
    question: "What if I forget my password?",
    answer:
      'Simply click "Forgot Password" on the login page. You\'ll receive a secure reset link via email within minutes. The link is valid for 1 hour to ensure your account stays protected.',
  },
  {
    question: "How does the trust score system benefit me?",
    answer:
      "Your trust score grows as you use the platform, unlocking enhanced features, higher transaction limits, and priority support. It's our way of rewarding active, engaged members of the Advancia Pay community.",
  },
  {
    question: "Can I refer friends and colleagues?",
    answer:
      "Absolutely! Based on your account status and trust score, you can invite others to join Advancia Pay. Check your dashboard to see your invitation privileges and share the benefits with your network.",
  },
  {
    question: "How do I stay updated on my account activity?",
    answer:
      "Stay connected with instant browser notifications via Socket.IO, plus email and push notifications for important updates. You're always in control and informed about your account activities.",
  },
  {
    question: "What account types are available?",
    answer:
      "We offer flexible account tiers to match your needs: from standard User accounts to specialized roles like Doctor and Moderator, each with tailored features and capabilities designed for your success.",
  },
  {
    question: "How easy is it to use cryptocurrency?",
    answer:
      "Very easy! We support 235+ cryptocurrencies including Bitcoin, Ethereum, USDT, Dogecoin, Shiba Inu, and Solana. Our platform handles all the technical complexity, so you can transact with confidence using your preferred digital currency.",
  },
  {
    question: "How can I reach your support team?",
    answer:
      "Our dedicated support team is here to help! Email support@advancia.com for general questions or backend@advancia.com for technical assistance. We respond within 24 hours and are committed to your success.",
  },
  {
    question: "What are your transaction fees?",
    answer:
      "We believe in transparent pricing. Fees vary by payment method: Stripe handles fiat transactions with standard processing rates, while crypto transactions include only blockchain network fees. Contact us anytime for a detailed breakdown tailored to your usage.",
  },
  {
    question: "How do withdrawals work?",
    answer:
      "Withdrawals are simple and secure! Choose your preferred method (bank transfer, crypto, or PayPal), enter the amount, and submit. Most withdrawals process within 24-48 hours. Your funds, your control, your timeline.",
  },
  {
    question: "What makes Advancia Pay different?",
    answer:
      "We combine cutting-edge technology with user-first design. From smart features and Wellness Chamber bookings to multi-currency support and real-time notifications, we're building the future of digital payments today.",
  },
  {
    question: "Is my investment protected?",
    answer:
      "Your funds are secured through enterprise-grade infrastructure, including Railway PostgreSQL databases, encrypted transactions, and compliance with financial regulations. We never store your private keys, giving you complete control over your crypto assets.",
  },
  {
    question: "Can I try before committing?",
    answer:
      "Yes! Create your account to explore the platform. Experience our features firsthand, and see why thousands trust Advancia Pay for their payment and wellness needs. No hidden commitments, just powerful tools at your fingertips.",
  },
  {
    question: "What happens after I sign up?",
    answer:
      "After registration, our team reviews your application (1-2 business days). Once approved, you'll receive a welcome email with next steps. Then dive in - make payments, book Wellness Chamber sessions, and explore all features designed for your success!",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
            >
              Advancia Pay
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-purple-600 transition"
              >
                Home
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-purple-600 transition"
              >
                Terms
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about Advancia Pay
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-purple-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-purple-50 transition"
              >
                <span className="font-semibold text-gray-900">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-purple-600 transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-purple-50 border-t border-purple-100">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-purple-100 mb-6">
            Our support team is here to help you
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="mailto:support@advancia.com"
              className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              Contact Support
            </a>
            <Link
              href="/login"
              className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-semibold border border-purple-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Advancia Pay. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-purple-600 text-sm"
            >
              Home
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 hover:text-purple-600 text-sm"
            >
              Terms
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-purple-600 text-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
