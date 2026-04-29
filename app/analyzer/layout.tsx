import type { Metadata } from "next";
import { PROPERTIES } from "@/lib/data/properties";

const count = PROPERTIES.length;
const avgYield =
  Math.round(
    (PROPERTIES.reduce((s, p) => s + p.expectedYield, 0) / count) * 10
  ) / 10;

export const metadata: Metadata = {
  title: `Browse ${count} Tokenized Properties — Filter by Yield, Risk & Platform | Brickwise`,
  description: `Compare ${count} tokenized real estate investments on Lofty and RealT. Filter by yield (platform avg ${avgYield}%), risk level, city, and token price. Find the best fractional property for your goals.`,
  keywords: [
    `best Lofty properties ${new Date().getFullYear()}`,
    `best RealT properties ${new Date().getFullYear()}`,
    "fractional real estate high yield",
    "tokenized real estate comparison",
    "Lofty vs RealT investment",
    "passive income real estate tokens",
    "tokenized property yield filter",
    "real estate token buy",
    "fractional property investment list",
    "tokenized rental property",
  ],
  openGraph: {
    title: `${count} Tokenized Properties — Filter by Yield & Risk | Brickwise`,
    description: `Browse and filter ${count} tokenized real estate investments. Platform avg ${avgYield}% net yield. Lofty and RealT with full analysis.`,
    type: "website",
    url: "https://brickwise.pro/analyzer",
  },
  twitter: {
    card: "summary_large_image",
    title: `Browse ${count} Tokenized Properties | Brickwise`,
    description: `Filter by yield, risk, and platform. Avg ${avgYield}% net yield across Lofty and RealT.`,
  },
  alternates: {
    canonical: "https://brickwise.pro/analyzer",
  },
};

export default function AnalyzerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
