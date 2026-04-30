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

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property: p }: PropertyCardProps) {
  const rec = getRecommendation(p);
  const isBuy = rec.action === "Buy";

  return (
    <Link href={`/property/${p.id}`} className="block no-underline group">
      <motion.div
        className="rounded-[12px] overflow-hidden h-full"
        style={{
          background: "#131109",
          border: `1px solid ${isBuy ? "rgba(34,197,94,0.18)" : "#2A2420"}`,
        }}
        whileHover={{
          y: -4,
          boxShadow: isBuy
            ? "0 12px 40px rgba(34,197,94,0.14), 0 4px 12px rgba(0,0,0,0.5)"
            : "0 12px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)",
          borderColor: isBuy ? "rgba(34,197,94,0.35)" : "rgba(242,237,230,0.12)",
        }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Image */}
        <div className="relative h-[148px] overflow-hidden flex-shrink-0">
          <motion.img
            src={p.image}
            alt={p.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* Platform pill */}
          <div className="absolute bottom-2.5 left-3">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-medium"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                color: "rgba(255,255,255,0.88)",
                padding: "2px 8px",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <PlatformDot platform={p.platform} light />
            </span>
          </div>

          {/* Badge top-right */}
          {rec.label === "Best Buy" ? (
            <div className="absolute bottom-2.5 right-3">
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold"
                style={{
                  background: "#22c55e",
                  color: "#fff",
                  padding: "2px 7px",
                  borderRadius: 4,
                }}
              >
                ★ Best Buy
              </span>
            </div>
          ) : p.isNew ? (
            <div className="absolute bottom-2.5 right-3">
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.4px]"
                style={{
                  background: "#3b82f6",
                  color: "#fff",
                  padding: "2px 7px",
                  borderRadius: 4,
                }}
              >
                New
              </span>
            </div>
          ) : null}

          {/* Score ring */}
          <div className="absolute top-2.5 right-2.5">
            <div
              style={{
                background: "rgba(10,9,7,0.75)",
                backdropFilter: "blur(6px)",
                borderRadius: "50%",
                padding: 3,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <ScoreRing score={p.overallScore} size={36} />
            </div>
          </div>

          {/* Watchlist */}
          <div className="absolute top-2.5 left-2.5">
            <WatchlistButton propertyId={p.id} size={14} />
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-3">
            <div
              className="text-[15px] font-normal leading-tight mb-1 truncate"
              style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
            >
              {p.name}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                {p.flag} {p.city}
              </span>
              <ValueTag status={p.fairValueStatus} />
            </div>
          </div>

          {/* Stat grid */}
          <div
            className="rounded-[8px] overflow-hidden mb-3"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              background: "#2A2420",
            }}
          >
            {[
              { label: "Yield", value: `${p.expectedYield}%`, green: true },
              { label: "Monthly", value: `€${p.monthlyRent}` },
              { label: "Token", value: `€${p.tokenPrice.toFixed(2)}` },
              { label: "Occupancy", value: `${p.occupancyRate}%` },
            ].map((s) => (
              <div
                key={s.label}
                className="px-3 py-2.5"
                style={{ background: "#131109" }}
              >
                <div
                  className="text-[9px] font-semibold uppercase tracking-[0.6px] mb-1"
                  style={{ color: "rgba(242,237,230,0.3)" }}
                >
                  {s.label}
                </div>
                <div
                  className="text-[14px] font-medium"
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    color: s.green ? "#22c55e" : "#F2EDE6",
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <RecommendationBadge action={rec.action} reason={rec.reason} />
            <WatchlistButton propertyId={p.id} variant="full" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
