import Link from "next/link";
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
  return (
    <Link href={`/property/${p.id}`} className="block no-underline group">
      <div
        className="rounded-[10px] overflow-hidden transition-shadow duration-200 group-hover:shadow-[0_6px_24px_rgba(60,40,10,0.10)]"
        style={{ background: "#F8F5F0", border: "1px solid #E0DAD0" }}
      >
        {/* Image */}
        <div className="relative h-[140px] overflow-hidden flex-shrink-0">
          <img
            src={p.image}
            alt={p.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {/* Platform dot — glass pill bottom-left */}
          <div className="absolute bottom-2.5 left-3">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-medium"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(6px)",
                color: "rgba(255,255,255,0.9)",
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              <PlatformDot platform={p.platform} light />
            </span>
          </div>
          {/* Bottom-right: Best Buy or New badge */}
          {rec.label === "Best Buy" ? (
            <div className="absolute bottom-2.5 right-3">
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold"
                style={{
                  background: "#16a34a",
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
                  background: "#2563eb",
                  color: "#fff",
                  padding: "2px 7px",
                  borderRadius: 4,
                }}
              >
                New
              </span>
            </div>
          ) : null}
          {/* Score ring top-right */}
          <div className="absolute top-2.5 right-2.5">
            <div
              style={{
                background: "rgba(255,255,255,0.92)",
                borderRadius: "50%",
                padding: 2,
              }}
            >
              <ScoreRing score={p.overallScore} size={36} />
            </div>
          </div>
          {/* Watchlist heart top-left */}
          <div className="absolute top-2.5 left-2.5">
            <WatchlistButton propertyId={p.id} size={14} />
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Name + location */}
          <div className="mb-3">
            <div
              className="text-[15px] font-normal leading-tight mb-1"
              style={{ color: "#111", fontFamily: "var(--font-dm-serif)" }}
            >
              {p.name}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px]" style={{ color: "#a3a3a3" }}>
                {p.flag} {p.city}
              </span>
              <ValueTag status={p.fairValueStatus} />
            </div>
          </div>

          {/* Stat grid — border-as-gap trick */}
          <div
            className="rounded-[8px] overflow-hidden mb-3"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              background: "#E0DAD0",
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
                style={{ background: "#F8F5F0" }}
              >
                <div
                  className="text-[9px] font-semibold uppercase tracking-[0.6px] mb-1"
                  style={{ color: "#a3a3a3" }}
                >
                  {s.label}
                </div>
                <div
                  className="text-[14px] font-medium"
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    color: s.green ? "#16a34a" : "#111",
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation + watchlist */}
          <div className="flex items-center justify-between gap-2">
            <RecommendationBadge action={rec.action} reason={rec.reason} />
            <WatchlistButton propertyId={p.id} variant="full" />
          </div>
        </div>
      </div>
    </Link>
  );
}
