'use client';

import { useState } from 'react';

interface UserCardProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  status: 'frozen' | 'active';
  balance: number;
}

export default function UserCard({ 
  cardNumber, 
  cardholderName, 
  expiryDate, 
  cvv, 
  status,
  balance 
}: UserCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [orderRequested, setOrderRequested] = useState(false);

  const handleOrderCard = async () => {
    try {
      await fetch('/api/notifications/order-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardholderName,
          cardNumber: cardNumber.slice(-4),
          timestamp: new Date().toISOString()
        })
      });

      setOrderRequested(true);
      alert('Card order request sent! Admin will be notified immediately.');
    } catch (error) {
      alert('Failed to send order request. Please try again.');
    }
  };

  const formatCardNumber = (number: string) => {
    if (showDetails) {
      return number.match(/.{1,4}/g)?.join(' ') || number;
    }
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Card - PST Style */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-gray-900 font-bold text-lg">ADVANCIA PAY</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-gray-600 text-sm">{cardNumber.slice(-4)} Ultima 3D-S</span>
            </div>
          </div>
          <div className="text-3xl">🔥</div>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <div className="text-4xl font-bold text-gray-900">${balance.toFixed(2)}</div>
          <div className="text-gray-500 text-sm mt-1">
            {status === 'frozen' ? 'Card frozen - Order to activate' : 'Next card payment 26 Jan 2026'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          {status === 'frozen' ? (
            <button
              onClick={handleOrderCard}
              disabled={orderRequested}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                orderRequested
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {orderRequested ? '✓ Order Sent' : '+ Order Card'}
            </button>
          ) : (
            <>
              <button className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                + Top up
              </button>
              <button className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                ✉ Send
              </button>
            </>
          )}
        </div>

        {/* Card Details */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-semibold">Card details</span>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 text-sm hover:underline"
            >
              {showDetails ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showDetails ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Card Number:</span>
                <span className="text-gray-900 font-mono">{formatCardNumber(cardNumber)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cardholder:</span>
                <span className="text-gray-900">{cardholderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="text-gray-900">{expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CVV:</span>
                <span className="text-gray-900">{cvv}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={status === 'frozen' ? 'text-red-600' : 'text-green-600'}>
                  {status === 'frozen' ? '🔒 Frozen' : '✓ Active'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-900 font-mono">•••• •••• •••• {cardNumber.slice(-4)}</div>
          )}
        </div>

        {/* Status Messages */}
        {status === 'frozen' && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-lg">ℹ️</span>
              <div className="text-sm">
                <div className="font-semibold text-yellow-900">Auto refill disabled</div>
                <div className="text-yellow-700 mt-1">
                  Card is frozen. Click "Order Card" to activate your card.
                </div>
              </div>
            </div>
          </div>
        )}

        {orderRequested && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <div className="text-sm">
                <div className="font-semibold text-green-900">Card Activation Requested</div>
                <div className="text-green-700 mt-1">
                  Your card activation request has been submitted successfully!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
