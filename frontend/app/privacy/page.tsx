import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-300 mb-8">
          This page is a placeholder for your privacy policy content.
        </p>

        <Link href="/" className="text-purple-300 hover:text-purple-200">
          Back to Home
        </Link>
      </div>
    </main>
  )
}
