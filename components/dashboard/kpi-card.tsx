interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
}

export function KpiCard({ label, value, sub, trend }: KpiCardProps) {
  const up = trend !== undefined && trend >= 0;
  return (
    <div
      className="rounded-[10px] p-5"
      style={{ background: "#fff", border: "1px solid #ebebeb" }}
    >
      <div
        className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-2.5"
        style={{ color: "#a3a3a3" }}
      >
        {label}
      </div>
      <div
        className="text-[22px] font-medium leading-none tracking-[-0.5px] mb-1.5"
        style={{ fontFamily: "var(--font-dm-mono)", color: "#111" }}
      >
        {value}
      </div>
      <div className="flex items-center gap-1.5">
        {trend !== undefined && (
          <span
            className="text-[11px] font-medium"
            style={{ color: up ? "#16a34a" : "#dc2626" }}
          >
            {up ? "↑" : "↓"} {up ? "+" : ""}{trend}%
          </span>
        )}
        {sub && (
          <span className="text-[11px]" style={{ color: "#a3a3a3" }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
