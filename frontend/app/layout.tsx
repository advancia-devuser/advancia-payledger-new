import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from './hooks/useAuth'

export const metadata: Metadata = {
  title: 'Advancia Pay Ledger',
  description: 'Comprehensive cryptocurrency payment platform with healthcare management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
