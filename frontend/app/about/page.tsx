import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">About Advancia Pay Ledger</h1>
        <p className="text-gray-300 mb-8">
          Advancia Pay Ledger combines modern payment workflows with security-first account features,
          built to support global users and crypto-friendly operations.
        </p>

        <Link href="/" className="text-purple-300 hover:text-purple-200">
          Back to Home
        </Link>
      </div>
    </main>
  )
}
