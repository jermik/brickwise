"use client";

import { useEffect, useRef } from "react";

interface NonBlockingStylesheetProps {
  href: string;
}

/**
 * Renders a stylesheet <link> with media="print" so it's non-render-blocking,
 * then swaps to media="all" once loaded. Must be a Client Component because
 * React 19 Server Components cannot pass function event handlers to DOM.
 */
export function NonBlockingStylesheet({ href }: NonBlockingStylesheetProps) {
  const ref = useRef<HTMLLinkElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.media === "print") {
      el.media = "all";
    }
  }, []);
  return (
    <link
      ref={ref}
      rel="stylesheet"
      href={href}
      media="print"
      onLoad={(e) => {
        (e.currentTarget as HTMLLinkElement).media = "all";
      }}
    />
  );
}
