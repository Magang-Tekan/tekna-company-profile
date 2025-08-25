import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/components/session-provider";
import { OrganizationStructuredData } from "@/components/structured-data";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Tekna Solutions - Digital Innovation & Technology Solutions",
    template: "%s | Tekna Solutions"
  },
  description: "Leading technology solutions provider in Indonesia. We specialize in web development, mobile apps, AI solutions, and digital transformation services.",
  keywords: ["technology", "web development", "mobile apps", "AI", "digital solutions", "Indonesia", "software development", "consulting"],
  authors: [{ name: "Tekna Solutions" }],
  creator: "Tekna Solutions",
  publisher: "Tekna Solutions",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    title: "Tekna Solutions - Digital Innovation & Technology Solutions",
    description: "Leading technology solutions provider in Indonesia. We specialize in web development, mobile apps, AI solutions, and digital transformation services.",
    siteName: "Tekna Solutions",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tekna Solutions - Digital Innovation & Technology Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tekna Solutions - Digital Innovation & Technology Solutions",
    description: "Leading technology solutions provider in Indonesia. We specialize in web development, mobile apps, AI solutions, and digital transformation services.",
    images: ["/images/og-image.jpg"],
    creator: "@teknasolutions",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <OrganizationStructuredData siteUrl={defaultUrl} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
