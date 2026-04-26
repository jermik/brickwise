import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Announce — Brickwise",
};

export default function AnnounceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
