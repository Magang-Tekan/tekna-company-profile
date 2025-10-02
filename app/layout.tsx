import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/components/session-provider'
import { AnalyticsTracker } from '@/components/analytics-tracker'
import { OrganizationStructuredData, WebsiteStructuredData, ProfessionalServiceStructuredData } from '@/components/structured-data'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'PT. Sapujagat Nirmana Tekna (Tekna.id) - Software House Indonesia Terdepan | IoT, Mobile & Web Development',
    template: '%s | PT. Sapujagat Nirmana Tekna - Tekna.id'
  },
  description: 'PT. Sapujagat Nirmana Tekna (Tekna.id) adalah software house Indonesia terkemuka berlokasi di Semarang dengan pengalaman 5+ tahun. Spesialisasi IoT development, mobile app iOS/Android, dan web development modern. Solusi teknologi terpercaya untuk transformasi digital bisnis Anda.',
  keywords: [
    // Primary keywords
    'PT. Sapujagat Nirmana Tekna',
    'PT Sapujagat Nirmana Tekna',
    'tekna.id',
    'Tekna software house',
    'software house Indonesia',
    'software house Semarang',
    'jasa pembuatan aplikasi',
    'developer aplikasi Indonesia',
    'software house Jawa Tengah',
    
    // Service specific
    'IoT development Indonesia',
    'Internet of Things developer',
    'mobile app development',
    'aplikasi mobile iOS Android',
    'web development Semarang',
    'website development Indonesia',
    'aplikasi web modern',
    
    // Company specific
    'PT. Sapujagat Nirmana Tekna Semarang',
    'Tekna developer',
    'Tekna Indonesia',
    'Sapujagat Nirmana Tekna',
    'Klipang Raya Semarang',
    
    // Industry terms
    'transformasi digital',
    'teknologi IoT',
    'solusi teknologi bisnis',
    'custom software development',
    'enterprise application',
    'startup technology partner',
    
    // Career keywords
    'tekna career',
    'lowongan kerja tekna',
    'karir tekna',
    'lowongan kerja software house',
    'lowongan kerja semarang',
    'lowongan kerja IT semarang',
    'lowongan kerja developer',
    'lowongan kerja IoT',
    'lowongan kerja mobile app',
    'lowongan kerja web development',
    'PT Sapujagat Nirmana Tekna career',
    'tekna.id career',
    'software house career indonesia',
    'tech jobs semarang',
    'developer jobs indonesia',
    'remote work indonesia',
    'startup jobs semarang'
  ],
  authors: [{ name: 'PT Sapujagat Nirmana Tekna', url: 'https://tekna.id' }],
  creator: 'PT Sapujagat Nirmana Tekna',
  publisher: 'PT Sapujagat Nirmana Tekna',
  category: 'Technology',
  classification: 'Business',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tekna.id'),
  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://tekna.id',
    title: 'PT. Sapujagat Nirmana Tekna (Tekna.id) - Software House Indonesia Terdepan | IoT, Mobile & Web Development',
    description: 'PT. Sapujagat Nirmana Tekna (Tekna.id) - Software house Indonesia terkemuka berlokasi di Semarang dengan pengalaman 5+ tahun. Spesialisasi IoT, mobile app, dan web development. Partner terpercaya untuk transformasi digital bisnis Anda.',
    siteName: 'PT. Sapujagat Nirmana Tekna - Tekna.id',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PT Sapujagat Nirmana Tekna - Software House Indonesia Terdepan',
        type: 'image/jpeg',
      },
      {
        url: '/images/og-image-square.jpg',
        width: 600,
        height: 600,
        alt: 'Tekna - Software House Indonesia',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@teknasapujagat',
    creator: '@teknasapujagat',
    title: 'PT. Sapujagat Nirmana Tekna - Software House Indonesia',
    description: 'Software house Indonesia terkemuka berlokasi di Semarang untuk IoT, mobile app, dan web development. Partner teknologi terpercaya untuk bisnis modern.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'dUP293sjOn3I-CYGejwzikIUXE1qB27-TYSaIE1wClY',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'theme-color': '#000000',
    'color-scheme': 'dark light',
  },
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://tekna.id" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Geographic meta tags */}
        <meta name="geo.region" content="ID-SMG" />
        <meta name="geo.placename" content="Semarang, Jawa Tengah, Indonesia" />
        <meta name="geo.position" content="-6.9932;110.4203" />
        <meta name="ICBM" content="-6.9932, 110.4203" />
        
        {/* Additional SEO meta tags */}
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="3 days" />
        <meta name="language" content="Indonesian" />
        <meta name="country" content="Indonesia" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="coverage" content="Worldwide" />
        
        {/* Business specific */}
        <meta name="business-type" content="Software Development" />
        <meta name="industry" content="Technology" />
        <meta name="page-topic" content="Software House Indonesia" />
        
        {/* Mobile optimization */}
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        
        {/* Favicon and app icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/logo.webp" type="image/webp" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/logo.webp" as="image" type="image/webp" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <SessionProvider>
            <AnalyticsTracker>
              {children}
              <OrganizationStructuredData siteUrl="https://tekna.id" />
              <WebsiteStructuredData siteUrl="https://tekna.id" />
              <ProfessionalServiceStructuredData siteUrl="https://tekna.id" />
              <Toaster />
            </AnalyticsTracker>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
