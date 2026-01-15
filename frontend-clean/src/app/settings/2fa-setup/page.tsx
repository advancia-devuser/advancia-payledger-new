"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  QrCode,
  CheckCircle,
  Copy,
  Download,
  AlertCircle,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

interface SetupData {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  manualEntry: string;
}

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodesSaved, setBackupCodesSaved] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Check if 2FA is already enabled
    checkTwoFactorStatus();
  }, []);

  const checkTwoFactorStatus = async () => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      const response = await fetch("/api/auth/2fa/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.enabled) {
          router.push("/settings");
          return;
        }
      }
    } catch (error) {
      console.error("Error checking 2FA status:", error);
    }
  };

  const generateSetupData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to setup 2FA");
      }

      const data = await response.json();
      setSetupData(data);
      setCurrentStep(2);
    } catch (error) {
      setError("Failed to generate 2FA setup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!setupData || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      const response = await fetch("/api/auth/2fa/enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          secret: setupData.secret,
          code: verificationCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid verification code");
      }

      setCurrentStep(4);
    } catch (error: any) {
      setError(error.message || "Failed to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const downloadBackupCodes = () => {
    if (!setupData) return;

    const content = `Advancia Pay Ledger - 2FA Backup Codes\n\n${setupData.backupCodes.join(
      "\n"
    )}\n\nGenerated: ${new Date().toISOString()}\nKeep these codes safe!`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "2fa-backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStep1 = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Enable Two-Factor Authentication
        </h1>
        <p className="text-gray-600">
          Add an extra layer of security to your account with 2FA
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h3 className="font-semibold">Enhanced Security</h3>
            <p className="text-sm text-gray-600">
              Protect your account even if your password is compromised
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h3 className="font-semibold">Easy Recovery</h3>
            <p className="text-sm text-gray-600">
              Backup codes ensure you can always access your account
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h3 className="font-semibold">Industry Standard</h3>
            <p className="text-sm text-gray-600">
              Uses time-based one-time passwords (TOTP)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={generateSetupData}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Setting up..." : "Continue"}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan QR Code</h1>
        <p className="text-gray-600">
          Use your authenticator app to scan this QR code
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6 space-y-6">
        {setupData?.qrCode && (
          <div className="flex justify-center">
            <div
              className="w-48 h-48 bg-white p-2 rounded-lg"
              dangerouslySetInnerHTML={{ __html: setupData.qrCode }}
            />
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Can't scan? Use this secret key:
          </p>
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm break-all">
            {setupData?.manualEntry}
          </div>
          <button
            onClick={() => copyToClipboard(setupData?.manualEntry || "")}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mx-auto"
          >
            <Copy className="w-4 h-4" />
            {copiedSecret ? "Copied!" : "Copy Secret"}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">
              Recommended apps: Google Authenticator, Authy, or Microsoft
              Authenticator
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Verification Code
        </h1>
        <p className="text-gray-600">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            maxLength={6}
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/\D/g, ""))
            }
            className="w-full text-center text-2xl font-mono py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="000000"
          />
        </div>

        {setupData && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Save Backup Codes</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                Save these backup codes in a secure location. You can use them
                to access your account if you lose your device.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                {setupData.backupCodes.map((code, index) => (
                  <div key={index} className="bg-white p-2 rounded border">
                    {code}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setBackupCodesSaved(!backupCodesSaved)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-50"
              >
                {backupCodesSaved ? "✓ Saved" : "I've saved them"}
              </button>
              <button
                onClick={downloadBackupCodes}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-1"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={verifyAndEnable}
          disabled={
            isLoading || verificationCode.length !== 6 || !backupCodesSaved
          }
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Enabling..." : "Enable 2FA"}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-md mx-auto text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">2FA Enabled!</h1>
      <p className="text-gray-600 mb-8">
        Your account is now protected with two-factor authentication
      </p>

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div className="text-left">
            <h3 className="font-semibold">What's Changed</h3>
            <p className="text-sm text-gray-600">
              You'll now need to enter a verification code when logging in
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div className="text-left">
            <h3 className="font-semibold">Keep Backup Codes Safe</h3>
            <p className="text-sm text-gray-600">
              Store your backup codes in a secure, accessible location
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/settings")}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700"
      >
        Go to Settings
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-8 h-1 mx-2 ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span className="w-20 text-center">Start</span>
            <span className="w-20 text-center">Scan</span>
            <span className="w-20 text-center">Verify</span>
            <span className="w-20 text-center">Done</span>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  );
}
