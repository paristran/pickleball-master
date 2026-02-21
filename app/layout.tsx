import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pickleball Master - Learn & Play',
  description: 'Master pickleball rules, strategies, and play with friends in real-time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
