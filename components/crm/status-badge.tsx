import { STATUS_CONFIG, type LeadStatus } from "@/lib/crm/types";

interface StatusBadgeProps {
  status: LeadStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const pad = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center rounded font-mono font-medium tracking-wide ${pad}`}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}22` }}
    >
      {cfg.label}
    </span>
  );
}
