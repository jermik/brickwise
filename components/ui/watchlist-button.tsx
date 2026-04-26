"use client";

import { useState, useEffect } from "react";

function getWatchlist(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("bw_watchlist") || "[]");
  } catch {
    return [];
  }
}

function setWatchlist(ids: number[]) {
  localStorage.setItem("bw_watchlist", JSON.stringify(ids));
}

const HeartIcon = ({
  size,
  filled,
}: {
  size: number;
  filled: boolean;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={filled ? "#e11d48" : "none"}
    style={{ flexShrink: 0 }}
  >
    <path
      d="M8 14S2 10.5 2 5.5a4 4 0 0 1 6 0 4 4 0 0 1 6 0C14 10.5 8 14 8 14z"
      stroke={filled ? "#e11d48" : "#737373"}
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

export function WatchlistButton({
  propertyId,
  size = 16,
  variant = "icon",
}: {
  propertyId: number;
  size?: number;
  variant?: "icon" | "full";
}) {
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState(false);

  useEffect(() => {
    setSaved(getWatchlist().includes(propertyId));
  }, [propertyId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const current = getWatchlist();
    const nowSaved = !current.includes(propertyId);
    const next = nowSaved
      ? [...current, propertyId]
      : current.filter((id) => id !== propertyId);
    setWatchlist(next);
    setSaved(nowSaved);
    if (nowSaved) {
      setFeedback(true);
      setTimeout(() => setFeedback(false), 1400);
    }
  }

  if (variant === "full") {
    return (
      <button
        onClick={toggle}
        aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-[11px] font-medium transition-colors duration-150 cursor-pointer"
        style={{
          background: saved ? "#fff0f3" : "#f5f5f5",
          border: `1px solid ${saved ? "#fecdd3" : "#e5e5e5"}`,
          color: feedback ? "#16a34a" : saved ? "#e11d48" : "#555",
        }}
      >
        {feedback ? (
          <>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Added
          </>
        ) : (
          <>
            <HeartIcon size={11} filled={saved} />
            {saved ? "In watchlist" : "Add to watchlist"}
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
      className="flex items-center justify-center rounded-full transition-all duration-150"
      style={{
        width: size + 8,
        height: size + 8,
        background: saved ? "#fff0f3" : "rgba(255,255,255,0.9)",
        border: saved ? "1px solid #fecdd3" : "1px solid rgba(0,0,0,0.08)",
        backdropFilter: "blur(4px)",
      }}
    >
      <HeartIcon size={size} filled={saved} />
    </button>
  );
}
