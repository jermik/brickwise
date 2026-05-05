"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

const THRESHOLDS = [25, 50, 75, 90];

export function useScrollDepth(pageName?: string) {
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    fired.current = new Set();

    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = Math.round((scrolled / total) * 100);

      for (const threshold of THRESHOLDS) {
        if (pct >= threshold && !fired.current.has(threshold)) {
          fired.current.add(threshold);
          track("scroll_depth", {
            depth: threshold,
            page: pageName ?? window.location.pathname,
          });
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pageName]);
}
