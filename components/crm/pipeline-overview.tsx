import { STATUS_CONFIG, type LeadStatus } from "@/lib/crm/types";

interface PipelineOverviewProps {
  byStatus: Record<string, number>;
  total: number;
}

const PIPELINE: LeadStatus[] = [
  "new",
  "researched",
  "audit_ready",
  "contacted",
  "replied",
  "meeting_booked",
  "proposal_sent",
  "won",
];

export function PipelineOverview({ byStatus, total }: PipelineOverviewProps) {
  return (
    <div className="space-y-3">
      {PIPELINE.map((status) => {
        const count = byStatus[status] ?? 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        const cfg = STATUS_CONFIG[status];
        return (
          <div key={status} className="flex items-center gap-3">
            <span
              className="w-28 shrink-0 font-mono text-[12px] tracking-wide"
              style={{ color: cfg.color }}
            >
              {cfg.label.toUpperCase()}
            </span>
            <div
              className="flex-1 h-5 rounded overflow-hidden relative"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="h-full rounded transition-all duration-700"
                style={{
                  width: `${Math.max(pct, count > 0 ? 2 : 0)}%`,
                  background: cfg.color,
                  opacity: 0.7,
                }}
              />
              {count > 0 && (
                <span
                  className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[12px] font-semibold"
                  style={{ color: "#F2EDE6" }}
                >
                  {count}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className="rounded-lg px-4 py-4 space-y-1"
      style={{ background: "#131109", border: "1px solid #2A2420" }}
    >
      <p className="text-[12px] font-mono tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
        {label}
      </p>
      <p className="font-display text-2xl" style={{ color: accent ?? "#F2EDE6" }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: "rgba(242,237,230,0.4)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
