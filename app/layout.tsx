import type { Metadata, Viewport } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SoundProvider } from '@/components/providers/SoundProvider'
import { AppProvider } from '@/components/providers/AppProvider'
import { MascotBridge } from '@/components/mascot/MascotBridge'
import { SITE_URL } from '@/lib/constants'
import CustomCursor from '@/components/ui/CustomCursor'
import StarTrail from '@/components/ui/StarTrail'
import './globals.css'

const fredoka = Fredoka({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
})

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
  weight: ['400', '700', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'PoppyLand — Learn ABC & 123 for Kids',
    template: '%s | PoppyLand',
  },
  description:
    'PoppyLand is a free, fun alphabet and numbers learning app for kids age 2–6. Interactive letters, voice pronunciation, counting games, and more. No ads, no downloads.',
  keywords: [
    'kids alphabet app',
    'learn ABC for toddlers',
    'alphabet learning game',
    'numbers for kids',
    'free kids learning app',
    'phonics app',
    'toddler learning',
    'preschool alphabet',
    'letter recognition game',
    'ABC game for children',
  ],
  authors: [{ name: 'PoppyLand' }],
  creator: 'PoppyLand',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'PoppyLand',
    title: 'PoppyLand — Learn ABC & 123 for Kids 🌈',
    description:
      'Free interactive alphabet and numbers learning app for kids. Voice pronunciation, games, and confetti! No ads.',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'PoppyLand — Kids Alphabet Learning App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PoppyLand — Learn ABC & 123 for Kids',
    description:
      'Free alphabet & numbers learning app for toddlers. Voice, games, confetti!',
    images: [`${SITE_URL}/og-image.png`],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PoppyLand',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export const viewport: Viewport = {
  themeColor: '#FF6B6B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PoppyLand',
  url: SITE_URL,
  description: 'Free alphabet and numbers learning app for kids age 2–6',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  audience: {
    '@type': 'Audience',
    audienceType: 'Children',
    suggestedMinAge: 2,
    suggestedMaxAge: 6,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-nunito bg-bg min-h-[100dvh] antialiased">
        <CustomCursor />
        <StarTrail />
        <SoundProvider>
          <AppProvider>
            {children}
            <MascotBridge />
          </AppProvider>
        </SoundProvider>
        <Analytics />
      </body>
    </html>
  )
}
