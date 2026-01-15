'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TradePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/terms"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Terms
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Trade-Making Policy
          </h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Purpose */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-purple-600" />
              1. Purpose
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This policy defines how trades are created, executed, and managed on
              the platform to ensure fairness, transparency, security, and regulatory
              compliance.
            </p>
          </section>

          {/* Scope */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Scope</h2>
            <p className="text-gray-700 mb-4">
              This policy applies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>All users placing trades</li>
              <li>All supported assets (fiat, crypto, tokens)</li>
              <li>All trade types (market, limit, instant purchase)</li>
            </ul>
          </section>

          {/* Trade Execution */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle2 className="w-6 h-6 mr-2 text-green-600" />
              3. Trade Execution
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>All trades are executed in real time using current market data.</li>
              <li>Prices are validated at the moment of execution.</li>
              <li>Cached prices are used only for pre-trade estimates and expire automatically.</li>
              <li>Final execution prices may differ from estimates due to market movement.</li>
            </ul>
          </section>

          {/* Order Validation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Order Validation</h2>
            <p className="text-gray-700 mb-4">
              Before execution, the system verifies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>User authentication and authorization</li>
              <li>Available balance and limits</li>
              <li>Compliance and risk checks</li>
              <li>Network and provider availability</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>Trades failing validation are rejected.</strong>
            </p>
          </section>

          {/* No Trade Manipulation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. No Trade Manipulation</h2>
            <p className="text-gray-700 mb-4">
              The platform:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Does not manipulate prices</li>
              <li>Does not front-run user trades</li>
              <li>Does not alter executed trade results</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Market prices are sourced from trusted providers or liquidity partners.
            </p>
          </section>

          {/* Trade Finality */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Trade Finality</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Once confirmed, a trade cannot be reversed.</li>
              <li>Blockchain transactions are subject to network confirmation.</li>
              <li>Failed or pending trades are handled according to network status.</li>
            </ul>
          </section>

          {/* Fees and Charges */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Fees and Charges</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Fees are disclosed before confirmation.</li>
              <li>Network and provider fees may vary.</li>
              <li>All fees are included in the final trade receipt.</li>
            </ul>
          </section>

          {/* Risk Disclosure */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-yellow-600" />
              8. Risk Disclosure
            </h2>
            <p className="text-gray-700 mb-4">
              Trading involves risk, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Price volatility</li>
              <li>Network congestion</li>
              <li>Delays or failures outside platform control</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>Users are responsible for understanding these risks before trading.</strong>
            </p>
          </section>

          {/* Security Controls */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Security Controls</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>CAPTCHA and rate limiting prevent automated abuse</li>
              <li>Monitoring detects abnormal trading behavior</li>
              <li>Logs are retained for audit and compliance</li>
            </ul>
          </section>

          {/* Suspension and Limits */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Suspension and Limits</h2>
            <p className="text-gray-700 mb-4">
              The platform may:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Impose trading limits</li>
              <li>Suspend accounts for suspicious activity</li>
              <li>Pause trading during maintenance or extreme market events</li>
            </ul>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Policy Updates</h2>
            <p className="text-gray-700">
              This policy may be updated to reflect regulatory, technical, or market changes.
              Continued use of the platform implies acceptance of updates.
            </p>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              For questions about this policy, please contact{' '}
              <Link href="/support" className="text-purple-600 hover:text-purple-700">
                support
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
