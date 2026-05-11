interface ScoreBarProps {
  label: string;
  value?: number | null;
  color?: string;
}

function scoreColor(v: number): string {
  if (v >= 75) return "#10b981";
  if (v >= 50) return "#f59e0b";
  return "#f87171";
}

export function ScoreBar({ label, value, color }: ScoreBarProps) {
  const v = value ?? 0;
  const fill = color ?? scoreColor(v);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "rgba(242,237,230,0.55)" }}>
          {label}
        </span>
        <span className="font-mono text-xs font-medium" style={{ color: fill }}>
          {value != null ? `${v}/100` : "—"}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${v}%`, background: fill }}
        />
      </div>
    </div>
  );
}

export function ScoreRing({ value, size = 48 }: { value?: number | null; size?: number }) {
  const v = value ?? 0;
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (v / 100) * circ;
  const fill = scoreColor(v);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={fill}
          strokeWidth={3}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute font-mono text-[12px] font-semibold"
        style={{ color: value != null ? fill : "rgba(242,237,230,0.3)" }}
      >
        {value != null ? v : "—"}
      </span>
    </div>
  );
}
