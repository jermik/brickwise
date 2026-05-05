import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "My Watchlist | Brickwise",
  description: "Your saved tokenized real estate properties.",
  robots: { index: false, follow: false },
};

export default function WatchlistLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
