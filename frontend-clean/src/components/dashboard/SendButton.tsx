'use client';

import React, { useState } from 'react';
import { sendMoney } from '@/lib/api/dashboard';

interface SendButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  currency?: 'USD' | 'BTC' | 'ETH' | 'USDT';
}

export default function SendButton({
  onSuccess,
  onError,
  className = '',
  currency = 'USD',
}: SendButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currency: currency,
    amount: '',
    recipientEmail: '',
    recipientId: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.recipientEmail && !formData.recipientId) {
      newErrors.recipient = 'Recipient email or ID is required';
    }

    if (formData.recipientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipientEmail)) {
      newErrors.recipient = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await sendMoney({
        currency: formData.currency as 'USD' | 'BTC' | 'ETH' | 'USDT',
        amount: parseFloat(formData.amount),
        recipientEmail: formData.recipientEmail || undefined,
        recipientId: formData.recipientId || undefined,
        notes: formData.notes || undefined,
      });

      if (response.success) {
        setIsOpen(false);
        setFormData({
          currency: currency,
          amount: '',
          recipientEmail: '',
          recipientId: '',
          notes: '',
        });
        onSuccess?.();
      } else {
        setErrors({ submit: response.error || 'Failed to send money' });
        onError?.(response.error || 'Failed to send money');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setErrors({ submit: errorMessage });
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
      >
        Send
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Send Money</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="USD">USD</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientEmail: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.recipient ? 'border-red-500' : ''
                  }`}
                  placeholder="user@example.com"
                />
                {errors.recipient && (
                  <p className="text-red-500 text-sm mt-1">{errors.recipient}</p>
                )}
              </div>

              <div className="text-center text-gray-500">OR</div>

              <div>
                <label className="block text-sm font-medium mb-1">Recipient ID</label>
                <input
                  type="text"
                  value={formData.recipientId}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientId: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="User ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  step="0.00000001"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.amount ? 'border-red-500' : ''
                  }`}
                  placeholder="0.00"
                  required
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Add a message..."
                />
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errors.submit}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
