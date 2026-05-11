import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "GrowthOS | Local Business Outreach CRM for Agencies",
  description:
    "GrowthOS helps freelancers and small agencies audit local businesses, generate personalized proposals, and manage follow-ups without spammy bulk outreach.",
  alternates: { canonical: "/growthos" },
  openGraph: {
    title: "GrowthOS — Turn local business opportunities into clients",
    description:
      "The local business growth system for audits, outreach, proposals, and follow-ups. Built for personalised, low-volume outreach.",
    type: "website",
    siteName: "GrowthOS",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthOS — Local Business Outreach CRM",
    description:
      "Audit websites, spot SEO + automation opportunities, generate personalised proposals, manage follow-ups. No bulk spam.",
  },
};

export default function GrowthOSLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
