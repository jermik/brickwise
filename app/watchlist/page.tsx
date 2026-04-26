"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PropertyCard } from "@/components/property/property-card";
import { PROPERTIES } from "@/lib/data/properties";

export default function WatchlistPage() {
  const [ids, setIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("bw_watchlist") || "[]");
      setIds(stored);
    } catch {
      setIds([]);
    }
    setReady(true);

    function onStorage(e: StorageEvent) {
      if (e.key === "bw_watchlist") {
        try {
          setIds(JSON.parse(e.newValue || "[]"));
        } catch {
          setIds([]);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const saved = PROPERTIES.filter((p) => ids.includes(p.id));

  return (
    <AppShell>
      <div className="px-10 py-9 max-w-[1080px]">
        {/* Header */}
        <div className="mb-7">
          <div
            className="text-[11px] font-medium uppercase tracking-[0.6px] mb-1.5"
            style={{ color: "#a3a3a3" }}
          >
            Saved
          </div>
          <h1
            className="text-[22px] font-bold tracking-[-0.5px]"
            style={{ color: "#111" }}
          >
            Watchlist
          </h1>
        </div>

        {!ready ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-[10px] animate-pulse"
                style={{ background: "#f5f5f5", height: 240 }}
              />
            ))}
          </div>
        ) : saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ background: "#f5f5f5" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 2h12a1 1 0 011 1v15l-7-4-7 4V3a1 1 0 011-1z"
                  stroke="#a3a3a3"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              className="text-[14px] font-semibold mb-1.5"
              style={{ color: "#111" }}
            >
              No saved properties
            </div>
            <div className="text-[12px]" style={{ color: "#a3a3a3" }}>
              Tap the heart icon on any property to save it here
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {saved.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
