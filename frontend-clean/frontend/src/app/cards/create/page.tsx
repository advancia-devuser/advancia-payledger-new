'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CardType {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: string;
  googleAdsOptimized: boolean;
  supports3DS: boolean;
  icon: string;
}

const cardTypes: CardType[] = [
  {
    id: 'google-ads',
    name: 'Google Ads Card',
    description: 'Virtual payment card designed specifically for Google Ads. No more payment bans or problems.',
    features: [
      'Optimized for Google Ads payments',
      'Low decline rate (0.5%)',
      'High success rate (99.5%)',
      'Automatic billing threshold management',
      'Real-time transaction monitoring',
      '12 premium BINs available'
    ],
    price: 'Free',
    googleAdsOptimized: true,
    supports3DS: true,
    icon: '🎯'
  },
  {
    id: 'ultima',
    name: 'Ultima Premium',
    description: 'The most advanced virtual card for all kinds of payments. High status with 3D-Secure support.',
    features: [
      'Premium card status (Gold/Platinum)',
      '3D-Secure technology',
      'Accepted everywhere',
      'Higher spending limits',
      'Priority support',
      'Perfect for all online purchases'
    ],
    price: '$9.99/mo',
    googleAdsOptimized: false,
    supports3DS: true,
    icon: '💎'
  },
  {
    id: 'standard',
    name: 'Standard Card',
    description: 'Basic virtual card for everyday online shopping and subscriptions.',
    features: [
      'Instant issuance',
      'Standard spending limits',
      'Basic support',
      'Good for general use',
      'No monthly fees'
    ],
    price: 'Free',
    googleAdsOptimized: false,
    supports3DS: false,
    icon: '💳'
  }
];

export default function CreateCardPage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cardLimit, setCardLimit] = useState(2);
  const [cardsCreated, setCardsCreated] = useState(0);
  const [creating, setCreating] = useState(false);

  const handleCreateCard = async (cardTypeId: string) => {
    if (cardsCreated >= cardLimit) {
      alert(`You've reached your limit of ${cardLimit} cards. Upgrade to create more.`);
      return;
    }

    setCreating(true);
    setSelectedCard(cardTypeId);

    try {
      // Simulate card creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCardsCreated(prev => prev + 1);
      alert('Card created successfully! Check your dashboard.');
    } catch (error) {
      alert('Failed to create card. Please try again.');
    } finally {
      setCreating(false);
      setSelectedCard(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/landing" className="text-2xl font-bold text-white">
            Advancia Pay
          </Link>
          <div className="flex items-center space-x-8">
            <Link href="/landing" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link href="/bin-checker" className="text-gray-300 hover:text-white transition">BIN Checker</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Create Your Virtual Card
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Choose the perfect card for your needs
            </p>
            
            {/* Card Limit Indicator */}
            <div className="inline-block bg-white/10 backdrop-blur-lg rounded-lg px-6 py-3">
              <span className="text-white font-semibold">
                Cards Created: {cardsCreated} / {cardLimit}
              </span>
              {cardsCreated >= cardLimit && (
                <span className="ml-4 text-yellow-400">
                  (Limit reached - Upgrade for more)
                </span>
              )}
            </div>
          </div>

          {/* Card Types Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {cardTypes.map((card) => (
              <div
                key={card.id}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 transition transform hover:scale-105 ${
                  card.id === 'google-ads' ? 'border-green-500' : 'border-transparent hover:border-purple-600'
                }`}
              >
                {/* Card Icon */}
                <div className="text-6xl mb-4">{card.icon}</div>

                {/* Badge for Google Ads */}
                {card.googleAdsOptimized && (
                  <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    GOOGLE ADS OPTIMIZED
                  </div>
                )}

                {/* Card Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{card.name}</h3>
                
                {/* Price */}
                <div className="text-3xl font-bold text-purple-400 mb-4">{card.price}</div>

                {/* Description */}
                <p className="text-gray-300 mb-6">{card.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {card.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-300 text-sm">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* 3DS Badge */}
                {card.supports3DS && (
                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    3D-Secure Enabled
                  </div>
                )}

                {/* Create Button */}
                <button
                  onClick={() => handleCreateCard(card.id)}
                  disabled={creating || cardsCreated >= cardLimit}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
                    creating && selectedCard === card.id
                      ? 'bg-gray-600 text-white cursor-wait'
                      : cardsCreated >= cardLimit
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {creating && selectedCard === card.id ? 'Creating...' : 'Create Card'}
                </button>
              </div>
            ))}
          </div>

          {/* Google Ads Specific Info */}
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30">
            <h2 className="text-3xl font-bold text-white mb-6">
              🎯 Google Ads Card - Special Features
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">12 Premium BINs Available</h3>
                <p className="text-gray-300 mb-4">
                  Our Google Ads cards use 12 carefully selected BINs optimized for advertising platforms:
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Payment network: Visa, Mastercard</li>
                  <li>• Issuing banks: Citi, Wells Fargo, TD, and more</li>
                  <li>• Country: United States</li>
                  <li>• Card types: Credit (Premium tier)</li>
                  <li>• Categories: Gold, Platinum</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Success Rate</div>
                    <div className="text-2xl font-bold text-green-400">99.5%</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Decline Rate</div>
                    <div className="text-2xl font-bold text-green-400">0.5%</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Avg. Spend per Card</div>
                    <div className="text-2xl font-bold text-white">$2,500</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Billing Threshold</div>
                    <div className="text-2xl font-bold text-white">$500</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white/10 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                <strong className="text-white">Note:</strong> Our system monitors decline rates and success rates in real-time. 
                If a BIN shows degraded performance, we automatically rotate to a better-performing BIN to ensure your ads keep running smoothly.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">How Card Creation Works</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Select Card Type</h3>
                  <p className="text-gray-300">Choose the card that matches your use case (Google Ads, Premium, or Standard).</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Instant Generation</h3>
                  <p className="text-gray-300">Your card is generated instantly with a unique card number, CVV, and expiry date.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Fund & Use</h3>
                  <p className="text-gray-300">Add funds to your card and start using it immediately for online payments.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Notice */}
          {cardsCreated >= cardLimit && (
            <div className="mt-8 bg-yellow-500/20 border border-yellow-500 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Need More Cards?
              </h3>
              <p className="text-gray-300 mb-6">
                Upgrade to Pro or Business plan to create unlimited virtual cards
              </p>
              <Link href="/landing#pricing" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition">
                View Pricing Plans
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
