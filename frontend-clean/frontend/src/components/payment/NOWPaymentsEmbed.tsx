"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface NOWPaymentsEmbedProps {
  amount: number;
  currency?: string;
  payCurrency?: string;
  orderId?: string;
  description?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export default function NOWPaymentsEmbed({
  amount,
  currency = "USD",
  payCurrency = "USDT",
  orderId,
  description = "Crypto payment",
  onSuccess,
  onError,
  onClose,
  isOpen,
}: NOWPaymentsEmbedProps) {
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !paymentId) {
      createPayment();
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentId) {
      // Start monitoring payment status
      const intervalId = setInterval(async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const response = await fetch(`/api/crypto/payment/${paymentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();

            if (data.isFinal) {
              clearInterval(intervalId);

              if (data.status === "completed") {
                onSuccess?.(paymentId);
              } else {
                onError?.(`Payment ${data.status}`);
              }
            }
          }
        } catch (err) {
          console.error("Status check error:", err);
        }
      }, 5000);

      // Cleanup after 30 minutes
      setTimeout(() => clearInterval(intervalId), 30 * 60 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [paymentId]);

  const createPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to make a payment");
      }

      const response = await fetch("/api/crypto/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          currency,
          payCurrency,
          orderId: orderId || `order_${Date.now()}`,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment");
      }

      const data = await response.json();
      setPaymentId(data.paymentId);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Payment creation failed");
      onError?.(err.message);
    }
  };

  const handleClose = () => {
    setPaymentId(null);
    setError(null);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Crypto Payment
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="relative">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Creating payment...
              </p>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
              <button
                onClick={createPayment}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}

          {paymentId && !loading && !error && (
            <div className="bg-white dark:bg-gray-800">
              <iframe
                src={`https://nowpayments.io/embeds/payment-widget?iid=${paymentId}`}
                width="100%"
                height="696"
                frameBorder="0"
                scrolling="no"
                style={{ overflow: "hidden", display: "block" }}
                title="NOWPayments Widget"
                className="w-full"
              >
                Can't load widget
              </iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
