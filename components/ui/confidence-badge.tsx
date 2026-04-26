import { Confidence } from "@/lib/recommendations";

const CONFIG = {
  High: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    color: "#15803d",
    dot: "#16a34a",
    label: "High confidence",
  },
  Medium: {
    bg: "#fffbeb",
    border: "#fde68a",
    color: "#92400e",
    dot: "#d97706",
    label: "Medium confidence",
  },
  Low: {
    bg: "#fafafa",
    border: "#e5e5e5",
    color: "#737373",
    dot: "#a3a3a3",
    label: "Low confidence",
  },
};

export function ConfidenceBadge({
  confidence,
  showReason = true,
}: {
  confidence: Confidence;
  showReason?: boolean;
}) {
  const c = CONFIG[confidence.level];
  return (
    <div
      className="inline-flex flex-col"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 6,
        padding: showReason ? "4px 9px" : "3px 8px",
        gap: showReason ? 2 : 0,
      }}
    >
      <div className="flex items-center gap-1.5">
        <div
          className="rounded-full flex-shrink-0"
          style={{ width: 5, height: 5, background: c.dot }}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: c.color,
            letterSpacing: "0.4px",
            textTransform: "uppercase",
          }}
        >
          {c.label}
        </span>
      </div>
      {showReason && (
        <span
          style={{
            fontSize: 10,
            color: c.color,
            opacity: 0.8,
            paddingLeft: 12,
            lineHeight: 1.35,
          }}
        >
          {confidence.reason}
        </span>
      )}
    </div>
  );
}
