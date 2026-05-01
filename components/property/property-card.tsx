"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Property } from "@/lib/types";
import { ScoreRing } from "@/components/ui/score-ring";
import { ValueTag } from "@/components/ui/value-tag";
import { PlatformDot } from "@/components/ui/platform-dot";
import { WatchlistButton } from "@/components/ui/watchlist-button";
import { RecommendationBadge } from "@/components/ui/recommendation-badge";
import { getRecommendation } from "@/lib/recommendations";
import { calcPaybackYears, calcMonthlyReturn } from "@/lib/scoring";

const FALLBACK = "https://images.unsplash.com/photo-1560184897-ae5f036d1564?w=700&q=80&auto=format&fit=crop";

interface PropertyCardProps {
  property: Property;
  compareMode?: boolean;
  isCompared?: boolean;
  onCompareToggle?: () => void;
  investAmount?: number;
}

export function PropertyCard({ property: p, compareMode, isCompared, onCompareToggle, investAmount }: PropertyCardProps) {
  const rec = getRecommendation(p);
  const isBuy = rec.action === "Buy";
  const payback = calcPaybackYears(p);
  const monthly = investAmount ? calcMonthlyReturn(p, investAmount) : null;

  const borderColor = isCompared
    ? "rgba(59,130,246,0.7)"
    : isBuy ? "rgba(34,197,94,0.18)" : "#2A2420";

  return (
    <div className="relative h-full">
      <Link href={`/property/${p.id}`} className="block no-underline group h-full">
        <motion.div
          className="rounded-[12px] overflow-hidden h-full flex flex-col"
          style={{
            background: "#131109",
            border: `${isCompared ? "2px" : "1px"} solid ${borderColor}`,
            boxShadow: isCompared ? "0 0 0 2px rgba(59,130,246,0.2)" : undefined,
          }}
          whileHover={{
            y: -4,
            boxShadow: isCompared
              ? "0 0 0 2px rgba(59,130,246,0.3), 0 12px 40px rgba(0,0,0,0.4)"
              : isBuy
              ? "0 12px 40px rgba(34,197,94,0.14), 0 4px 12px rgba(0,0,0,0.5)"
              : "0 12px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)",
            borderColor: isCompared ? "rgba(59,130,246,0.9)" : isBuy ? "rgba(34,197,94,0.35)" : "rgba(242,237,230,0.12)",
          }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Image */}
          <div className="relative h-[148px] overflow-hidden flex-shrink-0">
            <motion.img
              src={p.image || FALLBACK}
              alt={p.name}
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)" }} />

            {/* Platform pill */}
            <div className="absolute bottom-2.5 left-3">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-medium"
                style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.88)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <PlatformDot platform={p.platform} light />
              </span>
            </div>

            {/* Best Buy / New badge */}
            {rec.label === "Best Buy" ? (
              <div className="absolute bottom-2.5 right-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold" style={{ background: "#22c55e", color: "#fff", padding: "2px 7px", borderRadius: 4 }}>★ Best Buy</span>
              </div>
            ) : p.isNew ? (
              <div className="absolute bottom-2.5 right-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.4px]" style={{ background: "#3b82f6", color: "#fff", padding: "2px 7px", borderRadius: 4 }}>New</span>
              </div>
            ) : null}

            {/* Score ring */}
            <div className="absolute top-2.5 right-2.5">
              <div style={{ background: "rgba(10,9,7,0.75)", backdropFilter: "blur(6px)", borderRadius: "50%", padding: 3, border: "1px solid rgba(255,255,255,0.08)" }}>
                <ScoreRing score={p.overallScore} size={36} />
              </div>
            </div>

            {/* Watchlist (shifted right if compare mode active) */}
            <div className={`absolute top-2.5 ${compareMode ? "left-9" : "left-2.5"}`}>
              <WatchlistButton propertyId={p.id} size={14} />
            </div>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col flex-1">
            <div className="mb-3">
              <div className="text-[15px] font-normal leading-tight mb-1 truncate" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
                {p.name}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>{p.flag} {p.city}</span>
                <ValueTag status={p.fairValueStatus} />
              </div>
            </div>

            {/* Stat grid */}
            <div className="rounded-[8px] overflow-hidden mb-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "#2A2420" }}>
              {[
                { label: "Yield", value: `${p.expectedYield}%`, green: true },
                { label: "Payback", value: `${payback}y` },
                { label: "Token", value: `€${p.tokenPrice.toFixed(2)}` },
                { label: "Monthly", value: `€${p.monthlyRent}` },
                { label: "Occupancy", value: `${p.occupancyRate}%` },
                { label: "Score", value: String(p.overallScore) },
              ].map((s) => (
                <div key={s.label} className="px-2.5 py-2" style={{ background: "#131109" }}>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.5px] mb-0.5" style={{ color: "rgba(242,237,230,0.3)" }}>
                    {s.label}
                  </div>
                  <div className="text-[13px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: s.green ? "#22c55e" : "#F2EDE6" }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* ROI for custom invest amount */}
            {monthly !== null && (
              <div
                className="rounded-[6px] px-3 py-2 mb-2 flex items-center justify-between"
                style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.12)" }}
              >
                <span className="text-[10px]" style={{ color: "rgba(242,237,230,0.45)" }}>
                  €{investAmount!.toLocaleString("de-DE")} earns
                </span>
                <span className="text-[13px] font-semibold" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>
                  €{monthly}/mo
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 mt-auto">
              <RecommendationBadge action={rec.action} reason={rec.reason} />
              <WatchlistButton propertyId={p.id} variant="full" />
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Compare toggle — outside the Link so clicks don't navigate */}
      {compareMode && (
        <button
          className="absolute top-2.5 left-2.5 z-10 flex items-center justify-center transition-all"
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: isCompared ? "#3b82f6" : "rgba(10,9,7,0.75)",
            backdropFilter: "blur(6px)",
            border: `1px solid ${isCompared ? "#3b82f6" : "rgba(255,255,255,0.15)"}`,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCompareToggle?.();
          }}
          title={isCompared ? "Remove from compare" : "Add to compare"}
        >
          {isCompared ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 6h8" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
