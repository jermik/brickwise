"use client";

import Link from "next/link";
import { useHoldings } from "@/lib/hooks/use-holdings";
import { PROPERTIES } from "@/lib/data/properties";
import { MiniChart } from "@/components/ui/mini-chart";

export function HoldingsPanel() {
  const { holdings, incomeHistory, loaded } = useHoldings();

  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalMonthly = holdings.reduce((sum, h) => {
    const prop = PROPERTIES.find((p) => p.id === h.propertyId);
    if (!prop) return sum;
    return sum + Math.round((h.currentValue * prop.expectedYield) / 100 / 12);
  }, 0);

  if (!loaded) {
    return (
      <div
        className="rounded-[10px] p-5"
        style={{ background: "#131109", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.3)" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div
        className="rounded-[10px] p-5"
        style={{ background: "#131109", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.6px]"
            style={{ color: "rgba(242,237,230,0.35)" }}
          >
            Portfolio
          </div>
          <Link
            href="/portfolio"
            className="text-[11px] font-medium no-underline transition-opacity hover:opacity-70"
            style={{ color: "#22c55e" }}
          >
            Set up →
          </Link>
        </div>
        <div className="text-[12px] mb-3" style={{ color: "rgba(242,237,230,0.4)" }}>
          No holdings tracked yet.
        </div>
        <Link
          href="/portfolio"
          className="block w-full text-center py-2 rounded-[6px] text-[11px] font-semibold no-underline transition-opacity hover:opacity-80"
          style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.15)" }}
        >
          Add your holdings →
        </Link>
      </div>
    );
  }

  return (
    <div
      className="rounded-[10px] p-5"
      style={{ background: "#131109", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="text-[10px] font-semibold uppercase tracking-[0.6px]"
          style={{ color: "rgba(242,237,230,0.35)" }}
        >
          Portfolio
        </div>
        <Link
          href="/portfolio"
          className="text-[11px] font-medium no-underline transition-opacity hover:opacity-70"
          style={{ color: "#22c55e" }}
        >
          View →
        </Link>
      </div>

      {/* Total */}
      <div className="mb-4">
        <div
          className="text-[22px] font-medium leading-none tracking-[-0.5px] mb-1"
          style={{ fontFamily: "var(--font-dm-mono)", color: "#F2EDE6" }}
        >
          €{totalValue.toLocaleString("de-DE")}
        </div>
        <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
          +€{totalMonthly}/mo income
        </div>
      </div>

      {/* Sparkline */}
      {incomeHistory.length >= 2 && (
        <div className="mb-4">
          <MiniChart data={incomeHistory} showLabels={false} />
        </div>
      )}

      {/* Holdings list */}
      <div>
        {holdings.slice(0, 4).map((h, i) => {
          const prop = PROPERTIES.find((p) => p.id === h.propertyId);
          if (!prop) return null;
          const isLast = i === Math.min(holdings.length, 4) - 1;
          return (
            <Link
              key={h.propertyId}
              href={`/property/${prop.id}`}
              className="flex items-center gap-3 py-2.5 no-underline group"
              style={!isLast ? { borderBottom: "1px solid rgba(255,255,255,0.05)" } : undefined}
            >
              <img
                src={prop.image}
                alt={prop.name}
                referrerPolicy="no-referrer-when-downgrade"
                className="w-9 h-9 rounded-[6px] object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div
                  className="text-[12px] font-semibold leading-tight truncate mb-0.5 group-hover:opacity-70 transition-opacity"
                  style={{ color: "#F2EDE6" }}
                >
                  {prop.name}
                </div>
                <div className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                  {h.tokens} tokens · {prop.flag} {prop.city}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div
                  className="text-[12px] font-medium leading-tight mb-0.5"
                  style={{ fontFamily: "var(--font-dm-mono)", color: "#F2EDE6" }}
                >
                  €{h.currentValue.toLocaleString("de-DE")}
                </div>
                <div
                  className="text-[11px] font-medium"
                  style={{ fontFamily: "var(--font-dm-mono)", color: "#22c55e" }}
                >
                  {prop.expectedYield}%
                </div>
              </div>
            </Link>
          );
        })}
        {holdings.length > 4 && (
          <Link
            href="/portfolio"
            className="block text-center pt-2.5 text-[11px] no-underline transition-opacity hover:opacity-70"
            style={{ color: "rgba(242,237,230,0.35)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            +{holdings.length - 4} more holdings →
          </Link>
        )}
      </div>
    </div>
  );
}
