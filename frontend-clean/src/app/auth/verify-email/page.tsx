"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Mail,
} from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`${API}/api/auth/verify-email/${token}`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
        setAlreadyVerified(data.alreadyVerified || false);
      } else {
        setStatus("error");
        setMessage(data.error || "Verification failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to verify email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Loading State */}
          {status === "loading" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Verifying Your Email
              </h1>
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {alreadyVerified
                  ? "Email Already Verified"
                  : "Email Verified Successfully! ✅"}
              </h1>
              <p className="text-gray-600 mb-8">{message}</p>

              {!alreadyVerified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Account Pending Approval
                      </p>
                      <p className="text-sm text-gray-600">
                        Your account is being reviewed by our admin team. You'll
                        receive an email once approved (typically within 24-48
                        hours).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => router.push("/auth/login")}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Go to Login
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Verification Failed
              </h1>
              <p className="text-gray-600 mb-8">{message}</p>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/auth/register")}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register Again
                </button>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
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
