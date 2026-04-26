import Link from "next/link";
import { Property } from "@/lib/types";
import { ScoreRing } from "@/components/ui/score-ring";
import { RiskBadge } from "@/components/ui/risk-badge";
import { ValueTag } from "@/components/ui/value-tag";
import { PlatformDot } from "@/components/ui/platform-dot";

export function PropertyRow({ property: p }: { property: Property }) {
  return (
    <Link href={`/property/${p.id}`} className="block no-underline group">
      <div
        className="flex items-center gap-4 px-5 py-3.5 transition-colors"
        style={{
          borderBottom: "1px solid #f5f5f5",
          background: "#fff",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "#fafafa";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "#fff";
        }}
      >
        {/* Thumbnail */}
        <img
          src={p.image}
          alt={p.name}
          className="w-10 h-10 rounded-[6px] object-cover flex-shrink-0"
        />

        {/* Property info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[13px] font-semibold truncate"
              style={{ color: "#111" }}
            >
              {p.name}
            </span>
            {p.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ background: "#f0fdf4", color: "#16a34a" }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: "#a3a3a3" }}>
              {p.flag} {p.city}
            </span>
            <PlatformDot platform={p.platform} />
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

        {/* Yield */}
        <div className="flex-shrink-0 w-16 text-right">
          <div
            className="text-[14px] font-medium"
            style={{ fontFamily: "var(--font-dm-mono)", color: "#16a34a" }}
          >
            {p.expectedYield}%
          </div>
          <div className="text-[10px] uppercase tracking-[0.4px]" style={{ color: "#a3a3a3" }}>
            yield
          </div>
        </div>

        {/* Token */}
        <div className="hidden sm:block flex-shrink-0 w-20 text-right">
          <div
            className="text-[13px] font-medium"
            style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
          >
            €{p.tokenPrice.toFixed(2)}
          </div>
          <div className="text-[10px] uppercase tracking-[0.4px]" style={{ color: "#a3a3a3" }}>
            /token
          </div>
        </div>

        {/* Monthly */}
        <div className="hidden lg:block flex-shrink-0 w-20 text-right">
          <div
            className="text-[13px] font-medium"
            style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
          >
            €{p.monthlyRent}
          </div>
          <div className="text-[10px] uppercase tracking-[0.4px]" style={{ color: "#a3a3a3" }}>
            /mo
          </div>
        </div>

        {/* Score */}
        <div className="flex-shrink-0">
          <ScoreRing score={p.overallScore} size={38} />
        </div>

        {/* Chevron */}
        <div
          className="flex-shrink-0 transition-colors"
          style={{ color: "#d4d4d4" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M5 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
