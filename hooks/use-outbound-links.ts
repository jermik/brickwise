"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

export function useOutboundLinks() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href") ?? "";
      if (!href.startsWith("http") && !href.startsWith("//")) return;
      const isExternal =
        !href.includes("brickwise.pro") && !href.startsWith("/");
      if (!isExternal) return;

      track("outbound_click", {
        url: href,
        text: (target.textContent ?? "").trim().slice(0, 60),
        page: window.location.pathname,
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}
