// ============================================================================
// PENDING APPROVAL PAGE
// Shown after registration, before admin approves
// ============================================================================

'use client';

import Link from 'next/link';
import { Clock, Mail, CheckCircle } from 'lucide-react';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Registration Received!
          </h1>
          <p className="text-xl text-gray-600">
            Your account is pending approval
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-yellow-800">
                    Awaiting Admin Review
                  </h3>
                  <p className="mt-2 text-sm text-yellow-700">
                    Our team will review your registration within 24-48 hours. 
                    If we don't respond within 24 hours, your account will be automatically approved.
                  </p>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What Happens Next?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Admin Review</h3>
                    <p className="text-gray-600 text-sm">
                      Our team will carefully review your registration details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="text-blue-600 font-semibold">2</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Approval Email</h3>
                    <p className="text-gray-600 text-sm">
                      You'll receive an email notification when your account is approved.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="text-blue-600 font-semibold">3</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Start Using Advancia</h3>
                    <p className="text-gray-600 text-sm">
                      Once approved, login and access your digital wallet, virtual cards, and medical services.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Reminder */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">
                    Check your email inbox
                  </p>
                  <p className="text-sm text-blue-700">
                    Make sure to check your spam/junk folder for emails from Advancia.
                  </p>
                </div>
              </div>
            </div>

            {/* What You'll Get */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What You'll Get Once Approved
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Multi-Chain Wallet</h3>
                  <p className="text-sm text-gray-600">
                    Support for 6 blockchain networks
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Virtual Card</h3>
                  <p className="text-sm text-gray-600">
                    Instant virtual payment card
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Medical Services</h3>
                  <p className="text-sm text-gray-600">
                    Book beds and appointments
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-orange-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Secure Payments</h3>
                  <p className="text-sm text-gray-600">
                    Crypto and fiat transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Return to Homepage
          </Link>
          <p className="text-gray-600 text-sm">
            Questions? Contact us at{' '}
            <a href="mailto:support@advancia.com" className="text-blue-600 hover:text-blue-700">
              support@advancia.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
