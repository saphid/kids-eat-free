import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kids Eat Free Canberra | Family Dining Deals',
  description: 'Discover restaurants in Canberra where kids eat free. Filter by day and location to find the perfect family-friendly dining spot.',
  keywords: 'kids eat free Canberra, family dining Canberra, cheap family meals, family restaurants ACT',
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#0D9488',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                // Default to dark mode if no preference is saved
                const initialTheme = theme || 'dark';
                if (initialTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
