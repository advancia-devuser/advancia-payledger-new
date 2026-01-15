'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';

interface Card {
  id: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  status: 'frozen' | 'active';
  balance: number;
  userId: string;
  createdAt: string;
}

export default function AdminCardsPage() {
  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      cardNumber: '4242424242422078',
      cardholderName: 'John Doe',
      expiryDate: '12/28',
      status: 'frozen',
      balance: 0.74,
      userId: 'user_1',
      createdAt: '2026-01-04T10:00:00Z'
    },
    {
      id: '2',
      cardNumber: '4242424242423456',
      cardholderName: 'Jane Smith',
      expiryDate: '11/27',
      status: 'active',
      balance: 150.00,
      userId: 'user_2',
      createdAt: '2026-01-03T15:30:00Z'
    },
    {
      id: '3',
      cardNumber: '4242424242427890',
      cardholderName: 'Mike Johnson',
      expiryDate: '10/29',
      status: 'frozen',
      balance: 0.00,
      userId: 'user_3',
      createdAt: '2026-01-04T09:15:00Z'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'active' | 'frozen'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = cards.filter(card => {
    const matchesFilter = filter === 'all' || card.status === filter;
    const matchesSearch = card.cardholderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.cardNumber.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleActivateCard = async (cardId: string) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, status: 'active' as const } : card
    ));
    alert('Card activated successfully!');
  };

  const handleFreezeCard = async (cardId: string) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, status: 'frozen' as const } : card
    ));
    alert('Card frozen successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-2xl font-bold text-white">
                Advancia Pay Admin
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/admin/cards" className="text-white font-semibold">
                  Cards
                </Link>
                <Link href="/admin/users" className="text-gray-400 hover:text-white transition">
                  Users
                </Link>
                <Link href="/admin/transactions" className="text-gray-400 hover:text-white transition">
                  Transactions
                </Link>
              </div>
            </div>
            <NotificationBell />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Card Management</h1>
          <p className="text-gray-400">View and manage all user cards</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or card number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  filter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All ({cards.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  filter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Active ({cards.filter(c => c.status === 'active').length})
              </button>
              <button
                onClick={() => setFilter('frozen')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  filter === 'frozen'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Frozen ({cards.filter(c => c.status === 'frozen').length})
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-gray-900 font-bold text-lg">ADVANCIA PAY</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-gray-600 text-sm">{card.cardNumber.slice(-4)} Ultima 3D-S</span>
                  </div>
                </div>
                <div className="text-2xl">🔥</div>
              </div>

              {/* Balance */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">${card.balance.toFixed(2)}</div>
                <div className="text-gray-500 text-sm mt-1">
                  {card.status === 'frozen' ? 'Card frozen' : 'Active card'}
                </div>
              </div>

              {/* Card Info */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cardholder:</span>
                    <span className="text-gray-900 font-semibold">{card.cardholderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Number:</span>
                    <span className="text-gray-900 font-mono">•••• {card.cardNumber.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires:</span>
                    <span className="text-gray-900">{card.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={card.status === 'frozen' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                      {card.status === 'frozen' ? '🔒 Frozen' : '✓ Active'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">{new Date(card.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex gap-2">
                {card.status === 'frozen' ? (
                  <button
                    onClick={() => handleActivateCard(card.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    ✓ Activate
                  </button>
                ) : (
                  <button
                    onClick={() => handleFreezeCard(card.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    🔒 Freeze
                  </button>
                )}
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No cards found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Total Cards</div>
            <div className="text-3xl font-bold text-white">{cards.length}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Active Cards</div>
            <div className="text-3xl font-bold text-green-400">{cards.filter(c => c.status === 'active').length}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Frozen Cards</div>
            <div className="text-3xl font-bold text-red-400">{cards.filter(c => c.status === 'frozen').length}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Total Balance</div>
            <div className="text-3xl font-bold text-white">
              ${cards.reduce((sum, card) => sum + card.balance, 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
