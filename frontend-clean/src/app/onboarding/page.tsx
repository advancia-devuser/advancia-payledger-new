"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Wallet,
  CreditCard,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "Welcome to Advancia Pay Ledger",
      description: "Let's get you started with your account",
      icon: <Sparkles className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome! 🎉
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              You're about to experience the future of digital payments and
              healthcare services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <Wallet className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Multi-Chain Wallet
              </h3>
              <p className="text-sm text-gray-600">
                Support for 6+ blockchains including Ethereum, Polygon, and BSC
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Virtual Cards
              </h3>
              <p className="text-sm text-gray-600">
                Instant virtual payment cards for online purchases
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Bank-Grade Security
              </h3>
              <p className="text-sm text-gray-600">
                Your funds are protected with enterprise-level encryption
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: "Complete Your Profile",
      description: "Add your personal information",
      icon: <User className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="py-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Your Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Upload Photo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Street address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    placeholder="12345"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Set Up Your Wallet",
      description: "Create your multi-chain wallet",
      icon: <Wallet className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="py-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Set Up Your Wallet
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                What is a wallet?
              </h3>
              <p className="text-sm text-gray-600">
                Your wallet is where you'll store and manage your digital
                assets across multiple blockchains. We'll create secure
                addresses for you automatically.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Ethereum</p>
                    <p className="text-sm text-gray-500">ETH Network</p>
                  </div>
                </div>
                <span className="text-green-600 text-sm font-medium">
                  Ready
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Polygon</p>
                    <p className="text-sm text-gray-500">MATIC Network</p>
                  </div>
                </div>
                <span className="text-green-600 text-sm font-medium">
                  Ready
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Binance Smart Chain
                    </p>
                    <p className="text-sm text-gray-500">BSC Network</p>
                  </div>
                </div>
                <span className="text-green-600 text-sm font-medium">
                  Ready
                </span>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Important:</strong> Your wallet will be created
                automatically when you complete onboarding. Keep your recovery
                phrase safe!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Security Setup",
      description: "Protect your account",
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="py-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Security Setup
            </h2>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Two-Factor Authentication (2FA)
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Biometric Login
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Use fingerprint or face recognition for quick access
                    </p>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      Set Up Later
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Transaction PIN
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Set a PIN for confirming transactions
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Create PIN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      localStorage.setItem("onboardingCompleted", "true");
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("onboardingCompleted", "true");
    router.push("/dashboard");
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-gray-900">
                Advancia Pay
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Step Icon and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {steps[currentStep].icon}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>

          {/* Step Content */}
          <div className="mb-8">{steps[currentStep].content}</div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === steps.length - 1 ? "Complete" : "Continue"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
