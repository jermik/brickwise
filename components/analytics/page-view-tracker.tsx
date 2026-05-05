"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";
import { trackPageView } from "@/lib/analytics";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    if (url === prevPath.current) return;
    prevPath.current = url;
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}

// Generic client-side event fired once on mount — used by server component pages
// to track view events (compare, learn, rankings, city).
export function FireEvent({
  name,
  params,
}: {
  name: string;
  params?: Record<string, string | number>;
}) {
  useEffect(() => {
    track(name, params);
    // Also fire gtag if available
    try {
      if (typeof window !== "undefined" && typeof (window as Window & { gtag?: (...a: unknown[]) => void }).gtag === "function") {
        (window as Window & { gtag: (...a: unknown[]) => void }).gtag("event", name, params ?? {});
      }
    } catch { /* silent */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
