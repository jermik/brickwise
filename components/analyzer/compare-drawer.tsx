"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Property } from "@/lib/types";
import { getRecommendation } from "@/lib/recommendations";
import { calcPaybackYears, calcCapRate, calcFeeBurden } from "@/lib/scoring";

interface CompareDrawerProps {
  properties: Property[];
  onRemove: (id: number) => void;
  onClose: () => void;
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=80&auto=format&fit=crop";

function recColor(action: string) {
  if (action === "Buy") return "#22c55e";
  if (action === "Hold") return "#f59e0b";
  return "#ef4444";
}

interface Row {
  label: string;
  get: (p: Property) => { display: string; num: number };
  bestIsHigh?: boolean;
  bestIsLow?: boolean;
}

const ROWS: Row[] = [
  { label: "Expected Yield", get: (p) => ({ display: `${p.expectedYield}%`, num: p.expectedYield }), bestIsHigh: true },
  { label: "Overall Score", get: (p) => ({ display: `${p.overallScore}/100`, num: p.overallScore }), bestIsHigh: true },
  { label: "Monthly Rent", get: (p) => ({ display: `€${p.monthlyRent.toLocaleString("de-DE")}`, num: p.monthlyRent }), bestIsHigh: true },
  { label: "Token Price", get: (p) => ({ display: `€${p.tokenPrice.toFixed(2)}`, num: p.tokenPrice }) },
  { label: "Total Value", get: (p) => ({ display: `€${(p.tokenPrice * p.totalTokens).toLocaleString("de-DE")}`, num: p.tokenPrice * p.totalTokens }) },
  { label: "Occupancy", get: (p) => ({ display: `${p.occupancyRate}%`, num: p.occupancyRate }), bestIsHigh: true },
  { label: "Payback Period", get: (p) => ({ display: `${calcPaybackYears(p)}y`, num: calcPaybackYears(p) }), bestIsLow: true },
  { label: "Cap Rate", get: (p) => ({ display: `${calcCapRate(p)}%`, num: calcCapRate(p) }), bestIsHigh: true },
  { label: "Fee Burden", get: (p) => ({ display: `${calcFeeBurden(p)}%`, num: calcFeeBurden(p) }), bestIsLow: true },
  { label: "Gross Yield", get: (p) => ({ display: `${p.grossYield ?? p.expectedYield}%`, num: p.grossYield ?? p.expectedYield }) },
  { label: "Risk", get: (p) => ({ display: p.risk, num: p.risk === "Low" ? 3 : p.risk === "Medium" ? 2 : 1 }), bestIsHigh: true },
  { label: "Value Status", get: (p) => ({ display: p.fairValueStatus === "undervalued" ? "Undervalued" : p.fairValueStatus === "fair" ? "Fair value" : "Overpriced", num: 0 }) },
  { label: "Property Type", get: (p) => ({ display: p.propertyType, num: 0 }) },
  { label: "Platform", get: (p) => ({ display: p.platform, num: 0 }) },
  { label: "Year Built", get: (p) => ({ display: p.yearBuilt ? String(p.yearBuilt) : "—", num: p.yearBuilt ?? 0 }) },
];

export function CompareDrawer({ properties, onRemove, onClose }: CompareDrawerProps) {
  const recs = properties.map((p) => getRecommendation(p, properties));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose} />

        <motion.div
          className="relative overflow-hidden flex flex-col"
          style={{ background: "#fff", borderRadius: "20px 20px 0 0", maxHeight: "88vh" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 320 }}
        >
          {/* Drag handle */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-9 h-1 rounded-full" style={{ background: "#e5e5e5" }} />

          {/* Header */}
          <div className="px-6 pt-5 pb-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: "1px solid #f0f0f0" }}>
            <div>
              <div className="text-[15px] font-semibold" style={{ color: "#111" }}>Side-by-Side Comparison</div>
              <div className="text-[11px]" style={{ color: "#a3a3a3" }}>
                {properties.length} properties · <span style={{ color: "#22c55e" }}>green</span> = best value in row
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[12px] font-medium px-4 py-1.5 rounded-[7px] transition-opacity hover:opacity-75"
              style={{ background: "#f5f5f5", color: "#737373", border: "1px solid #e5e5e5" }}
            >
              Close ✕
            </button>
          </div>

          {/* Scrollable table */}
          <div className="overflow-auto flex-1">
            <table className="w-full border-collapse" style={{ minWidth: Math.max(520, 160 + properties.length * 180) }}>
              <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th className="text-left py-3 px-5 text-[12px] font-semibold uppercase tracking-[0.7px]" style={{ color: "#a3a3a3", width: 160, minWidth: 140 }}>
                    Metric
                  </th>
                  {properties.map((p, i) => (
                    <th key={p.id} className="py-3 px-4 text-center" style={{ width: 180, minWidth: 160 }}>
                      <div className="flex flex-col items-center gap-1.5">
                        <img
                          src={p.image || FALLBACK_IMG}
                          alt={p.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                          className="w-16 h-10 rounded-[6px] object-cover"
                        />
                        <Link
                          href={`/property/${p.id}`}
                          className="text-[11px] font-semibold text-center no-underline hover:opacity-70 transition-opacity leading-tight"
                          style={{ color: "#111", maxWidth: 150, display: "block" }}
                        >
                          {p.name}
                        </Link>
                        <div
                          className="text-[12px] font-bold px-2 py-0.5 rounded-[4px]"
                          style={{ background: `${recColor(recs[i].action)}18`, color: recColor(recs[i].action) }}
                        >
                          {recs[i].action}
                        </div>
                        <button
                          onClick={() => onRemove(p.id)}
                          className="text-[12px] uppercase tracking-wider transition-opacity hover:opacity-50"
                          style={{ color: "#c4c4c4" }}
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, ri) => {
                  const vals = properties.map((p) => row.get(p));
                  const nums = vals.map((v) => v.num);
                  const validNums = nums.filter((n) => n > 0);
                  const maxN = validNums.length ? Math.max(...validNums) : -Infinity;
                  const minN = validNums.length ? Math.min(...validNums) : Infinity;
                  const hasDiff = maxN !== minN;

                  return (
                    <tr
                      key={row.label}
                      style={{ background: ri % 2 === 0 ? "#fafafa" : "#fff", borderBottom: "1px solid #f5f5f5" }}
                    >
                      <td className="py-3 px-5 text-[11px] font-medium" style={{ color: "#737373" }}>
                        {row.label}
                      </td>
                      {vals.map((val, pi) => {
                        const isBest = hasDiff && row.bestIsHigh && val.num === maxN;
                        const isWorst = hasDiff && row.bestIsLow && val.num === maxN;
                        const isBestLow = hasDiff && row.bestIsLow && val.num === minN;
                        const highlight = isBest || isBestLow;
                        const bad = isWorst;
                        return (
                          <td
                            key={pi}
                            className="py-3 px-4 text-center text-[12px] font-semibold"
                            style={{
                              color: highlight ? "#16a34a" : bad ? "#dc2626" : "#111",
                              background: highlight ? "rgba(34,197,94,0.05)" : bad ? "rgba(220,38,38,0.04)" : undefined,
                            }}
                          >
                            {val.display}
                            {highlight && <span className="ml-1 text-[12px]">★</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
