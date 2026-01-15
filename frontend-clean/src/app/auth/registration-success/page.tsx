"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Mail, Clock, ArrowRight, RefreshCw } from "lucide-react";

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (!email) {
      router.push("/auth/register");
    }
  }, [email, router]);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    setResendMessage("");

    try {
      const response = await fetch(`${API}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage("Verification email sent successfully!");
      } else {
        setResendMessage(data.error || "Failed to resend email");
      }
    } catch (error) {
      setResendMessage("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Registration Successful! 🎉
          </h1>

          {/* Subtitle */}
          <p className="text-center text-gray-600 mb-8">
            Thank you for joining Advancia Pay Ledger
          </p>

          {/* Email Sent Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Check Your Email
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  We've sent a welcome email to:
                </p>
                <p className="text-sm font-medium text-blue-600 mb-3">
                  {email}
                </p>
                <p className="text-sm text-gray-600">
                  Please check your inbox (and spam folder) for important
                  information about your account.
                </p>
              </div>
            </div>
          </div>

          {/* Pending Approval Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Account Pending Approval
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Your account is currently under review by our admin team.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                    Review typically takes 24-48 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                    You'll receive an email once approved
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                    Auto-approval after 24 hours if no action taken
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              What happens next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">
                  1
                </div>
                <p className="text-sm text-gray-600 pt-0.5">
                  Our team reviews your registration
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">
                  2
                </div>
                <p className="text-sm text-gray-600 pt-0.5">
                  You receive an approval notification email
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">
                  3
                </div>
                <p className="text-sm text-gray-600 pt-0.5">
                  Login and access all platform features
                </p>
              </div>
            </div>
          </div>

          {/* Resend Email */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the email?
            </p>
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isResending ? "animate-spin" : ""}
              />
              {isResending ? "Sending..." : "Resend verification email"}
            </button>
            {resendMessage && (
              <p
                className={`text-sm mt-2 ${
                  resendMessage.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {resendMessage}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push("/auth/login")}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Go to Login
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help?{" "}
          <a
            href="mailto:support@advancia.com"
            className="text-blue-600 hover:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
