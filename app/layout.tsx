import type { Metadata } from "next";
import { Inter, DM_Mono, DM_Serif_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
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
  title: "Brickwise — Tokenised Real Estate Analytics",
  description:
    "Cut through the noise. Brickwise analyses tokenised property yields, risk, and fair value across RealT, EstateX, and Blocksquare — so you know exactly what to buy, hold, or avoid.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Brickwise — Tokenised Real Estate Analytics",
    description:
      "Cut through the noise. Brickwise analyses tokenised property yields, risk, and fair value — so you know exactly what to buy, hold, or avoid.",
    type: "website",
    locale: "en_EU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brickwise — Tokenised Real Estate Analytics",
    description:
      "Yield comparisons, risk scores, and buy/hold/avoid signals for tokenised real estate.",
  },
  keywords: [
    "tokenised real estate",
    "RealT",
    "EstateX",
    "Blocksquare",
    "real estate investment",
    "property yield",
    "fractional real estate",
    "blockchain property",
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
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
