"use client";

import Link from "next/link";

export default function AboutPage() {
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
              <Link href="/" className="text-gray-600 hover:text-purple-600 transition">
                Home
              </Link>
              <Link href="/about" className="text-purple-600 font-semibold">
                About
              </Link>
              <Link href="/security" className="text-gray-600 hover:text-purple-600 transition">
                Security
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-purple-600 transition">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-purple-600 transition">
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
              About Advancia Pay Ledger
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Revolutionizing Healthcare Payments Through Blockchain Technology
          </p>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6 text-lg">
              Advancia Pay Ledger is the world's first comprehensive cryptocurrency payment platform specifically designed for the healthcare industry. We bridge the $4.3 trillion healthcare market with the $2 trillion cryptocurrency ecosystem, providing secure, compliant, and efficient payment solutions for medical facilities worldwide.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                <strong>To democratize healthcare payments by combining the transparency of blockchain technology with the security requirements of modern medical facilities.</strong>
              </p>
              <p className="text-gray-700">
                We believe that healthcare providers should have access to the same cutting-edge payment technologies as other industries, while maintaining the highest standards of patient privacy and regulatory compliance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">The Beginning</h3>
              <p className="text-gray-700 mb-4">
                Founded in 2024, Advancia Pay Ledger emerged from a simple observation: healthcare facilities were being left behind in the cryptocurrency revolution. While retail, finance, and hospitality embraced blockchain payments, medical providers struggled with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>High credit card processing fees (2-4%)</li>
                <li>Slow international payments (3-5 business days)</li>
                <li>Complex insurance reimbursements</li>
                <li>Limited payment flexibility</li>
                <li>Lack of cryptocurrency expertise</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">The Solution</h3>
              <p className="text-gray-700 mb-4">We built a platform that:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Reduces Payment Costs:</strong> 0.5% crypto transaction fees vs. 2-4% traditional</li>
                <li><strong>Speeds Up Transactions:</strong> Instant blockchain settlements vs. days</li>
                <li><strong>Enhances Security:</strong> Military-grade encryption and cold storage</li>
                <li><strong>Maintains Compliance:</strong> HIPAA-aware infrastructure</li>
                <li><strong>Simplifies Operations:</strong> Integrated facility management tools</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Today</h3>
              <p className="text-gray-700 mb-4">
                We serve healthcare facilities across multiple continents, processing millions in payments monthly while maintaining:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>99.9%</strong> Platform uptime</li>
                <li><strong>&lt;1 second</strong> Average transaction confirmation</li>
                <li><strong>Zero</strong> Security breaches since inception</li>
                <li><strong>85+</strong> Net Promoter Score (NPS)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Sets Us Apart</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Healthcare-First Design</h3>
              <p className="text-gray-700 mb-4">
                Unlike generic payment processors adapted for healthcare, we built our platform from the ground up with medical facilities in mind:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>No PHI Storage:</strong> We never handle Protected Health Information</li>
                <li><strong>HIPAA-Aware Architecture:</strong> Designed with healthcare compliance in mind</li>
                <li><strong>Medical Terminology:</strong> Native support for healthcare workflows</li>
                <li><strong>Facility Management:</strong> Built-in tools for beds, appointments, and staff</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Multi-Blockchain Support</h3>
              <p className="text-gray-700 mb-4">We support six major blockchain networks:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Ethereum</strong> - Industry standard, extensive DeFi integration</li>
                <li><strong>Polygon</strong> - Low-cost alternative with Ethereum compatibility</li>
                <li><strong>Binance Smart Chain</strong> - High throughput, low fees</li>
                <li><strong>Arbitrum</strong> - Layer-2 scaling for Ethereum</li>
                <li><strong>Optimism</strong> - Another Layer-2 with fast finality</li>
                <li><strong>Stellar</strong> - Built for financial institutions</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Hybrid Payment Processing</h3>
              <p className="text-gray-700 mb-4">We don't force you to choose between crypto and traditional payments:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Cryptocurrency:</strong> ETH, BTC, USDC, USDT, and 50+ tokens</li>
                <li><strong>Credit/Debit Cards:</strong> Visa, Mastercard, Amex via Stripe</li>
                <li><strong>Bank Transfers:</strong> ACH, wire, SEPA</li>
                <li><strong>Digital Wallets:</strong> MetaMask, WalletConnect, Coinbase Wallet</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4. Enterprise-Grade Security</h3>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
                <p className="text-gray-700 font-semibold mb-2">🔒 Military-Grade Encryption</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>AES-256 for data at rest</li>
                  <li>TLS 1.3 for data in transit</li>
                  <li>End-to-end encryption for sensitive communications</li>
                </ul>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
                <p className="text-gray-700 font-semibold mb-2">🔐 Advanced Authentication</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Mandatory two-factor authentication (2FA)</li>
                  <li>Biometric login support</li>
                  <li>Hardware security key compatibility</li>
                  <li>IP whitelisting for admin accounts</li>
                </ul>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
                <p className="text-gray-700 font-semibold mb-2">💰 Cryptocurrency Security</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>95% of funds in cold storage</li>
                  <li>Multi-signature wallets for enterprise accounts</li>
                  <li>Hardware Security Modules (HSMs) for key management</li>
                  <li>Real-time transaction monitoring</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Trust</h3>
                  <p className="text-gray-700">
                    We operate with complete transparency. Our code is audited, our security practices are published, and our team is accessible. Trust isn't given—it's earned through consistent action.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Innovation</h3>
                  <p className="text-gray-700">
                    Healthcare is slow to adopt new technology, often for good reason. We innovate responsibly, ensuring every new feature is thoroughly tested and compliant before release.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Privacy</h3>
                  <p className="text-gray-700">
                    We never compromise on privacy. We don't handle PHI, we encrypt everything, and we give users full control over their data. Privacy isn't a feature—it's a fundamental right.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Compliance</h3>
                  <p className="text-gray-700">
                    Regulatory compliance isn't a checkbox; it's an ongoing commitment. We work with legal experts to stay ahead of evolving regulations worldwide.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">5. Support</h3>
                  <p className="text-gray-700">
                    Our customers are our partners. We provide white-glove support because your success is our success.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
                <p className="text-gray-700 mb-2">
                  <strong>General Inquiries:</strong>{" "}
                  <a href="mailto:hello@advancia.com" className="text-purple-600 hover:text-purple-700">
                    hello@advancia.com
                  </a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Sales:</strong>{" "}
                  <a href="mailto:sales@advancia.com" className="text-purple-600 hover:text-purple-700">
                    sales@advancia.com
                  </a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Support:</strong>{" "}
                  <a href="mailto:support@advancia.com" className="text-purple-600 hover:text-purple-700">
                    support@advancia.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Support Hours:</strong> 24/7 for critical issues
                </p>
              </div>
            </section>

            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to revolutionize your healthcare facility's payment processing?</h3>
              <div className="flex justify-center gap-4">
                <Link
                  href="/login"
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  Get Started
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-semibold border-2 border-white"
                >
                  Schedule Demo
                </Link>
              </div>
            </div>
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
            <Link href="/" className="text-gray-600 hover:text-purple-600 text-sm">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-purple-600 text-sm">
              About
            </Link>
            <Link href="/security" className="text-gray-600 hover:text-purple-600 text-sm">
              Security
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-purple-600 text-sm">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-purple-600 text-sm">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
