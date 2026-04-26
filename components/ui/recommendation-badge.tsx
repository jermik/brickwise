import { Action } from "@/lib/recommendations";

interface Props {
  action: Action;
  reason?: string;
  label?: string;
  size?: "sm" | "md";
}

const CONFIG = {
  Buy: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    color: "#15803d",
    dot: "#16a34a",
  },
  Hold: {
    bg: "#fafafa",
    border: "#e5e5e5",
    color: "#737373",
    dot: "#a3a3a3",
  },
  Avoid: {
    bg: "#fff1f2",
    border: "#fecdd3",
    color: "#be123c",
    dot: "#e11d48",
  },
};

export function RecommendationBadge({ action, reason, label, size = "md" }: Props) {
  const c = CONFIG[action];
  const sm = size === "sm";

  return (
    <div
      className="inline-flex flex-col"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 6,
        padding: sm ? "3px 8px" : "5px 10px",
        gap: reason && !sm ? 2 : 0,
      }}
    >
      <div className="flex items-center gap-1.5">
        <div
          className="rounded-full flex-shrink-0"
          style={{ width: 5, height: 5, background: c.dot }}
        />
        <span
          style={{
            fontSize: sm ? 10 : 11,
            fontWeight: 700,
            color: c.color,
            letterSpacing: "0.4px",
            textTransform: "uppercase",
          }}
        >
          {label ?? action}
        </span>
      </div>
      {reason && !sm && (
        <span
          style={{
            fontSize: 11,
            color: c.color,
            opacity: 0.85,
            lineHeight: 1.4,
            paddingLeft: 12,
          }}
        >
          {reason}
        </span>
      )}
    </div>
  );
}
