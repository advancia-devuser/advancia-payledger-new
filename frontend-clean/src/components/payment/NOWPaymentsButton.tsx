"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface NOWPaymentsButtonProps {
  amount: number;
  currency?: string;
  payCurrency?: string;
  orderId?: string;
  description?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function NOWPaymentsButton({
  amount,
  currency = "USD",
  payCurrency = "USDT",
  orderId,
  description = "Crypto payment",
  onSuccess,
  onError,
  className = "",
  children = "Pay with Crypto",
}: NOWPaymentsButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

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

      // Open payment page in new window
      const paymentWindow = window.open(
        data.paymentUrl,
        "nowpayments",
        "width=800,height=600,scrollbars=yes"
      );

      if (!paymentWindow) {
        throw new Error("Please allow popups to complete payment");
      }

      // Monitor payment status
      const checkInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(
            `/api/crypto/payment/${data.paymentId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (statusResponse.ok) {
            const statusData = await statusResponse.json();

            if (statusData.isFinal) {
              clearInterval(checkInterval);
              setLoading(false);

              if (statusData.status === "completed") {
                onSuccess?.(data.paymentId);
              } else {
                onError?.(`Payment ${statusData.status}`);
              }
            }
          }
        } catch (error) {
          console.error("Status check error:", error);
        }
      }, 5000); // Check every 5 seconds

      // Stop checking after 30 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        setLoading(false);
      }, 30 * 60 * 1000);
    } catch (error: any) {
      setLoading(false);
      onError?.(error.message || "Payment failed");
      console.error("Payment error:", error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`
        inline-flex items-center justify-center gap-2 px-6 py-3
        bg-gradient-to-r from-blue-600 to-purple-600
        text-white font-semibold rounded-lg
        hover:from-blue-700 hover:to-purple-700
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 shadow-lg hover:shadow-xl
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}
