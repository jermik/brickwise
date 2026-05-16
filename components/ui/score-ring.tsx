"use client";

import { useRef, useState, useEffect } from "react";
import { scoreColor } from "@/lib/scoring";

interface ScoreRingProps {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 40 }: ScoreRingProps) {
  const strokeWidth = 3;
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = scoreColor(score);

  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e8e8e8"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={revealed ? circ - dash : circ}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: size >= 52 ? 17 : size >= 40 ? 12 : 11,
          fontWeight: 500,
          color,
          letterSpacing: "-0.5px",
        }}
      >
        {score}
      </span>
    </div>
  );
}
