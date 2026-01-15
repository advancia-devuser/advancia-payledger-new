"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Loader2, CheckCircle, XCircle } from "lucide-react";

interface NOWPaymentsWidgetProps {
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

export default function NOWPaymentsWidget({
  amount,
  currency = "USD",
  payCurrency = "USDT",
  orderId,
  description = "Crypto payment",
  onSuccess,
  onError,
  onClose,
  isOpen,
}: NOWPaymentsWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && !paymentData) {
      createPayment();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen]);

  const createPayment = async () => {
    setLoading(true);
    setStatus("processing");

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
        const error = await response.json();
        throw new Error(error.error || "Failed to create payment");
      }

      const data = await response.json();
      setPaymentData(data);
      setLoading(false);

      // Start monitoring payment status
      startStatusMonitoring(data.paymentId, token);
    } catch (error: any) {
      setLoading(false);
      setStatus("error");
      setErrorMessage(error.message || "Payment failed");
      onError?.(error.message);
    }
  };

  const startStatusMonitoring = (paymentId: string, token: string) => {
    intervalRef.current = setInterval(async () => {
      try {
        const statusResponse = await fetch(`/api/crypto/payment/${paymentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();

          if (statusData.isFinal) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }

            if (statusData.status === "completed") {
              setStatus("success");
              onSuccess?.(paymentId);
            } else {
              setStatus("error");
              setErrorMessage(`Payment ${statusData.status}`);
              onError?.(`Payment ${statusData.status}`);
            }
          }
        }
      } catch (error) {
        console.error("Status check error:", error);
      }
    }, 5000);

    // Stop checking after 30 minutes
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 30 * 60 * 1000);
  };

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setPaymentData(null);
    setStatus("idle");
    setErrorMessage("");
    onClose?.();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crypto Payment
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Creating payment...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your payment has been confirmed and credited to your wallet.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center py-12">
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{errorMessage}</p>
            </div>
          )}

          {paymentData && status === "processing" && (
            <div className="space-y-6">
              {/* Amount */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Amount to Pay
                  </p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {paymentData.payAmount} {paymentData.payCurrency}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    ≈ {amount} {currency}
                  </p>
                </div>
              </div>

              {/* Payment Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Payment Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={paymentData.payAddress}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(paymentData.payAddress)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    QR Code
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> Send exactly{" "}
                  <strong>
                    {paymentData.payAmount} {paymentData.payCurrency}
                  </strong>{" "}
                  to the address above. Payment will be confirmed automatically.
                </p>
              </div>

              {/* Open in NOWPayments */}
              <a
                href={paymentData.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg text-center hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Open in NOWPayments
              </a>

              {/* Status */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Waiting for payment confirmation...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
