import type { Metadata } from "next";
import { Inter, DM_Mono, DM_Serif_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { NonBlockingStylesheet } from "@/components/layout/non-blocking-stylesheet";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brickwise.pro"),
  title: {
    default: "Brickwise — Tokenized Real Estate Investment Analytics",
    template: "%s | Brickwise",
  },
  description:
    "Brickwise scores tokenized real estate properties for yield, risk, and fair value across Lofty and RealT — so you know exactly what to buy, hold, or avoid.",
  applicationName: "Brickwise",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Brickwise — Tokenized Real Estate Analytics",
    description:
      "Yield scores, risk analysis, and buy/hold/avoid signals for tokenized property investments on Lofty and RealT.",
    type: "website",
    locale: "en_US",
    siteName: "Brickwise",
    url: "https://brickwise.pro",
  },
  twitter: {
    card: "summary_large_image",
    site: "@brickwisepro",
    title: "Brickwise — Tokenized Real Estate Analytics",
    description:
      "Yield comparisons, risk scores, and buy/hold/avoid signals for tokenized real estate on Lofty and RealT.",
  },
  keywords: [
    "tokenized real estate",
    "fractional real estate investment",
    "Lofty investment",
    "RealT investment",
    "real estate token yield",
    "tokenized property",
    "fractional property investment",
    "passive income real estate",
    "real estate yield analysis",
    "blockchain real estate",
  ],
  alternates: {
    canonical: "https://brickwise.pro",
  },
};

const globalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://brickwise.pro/#organization",
      "name": "Brickwise",
      "url": "https://brickwise.pro",
      "logo": "https://brickwise.pro/favicon.svg",
      "description":
        "Tokenized real estate investment analytics — yield scores, risk analysis, and buy/hold/avoid signals for Lofty and RealT properties.",
    },
    {
      "@type": "WebSite",
      "@id": "https://brickwise.pro/#website",
      "name": "Brickwise",
      "url": "https://brickwise.pro",
      "publisher": { "@id": "https://brickwise.pro/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://brickwise.pro/analyzer?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in">
      <html
        lang="en"
        className={`${inter.variable} ${dmMono.variable} ${dmSerif.variable} h-full`}
      >
        <body className="h-full">
          {/* Preconnect before stylesheet request — cuts ~100ms on first load */}
          <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
          {/* Preload stylesheet as high-priority resource hint */}
          <link
            rel="preload"
            as="style"
            href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          />
          {/* Load non-render-blocking: media=print swaps to all once loaded.
              Client Component because React 19 Server Components can't pass
              function event handlers to DOM. */}
          <NonBlockingStylesheet
            href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          />
          <noscript>
            <link
              rel="stylesheet"
              href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
            />
          </noscript>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
          />
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
