"use client";

import Link from "next/link";

export default function SecurityPage() {
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
              <Link href="/about" className="text-gray-600 hover:text-purple-600 transition">
                About
              </Link>
              <Link href="/security" className="text-purple-600 font-semibold">
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
              Security
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            At Advancia Pay Ledger, security isn't a feature—it's the foundation of everything we build.
          </p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Security Promise</h2>
              <p className="text-gray-700 mb-4">
                We protect your data and funds with the same rigor as major financial institutions, because we understand the unique security requirements of handling both healthcare data and cryptocurrency assets.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Core Security Principles</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Zero-Knowledge Architecture</strong> - We never access your private keys</li>
                <li><strong>Defense in Depth</strong> - Multiple layers of security</li>
                <li><strong>Principle of Least Privilege</strong> - Minimal access rights</li>
                <li><strong>Continuous Monitoring</strong> - 24/7 threat detection</li>
                <li><strong>Transparency</strong> - Public security practices and audits</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Encryption Standards</h3>
              
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
                <p className="text-gray-700 font-semibold mb-2">🔒 Data at Rest</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>AES-256 Encryption:</strong> Industry-standard encryption for all stored data</li>
                  <li><strong>Encrypted Databases:</strong> PostgreSQL with transparent data encryption (TDE)</li>
                  <li><strong>Encrypted Backups:</strong> All backups encrypted before storage</li>
                  <li><strong>Key Rotation:</strong> Automatic encryption key rotation every 90 days</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
                <p className="text-gray-700 font-semibold mb-2">🔐 Data in Transit</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>TLS 1.3:</strong> Latest transport layer security protocol</li>
                  <li><strong>Perfect Forward Secrecy:</strong> Unique session keys for each connection</li>
                  <li><strong>Certificate Pinning:</strong> Prevents man-in-the-middle attacks</li>
                  <li><strong>HSTS Enabled:</strong> Forces HTTPS connections</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Access Controls</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Mandatory 2FA:</strong> All accounts require two-factor authentication</li>
                <li><strong>Biometric Support:</strong> Fingerprint and Face ID on mobile</li>
                <li><strong>Hardware Keys:</strong> FIDO2/WebAuthn security key support</li>
                <li><strong>Role-Based Access Control (RBAC):</strong> Granular permission system</li>
                <li><strong>Session Management:</strong> Automatic timeout after 30 minutes inactivity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cryptocurrency Security</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Wallet Architecture</h3>
              
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
                <p className="text-gray-700 font-semibold mb-2">💰 Cold Storage (95% of Funds)</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Offline hardware wallets</li>
                  <li>Air-gapped signing devices</li>
                  <li>Geographic distribution of storage</li>
                  <li>Multi-signature requirements</li>
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
                <p className="text-gray-700 font-semibold mb-2">⚡ Hot Wallets (5% for Operational Liquidity)</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Daily withdrawal limits</li>
                  <li>Real-time monitoring</li>
                  <li>Automatic transfer to cold storage above threshold</li>
                  <li>Segregated by blockchain network</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Multi-Signature Wallets</h3>
              <p className="text-gray-700 mb-4">
                <strong>Standard Configuration:</strong> 2-of-3 multisig
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>1 key held by client</li>
                <li>1 key held by Advancia</li>
                <li>1 key held by third-party custodian</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Transaction Security</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Pre-Transaction Validation:</strong> Address whitelist verification, amount limits, velocity checks</li>
                <li><strong>Real-time Monitoring:</strong> Anomaly detection, fraud detection, pattern analysis</li>
                <li><strong>Post-Transaction Verification:</strong> Blockchain confirmation monitoring, audit trail creation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Network Security</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Infrastructure Protection</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Web Application Firewall (WAF):</strong> Cloudflare Enterprise WAF with custom rule sets</li>
                <li><strong>DDoS Mitigation:</strong> Protection against distributed denial-of-service attacks</li>
                <li><strong>Intrusion Detection:</strong> 24/7 SIEM with real-time alerting</li>
                <li><strong>API Security:</strong> Rate limiting (1000 requests/minute per IP), API key rotation</li>
                <li><strong>Zero-Trust Architecture:</strong> VPC isolation, network segmentation, firewall rules</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Application Security</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Secure Development:</strong> Security-first development lifecycle, peer code reviews</li>
                <li><strong>Testing:</strong> Static code analysis (SAST), dynamic testing (DAST)</li>
                <li><strong>Regular Updates:</strong> Weekly security patches, zero-day response within 24 hours</li>
                <li><strong>Dependency Scanning:</strong> Automated vulnerability scanning of all dependencies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance & Auditing</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Security Audits</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Internal:</strong> Weekly vulnerability scans, monthly security reviews, quarterly compliance checks</li>
                <li><strong>External:</strong> Annual penetration testing by certified firms</li>
                <li><strong>Smart Contract Audits:</strong> For blockchain integrations</li>
                <li><strong>SOC 2 Type II:</strong> Compliance in progress</li>
                <li><strong>ISO 27001:</strong> Certification planned for 2026</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Bug Bounty Program</h3>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
                <p className="text-gray-700 mb-2">
                  Public bug bounty program with rewards up to <strong>$10,000</strong> for critical vulnerabilities
                </p>
                <p className="text-gray-700 font-semibold mb-2">Bounty Amounts:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Critical: $5,000 - $10,000</li>
                  <li>High: $2,000 - $5,000</li>
                  <li>Medium: $500 - $2,000</li>
                  <li>Low: $100 - $500</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Regulatory Compliance</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Financial:</strong> BSA, AML, KYC, OFAC screening, Travel Rule compliance</li>
                <li><strong>Data Protection:</strong> GDPR (EU), CCPA (California), state privacy laws</li>
                <li><strong>Healthcare:</strong> HIPAA-aware infrastructure, no PHI storage</li>
                <li><strong>Payment Card:</strong> PCI DSS Level 1 (via Stripe)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Security Best Practices</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 border-l-4 border-green-600 p-4">
                  <p className="text-gray-700 font-semibold mb-2">✅ DO:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                    <li>Enable two-factor authentication</li>
                    <li>Use a strong, unique password</li>
                    <li>Keep recovery phrases secure</li>
                    <li>Log out after each session</li>
                    <li>Monitor account activity regularly</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-600 p-4">
                  <p className="text-gray-700 font-semibold mb-2">❌ DON'T:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                    <li>Share your credentials</li>
                    <li>Use public Wi-Fi without VPN</li>
                    <li>Click suspicious links in emails</li>
                    <li>Store passwords in plain text</li>
                    <li>Reuse passwords across sites</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Phishing Protection</h3>
              <p className="text-gray-700 mb-4"><strong>Red Flags:</strong></p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Unsolicited requests for credentials</li>
                <li>Urgent or threatening language</li>
                <li>Suspicious sender addresses</li>
                <li>Requests to disable security features</li>
                <li>Too-good-to-be-true offers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Report a Vulnerability</h2>
              <p className="text-gray-700 mb-4">
                We appreciate security researchers who help make our platform safer.
              </p>
              
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-4">
                <p className="text-gray-700 font-semibold mb-2">How to Report:</p>
                <ol className="list-decimal pl-6 text-gray-700 space-y-1">
                  <li>Email <a href="mailto:security@advancia.com" className="text-purple-600 hover:text-purple-700">security@advancia.com</a> with details</li>
                  <li>Use PGP encryption (key on our website)</li>
                  <li>Include proof of concept (if safe)</li>
                  <li>Allow us 90 days to patch before public disclosure</li>
                </ol>
              </div>

              <p className="text-gray-700 mb-4"><strong>What to Expect:</strong></p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Acknowledgment within 24 hours</li>
                <li>Status updates every 72 hours</li>
                <li>Bounty payment if eligible</li>
                <li>Public recognition (if desired)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Contact</h2>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
                <p className="text-gray-700 mb-2">
                  <strong>Security Team:</strong>{" "}
                  <a href="mailto:security@advancia.com" className="text-purple-600 hover:text-purple-700">
                    security@advancia.com
                  </a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Response Time:</strong> 24 hours for critical issues
                </p>
                <p className="text-gray-700">
                  <strong>Status Page:</strong>{" "}
                  <a href="https://status.advancia.com" className="text-purple-600 hover:text-purple-700">
                    status.advancia.com
                  </a>
                </p>
              </div>
            </section>

            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Trust, But Verify</h3>
              <p className="mb-4">
                We encourage users to review our code, audit our smart contracts, read our security documentation, and ask questions.
              </p>
              <p className="font-semibold text-lg">Transparency is our policy.</p>
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
