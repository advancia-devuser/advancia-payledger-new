"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
            >
              Advancia Pay
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-purple-600 transition"
              >
                Home
              </Link>
              <Link
                href="/faq"
                className="text-gray-600 hover:text-purple-600 transition"
              >
                FAQ
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-purple-600 transition"
              >
                Terms
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md border border-purple-100 p-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-gray-600 mb-8">Last updated: January 3, 2026</p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Advancia Pay ("we," "our," or "us") is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                payment ledger platform and services.
              </p>
              <p className="text-gray-700 mb-4">
                By using Advancia Pay, you agree to the collection and use of
                information in accordance with this policy. If you do not agree
                with our policies and practices, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                2.1 Personal Information
              </h3>
              <p className="text-gray-700 mb-4">
                We collect information that you provide directly to us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Account Information:</strong> Name, email address,
                  username, password
                </li>
                <li>
                  <strong>Profile Information:</strong> Optional profile
                  details, preferences
                </li>
                <li>
                  <strong>Payment Information:</strong> Payment method details
                  (processed securely by Stripe and NOWPayments)
                </li>
                <li>
                  <strong>Identity Verification:</strong> Information required
                  for account approval
                </li>
                <li>
                  <strong>Communication Data:</strong> Messages sent through our
                  support system
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                2.2 Automatically Collected Information
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Usage Data:</strong> Pages visited, features used,
                  time spent
                </li>
                <li>
                  <strong>Device Information:</strong> IP address, browser type,
                  operating system
                </li>
                <li>
                  <strong>Transaction Data:</strong> Payment history,
                  transaction details
                </li>
                <li>
                  <strong>Activity Logs:</strong> Login attempts, security
                  events, user actions
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                2.3 Cryptocurrency Information
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Wallet addresses (for transaction purposes)</li>
                <li>Cryptocurrency transaction history</li>
                <li>Blockchain transaction IDs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the collected information for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Service Provision:</strong> Process payments, manage
                  accounts, provide Wellness Chamber services
                </li>
                <li>
                  <strong>Account Management:</strong> Create and maintain your
                  account, process approvals
                </li>
                <li>
                  <strong>Security:</strong> Detect fraud, prevent unauthorized
                  access, ensure platform security
                </li>
                <li>
                  <strong>Communication:</strong> Send transactional emails,
                  notifications, support responses
                </li>
                <li>
                  <strong>Improvement:</strong> Analyze usage patterns, improve
                  features, enhance user experience
                </li>
                <li>
                  <strong>Compliance:</strong> Meet legal obligations, enforce
                  terms of service
                </li>
                <li>
                  <strong>Customer Support:</strong> Respond to inquiries,
                  resolve issues
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Information Sharing and Disclosure
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                4.1 Third-Party Service Providers
              </h3>
              <p className="text-gray-700 mb-4">
                We share information with trusted third parties who assist in
                operating our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Payment Processors:</strong> Stripe (fiat payments),
                  NOWPayments (cryptocurrency)
                </li>
                <li>
                  <strong>Database Hosting:</strong> Railway (PostgreSQL
                  hosting)
                </li>
                <li>
                  <strong>Email Services:</strong> Email delivery providers for
                  transactional emails
                </li>
                <li>
                  <strong>Analytics:</strong> Usage analytics and monitoring
                  services
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                4.2 Legal Requirements
              </h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law or in
                response to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Legal processes (subpoenas, court orders)</li>
                <li>Government or regulatory requests</li>
                <li>Protection of our rights and safety</li>
                <li>Prevention of fraud or illegal activities</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                4.3 Business Transfers
              </h3>
              <p className="text-gray-700 mb-4">
                In the event of a merger, acquisition, or sale of assets, your
                information may be transferred to the acquiring entity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement comprehensive security measures to protect your
                information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Encryption:</strong> Data encrypted in transit
                  (HTTPS/TLS) and at rest
                </li>
                <li>
                  <strong>Authentication:</strong> JWT tokens, password hashing
                  (bcrypt), optional 2FA
                </li>
                <li>
                  <strong>Access Control:</strong> Role-based permissions, least
                  privilege principle
                </li>
                <li>
                  <strong>Monitoring:</strong> Activity logging, security event
                  tracking, anomaly detection
                </li>
                <li>
                  <strong>Infrastructure:</strong> Secure hosting, regular
                  security updates
                </li>
                <li>
                  <strong>Payment Security:</strong> PCI-DSS compliance via
                  Stripe, secure crypto handling
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                While we strive to protect your information, no method of
                transmission over the internet is 100% secure. We cannot
                guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Your Privacy Rights
              </h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal
                information:
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                6.1 Access and Portability
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Request a copy of your personal data</li>
                <li>Export your data in a portable format</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                6.2 Correction and Update
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Update your account information</li>
                <li>Correct inaccurate data</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                6.3 Deletion
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Request deletion of your account and data</li>
                <li>Subject to legal retention requirements</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                6.4 Opt-Out
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Unsubscribe from marketing emails</li>
                <li>Disable non-essential notifications</li>
              </ul>

              <p className="text-gray-700 mb-4">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:privacy@advancia.com"
                  className="text-purple-600 hover:text-purple-700"
                >
                  privacy@advancia.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-700 mb-4">
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Provide our services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
              <p className="text-gray-700 mb-4">
                <strong>Typical Retention Periods:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Active accounts: Duration of account + 90 days</li>
                <li>Transaction records: 7 years (regulatory requirement)</li>
                <li>Activity logs: 2 years</li>
                <li>Marketing data: Until opt-out + 30 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Cookies and Tracking
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Maintain your session and authentication</li>
                <li>Remember your preferences</li>
                <li>Analyze usage patterns</li>
                <li>Improve platform performance</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookies through your browser settings. Disabling
                cookies may limit platform functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                Advancia Pay is not intended for users under 18 years of age. We
                do not knowingly collect personal information from children. If
                you believe we have collected information from a child, please
                contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. International Data Transfers
              </h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in
                countries other than your country of residence. We ensure
                appropriate safeguards are in place to protect your data in
                accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Posting the updated policy on our website</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending email notification for significant changes</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Your continued use of our services after changes constitutes
                acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions or concerns about this Privacy Policy or
                our data practices, please contact us:
              </p>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:privacy@advancia.com"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    privacy@advancia.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Support:</strong>{" "}
                  <a
                    href="mailto:support@advancia.com"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    support@advancia.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Response Time:</strong> Within 48 hours
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. GDPR Compliance (EU Users)
              </h2>
              <p className="text-gray-700 mb-4">
                If you are located in the European Economic Area (EEA), you have
                additional rights under GDPR:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Legal Basis:</strong> We process data based on
                  consent, contract performance, legal obligations, and
                  legitimate interests
                </li>
                <li>
                  <strong>Data Protection Officer:</strong> Contact at
                  dpo@advancia.com
                </li>
                <li>
                  <strong>Right to Lodge Complaint:</strong> You may file a
                  complaint with your local data protection authority
                </li>
                <li>
                  <strong>Cross-Border Transfers:</strong> We use standard
                  contractual clauses approved by the European Commission
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                14. California Privacy Rights (CCPA)
              </h2>
              <p className="text-gray-700 mb-4">
                California residents have specific rights under the California
                Consumer Privacy Act:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Right to know what personal information is collected</li>
                <li>
                  Right to know if personal information is sold or disclosed
                </li>
                <li>
                  Right to opt-out of the sale of personal information (we do
                  not sell data)
                </li>
                <li>Right to deletion of personal information</li>
                <li>
                  Right to non-discrimination for exercising privacy rights
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-purple-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2026 Advancia Pay. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-purple-600 text-sm"
            >
              Home
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 hover:text-purple-600 text-sm"
            >
              Terms
            </Link>
            <Link
              href="/faq"
              className="text-gray-600 hover:text-purple-600 text-sm"
            >
              FAQ
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-purple-600 text-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
