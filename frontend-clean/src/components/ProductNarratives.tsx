"use client";

import React, { useState } from "react";
import { BookOpen, TrendingUp, Building2, Users, Sparkles } from "lucide-react";

const ProductNarratives = () => {
  const [activeNarrative, setActiveNarrative] = useState("investor");

  const narratives = {
    investor: {
      icon: TrendingUp,
      title: "Investor Narrative",
      tagline: "Bridging Two Trillion-Dollar Markets",
      sections: [
        {
          heading: "The Problem",
          content:
            "Healthcare payments are broken. Patients face mounting medical debt, facilities struggle with payment processing costs and delays, and 1.7 billion people globally remain unbanked—locked out of traditional healthcare financing. Meanwhile, cryptocurrency adoption is accelerating, but lacks real-world utility in essential services.",
        },
        {
          heading: "The Solution",
          content:
            "Advancia Pay Ledger is the first comprehensive platform unifying cryptocurrency payments with healthcare facility management. We enable instant, borderless payments across six major blockchain networks while providing hospitals and clinics with complete operational tools—bed tracking, appointment scheduling, and multi-role management systems—all in one integrated platform.",
        },
        {
          heading: "The Market Opportunity",
          content:
            "We're positioned at the intersection of two massive markets: the $4.3 trillion global healthcare industry and the $2 trillion cryptocurrency market. With healthcare costs rising 40% faster than wages and crypto wallet adoption surpassing 560 million users, the demand for innovative payment solutions has never been greater.",
        },
        {
          heading: "Our Competitive Advantage",
          content:
            "Unlike pure payment processors or standalone healthcare software, Advancia Pay Ledger is the only platform integrating multi-blockchain crypto payments with comprehensive facility management. We support Ethereum, Polygon, BSC, Arbitrum, Optimism, and Stellar—plus traditional Stripe processing—giving users true payment flexibility. Our 80+ database models and 25+ AI agents powered by Claude create an enterprise-ready solution from day one.",
        },
        {
          heading: "Traction & Vision",
          content:
            "We're production-ready with full deployment infrastructure on Railway and Vercel. Our vision: become the global standard for healthcare payments, starting with underserved markets where crypto provides the only viable payment option, then scaling to transform how all healthcare facilities handle transactions worldwide.",
        },
        {
          heading: "The Ask",
          content:
            "We're raising $1.5M to accelerate market entry, expand blockchain support, and scale our AI-powered features. Join us in democratizing healthcare access through financial innovation.",
        },
      ],
    },
    facility: {
      icon: Building2,
      title: "Healthcare Facility Narrative",
      tagline: "Modern Payments. Streamlined Operations. One Platform.",
      sections: [
        {
          heading: "Accept Payments Your Patients Actually Want to Use",
          content:
            "Your patients are asking for crypto payment options—and for good reason. With Advancia Pay Ledger, you can accept payments via Ethereum, Polygon, Binance Smart Chain, Arbitrum, Optimism, and Stellar, alongside traditional credit cards through Stripe. No more turning away international patients or losing revenue to 3-5% processing fees.",
        },
        {
          heading: "Cut Processing Costs by Up to 80%",
          content:
            "Traditional payment processors charge 2-5% per transaction. Blockchain transactions cost fractions of a cent. For a facility processing $1M annually in payments, that's up to $50,000 saved—money that can go directly to patient care, equipment upgrades, or staff development.",
        },
        {
          heading: "Get Paid Instantly, Not in 3-5 Days",
          content:
            "Stop waiting for payment settlement. Cryptocurrency transactions are verified and accessible within minutes, not days. Improve your cash flow, reduce accounting complexity, and have funds available when you need them.",
        },
        {
          heading: "Everything You Need to Run Your Facility",
          content:
            "Advancia Pay Ledger isn't just a payment processor—it's complete facility management software. Track bed availability in real-time, manage appointment scheduling, coordinate your staff with role-based permissions (admin, medical staff, facility admin), and handle all operations from a single dashboard.",
        },
        {
          heading: "Bank the Unbanked, Expand Your Reach",
          content:
            "1.7 billion people worldwide don't have traditional bank accounts, but many have cryptocurrency. Open your doors to international patients, medical tourists, and underserved populations who can now access your services without traditional banking infrastructure.",
        },
        {
          heading: "Enterprise Security, Startup Simplicity",
          content:
            "Built with 80+ database models for maximum flexibility, secured with enterprise-grade encryption, and powered by 25+ AI agents to automate routine tasks. You get Fortune 500-level technology with user-friendly implementation and ongoing support.",
        },
      ],
    },
    patient: {
      icon: Users,
      title: "Patient Narrative",
      tagline: "Your Health. Your Money. Your Choice.",
      sections: [
        {
          heading: "Pay for Healthcare Your Way",
          content:
            "Why should you be forced to use only credit cards or bank transfers for medical care? With Advancia Pay Ledger, you choose how to pay—whether that's Ethereum, Polygon, Bitcoin-compatible networks, or traditional payment methods. Your money, your choice.",
        },
        {
          heading: "No Bank Account? No Problem.",
          content:
            "Over 1.7 billion people worldwide don't have access to traditional banking, but that shouldn't mean you can't access quality healthcare. If you have cryptocurrency, you can pay for medical services instantly, from anywhere in the world.",
        },
        {
          heading: "Transparent Pricing, No Hidden Fees",
          content:
            "See exactly what you're paying before you pay it. Blockchain transactions are transparent and verifiable—no surprise processing fees, no hidden charges, no confusion. What you see is what you pay.",
        },
        {
          heading: "Instant Transactions, Faster Care",
          content:
            "No more waiting 3-5 business days for payments to clear. Your cryptocurrency payments are verified within minutes, which means facilities can confirm payment and start your care faster. Emergency? Your payment goes through immediately.",
        },
        {
          heading: "Access Healthcare Anywhere",
          content:
            "Traveling abroad? Need to pay a specialist in another country? Traditional payment methods make international healthcare payments expensive and complicated. With Advancia Pay Ledger, paying for medical care across borders is as simple as sending crypto—no currency conversion headaches, no international banking fees.",
        },
        {
          heading: "Your Medical Records, Your Control",
          content:
            "Book appointments, track your payments, and manage your healthcare journey all in one place. Our platform gives you complete visibility and control over your medical financial history, secured with the same technology protecting billions in cryptocurrency.",
        },
      ],
    },
    vision: {
      icon: Sparkles,
      title: "Vision & Mission Narrative",
      tagline: "Democratizing Healthcare Through Financial Innovation",
      sections: [
        {
          heading: "Our Mission",
          content:
            "We believe healthcare should be accessible to everyone, regardless of where they live or what financial system they use. Advancia Pay Ledger exists to break down the barriers between people who need care and facilities that provide it, using the most innovative payment technology available.",
        },
        {
          heading: "The Problem We're Solving",
          content:
            "Healthcare and finance are two of the most critical systems in modern life, yet they remain among the least accessible. 1.7 billion people lack traditional banking. Medical debt is the leading cause of bankruptcy in developed nations. International patients face impossible barriers to paying for care. This isn't just inefficient—it's unjust.",
        },
        {
          heading: "Why Cryptocurrency + Healthcare?",
          content:
            "Cryptocurrency isn't just about speculation or investment—it's about access. It's borderless, instant, and available to anyone with an internet connection. By integrating cryptocurrency payments into healthcare facility operations, we're not just processing transactions—we're creating pathways to care that never existed before.",
        },
        {
          heading: "Our Core Values",
          content:
            "Innovation: We leverage cutting-edge blockchain technology and AI to solve real-world problems. Accessibility: We design for the unbanked, the underserved, and the overlooked. Transparency: Every transaction is visible, verifiable, and fair. Integration: We don't just add crypto payments—we build complete solutions that healthcare facilities actually need.",
        },
        {
          heading: "The Future We're Building",
          content:
            "Imagine a world where a patient in rural India can instantly pay for telemedicine consultation with a specialist in Singapore. Where a medical facility in Argentina doesn't lose 30% of international patient revenue to currency conversion fees. Where processing payments costs pennies instead of percentages, freeing up millions for actual patient care. That's the future Advancia Pay Ledger is building.",
        },
        {
          heading: "Why Now?",
          content:
            "The convergence is here. Cryptocurrency adoption has reached critical mass—560 million wallets worldwide. Healthcare costs are outpacing wages by 40%. Traditional payment infrastructure is creaking under its own weight. The technology is mature. The need is urgent. The moment is now.",
        },
        {
          heading: "Join the Movement",
          content:
            "Advancia Pay Ledger isn't just software—it's a movement toward financial inclusion in healthcare. Whether you're a facility ready to accept crypto payments, a patient tired of payment barriers, or an investor who believes access to healthcare is a fundamental right, we invite you to be part of this transformation. Together, we're making healthcare accessible to everyone, everywhere.",
        },
      ],
    },
  };

  const ActiveIcon = narratives[activeNarrative].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Advancia Pay Ledger
            </h1>
          </div>
          <p className="text-xl text-gray-600">Product Narratives</p>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(narratives).map(([key, narrative]) => {
            const Icon = narrative.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveNarrative(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeNarrative === key
                    ? "border-blue-600 bg-blue-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
              >
                <Icon
                  className={`w-6 h-6 mx-auto mb-2 ${
                    activeNarrative === key ? "text-blue-600" : "text-gray-600"
                  }`}
                />
                <div
                  className={`text-sm font-semibold ${
                    activeNarrative === key ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {narrative.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Narrative */}
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
            <ActiveIcon className="w-12 h-12 text-blue-600 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {narratives[activeNarrative].title}
              </h2>
              <p className="text-lg text-blue-600 font-medium">
                {narratives[activeNarrative].tagline}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {narratives[activeNarrative].sections.map((section, idx) => (
              <div key={idx} className="group">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  {section.heading}
                </h3>
                <p className="text-gray-700 leading-relaxed pl-10">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Usage Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • <strong>Investor Narrative:</strong> Use in pitch decks,
              executive summaries, and investor meetings
            </li>
            <li>
              • <strong>Facility Narrative:</strong> Perfect for sales
              presentations, partnership proposals, and B2B marketing
            </li>
            <li>
              • <strong>Patient Narrative:</strong> Website copy, patient
              brochures, social media content
            </li>
            <li>
              • <strong>Vision Narrative:</strong> About page, press releases,
              mission statements, team alignment
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductNarratives;
