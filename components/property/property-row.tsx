"use client";

import Link from "next/link";
import { Property } from "@/lib/types";
import { ScoreRing } from "@/components/ui/score-ring";
import { RiskBadge } from "@/components/ui/risk-badge";
import { ValueTag } from "@/components/ui/value-tag";
import { PlatformDot } from "@/components/ui/platform-dot";
import { calcPaybackYears, calcCapRate, calcMonthlyReturn } from "@/lib/scoring";

const FALLBACK = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=80&auto=format&fit=crop";

interface PropertyRowProps {
  property: Property;
  compareMode?: boolean;
  isCompared?: boolean;
  onCompareToggle?: () => void;
  investAmount?: number;
}

export function PropertyRow({ property: p, compareMode, isCompared, onCompareToggle, investAmount }: PropertyRowProps) {
  const payback = calcPaybackYears(p);
  const capRate = calcCapRate(p);
  const monthly = investAmount ? calcMonthlyReturn(p, investAmount) : null;

  return (
    <div className="relative group">
      <Link href={`/property/${p.id}`} className="block no-underline">
        <div
          className="flex items-center gap-3 px-5 py-3 transition-colors"
          style={{
            borderBottom: "1px solid #f5f5f5",
            background: isCompared ? "rgba(59,130,246,0.04)" : "#fff",
            borderLeft: isCompared ? "2px solid #3b82f6" : "2px solid transparent",
          }}
          onMouseEnter={(e) => { if (!isCompared) (e.currentTarget as HTMLDivElement).style.background = "#fafafa"; }}
          onMouseLeave={(e) => { if (!isCompared) (e.currentTarget as HTMLDivElement).style.background = "#fff"; }}
        >
          {/* Thumbnail */}
          <img
            src={p.image || FALLBACK}
            alt={p.name}
            referrerPolicy="no-referrer-when-downgrade"
            className="w-10 h-10 rounded-[6px] object-cover flex-shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
          />

          {/* Property info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[13px] font-semibold truncate" style={{ color: "#111" }}>{p.name}</span>
              {p.isNew && (
                <span className="text-[12px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 uppercase tracking-wider" style={{ background: "#eff6ff", color: "#3b82f6" }}>New</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px]" style={{ color: "#a3a3a3" }}>{p.flag} {p.city}</span>
              <PlatformDot platform={p.platform} />
              <span className="hidden sm:inline text-[12px] px-1.5 py-0.5 rounded" style={{ background: "#f5f5f5", color: "#737373" }}>{p.propertyType}</span>
            </div>
          </div>

          {/* Value */}
          <div className="hidden sm:block flex-shrink-0">
            <ValueTag status={p.fairValueStatus} />
          </div>

          {/* Risk */}
          <div className="hidden md:block flex-shrink-0 w-20">
            <RiskBadge risk={p.risk} />
          </div>

          {/* Occupancy */}
          <div className="hidden lg:block flex-shrink-0 w-16 text-right">
            <div className="text-[13px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: p.occupancyRate >= 95 ? "#16a34a" : p.occupancyRate >= 90 ? "#b45309" : "#dc2626" }}>
              {p.occupancyRate}%
            </div>
            <div className="text-[12px] uppercase tracking-[0.4px]" style={{ color: "#a3a3a3" }}>occ.</div>
          </div>

          {/* Yield */}
          <div className="flex-shrink-0 w-16 text-right">
            <div className="text-[14px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}>
              {p.expectedYield}%
            </div>
            <div className="text-[12px] uppercase tracking-[0.4px]" style={{ color: "#a3a3a3" }}>yield</div>
          </div>

          {/* Cap rate */}
          <div className="hidden xl:block flex-shrink-0 w-16 text-right">
            <div className="text-[13px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}>
              {capRate}%
            </div>
            <div className="text-[12px] uppercase tracking-[0.4px]" style={{ color: "#a3a3a3" }}>cap rt.</div>
          </div>

          {/* Payback */}
          <div className="hidden xl:block flex-shrink-0 w-16 text-right">
            <div className="text-[13px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}>
              {payback}y
            </div>
            <div className="text-[12px] uppercase tracking-[0.4px]" style={{ color: "#a3a3a3" }}>payback</div>
          </div>

          {/* Token price */}
          <div className="hidden sm:block flex-shrink-0 w-20 text-right">
            <div className="text-[13px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}>
              €{p.tokenPrice.toFixed(2)}
            </div>
            <div className="text-[12px] uppercase tracking-[0.4px]" style={{ color: "#a3a3a3" }}>/token</div>
          </div>

          {/* Monthly or custom ROI */}
          <div className="hidden lg:block flex-shrink-0 w-24 text-right">
            {monthly !== null ? (
              <>
                <div className="text-[13px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}>€{monthly}/mo</div>
                <div className="text-[12px]" style={{ color: "#a3a3a3" }}>for €{investAmount!.toLocaleString()}</div>
              </>
            ) : (
              <>
                <div className="text-[13px] font-medium" style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}>€{p.monthlyRent}</div>
                <div className="text-[12px] uppercase tracking-[0.4px]" style={{ color: "#a3a3a3" }}>/mo</div>
              </>
            )}
          </div>

          {/* Score */}
          <div className="flex-shrink-0">
            <ScoreRing score={p.overallScore} size={36} />
          </div>

          {/* Chevron */}
          <div className="flex-shrink-0 transition-colors" style={{ color: "#d4d4d4" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Compare toggle — outside Link */}
      {compareMode && (
        <button
          className="absolute left-0 top-0 bottom-0 w-5 flex items-center justify-center z-10 transition-colors"
          style={{ background: isCompared ? "rgba(59,130,246,0.1)" : "transparent" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCompareToggle?.();
          }}
          title={isCompared ? "Remove from compare" : "Add to compare"}
        >
          <div
            className="w-3.5 h-3.5 rounded-sm flex items-center justify-center flex-shrink-0"
            style={{ background: isCompared ? "#3b82f6" : "transparent", border: `1.5px solid ${isCompared ? "#3b82f6" : "#d4d4d4"}` }}
          >
            {isCompared && (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4l2 2 3-3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </button>
      )}
    </div>
  );
}
