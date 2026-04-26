"use client";

import Link from "next/link";
import { HOLDINGS, PROPERTIES, INCOME_HISTORY } from "@/lib/data/properties";
import { MiniChart } from "@/components/ui/mini-chart";

const CHART_DATA = [
  { month: "Aug", value: 4100 },
  { month: "Sep", value: 4350 },
  { month: "Oct", value: 4280 },
  { month: "Nov", value: 4520 },
  { month: "Dec", value: 4710 },
  { month: "Jan", value: 4890 },
];

export function HoldingsPanel() {
  const totalValue = HOLDINGS.reduce((s, h) => s + h.currentValue, 0);
  const latestIncome = INCOME_HISTORY[INCOME_HISTORY.length - 1].value;

  return (
    <div
      className="rounded-[10px] p-5"
      style={{ background: "#fff", border: "1px solid #ebebeb" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="text-[10px] font-semibold uppercase tracking-[0.6px]"
          style={{ color: "#a3a3a3" }}
        >
          Holdings
        </div>
        <Link
          href="/analyzer"
          className="text-[11px] font-medium no-underline transition-opacity hover:opacity-70"
          style={{ color: "#16a34a" }}
        >
          Browse →
        </Link>
      </div>

      {/* Total */}
      <div className="mb-4">
        <div
          className="text-[22px] font-medium leading-none tracking-[-0.5px] mb-1"
          style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
        >
          €{totalValue.toLocaleString("de-DE")}
        </div>
        <div className="text-[11px]" style={{ color: "#a3a3a3" }}>
          +€{latestIncome}/mo income
        </div>
      </div>

      {/* Sparkline */}
      <div className="mb-4">
        <MiniChart data={CHART_DATA} showLabels={false} />
      </div>

      {/* Holdings list */}
      <div>
        {HOLDINGS.map((h, i) => {
          const prop = PROPERTIES.find((p) => p.id === h.propertyId);
          if (!prop) return null;
          const isLast = i === HOLDINGS.length - 1;
          return (
            <Link
              key={h.propertyId}
              href={`/property/${prop.id}`}
              className="flex items-center gap-3 py-2.5 no-underline group"
              style={!isLast ? { borderBottom: "1px solid #f5f5f5" } : undefined}
            >
              <img
                src={prop.image}
                alt={prop.name}
                className="w-9 h-9 rounded-[6px] object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div
                  className="text-[12px] font-semibold leading-tight truncate mb-0.5 group-hover:opacity-70 transition-opacity"
                  style={{ color: "#111" }}
                >
                  {prop.name}
                </div>
                <div className="text-[11px]" style={{ color: "#a3a3a3" }}>
                  {h.tokens} tokens · {prop.flag} {prop.city}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div
                  className="text-[12px] font-medium leading-tight mb-0.5"
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    color: "#111",
                  }}
                >
                  €{h.currentValue.toLocaleString("de-DE")}
                </div>
                <div
                  className="text-[11px] font-medium"
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    color: "#16a34a",
                  }}
                >
                  {prop.expectedYield}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
