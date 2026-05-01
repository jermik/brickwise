import type { Metadata } from "next";
import { PortfolioClient } from "@/components/portfolio/portfolio-client";

export const metadata: Metadata = {
  title: "My Tokenized Real Estate Portfolio — Income & Yield Tracker | Brickwise",
  description: "Track your tokenized real estate holdings, monthly rental income, and yield performance across Lofty and RealT. See portfolio-level insights and better alternatives.",
  robots: { index: false, follow: false },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
