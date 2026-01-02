import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kids Eat Free Canberra | Family Dining Deals',
  description: 'Discover restaurants in Canberra where kids eat free. Filter by day and location.',
  keywords: 'kids eat free Canberra, family dining Canberra, cheap family meals',
  openGraph: {
    title: 'Kids Eat Free Canberra',
    description: 'Find the best kids eat free deals in Canberra by day and location',
    type: 'website',
    locale: 'en_AU',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
