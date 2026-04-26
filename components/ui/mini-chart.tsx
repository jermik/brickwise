"use client";

interface DataPoint {
  month: string;
  value: number;
}

interface MiniChartProps {
  data: DataPoint[];
  showLabels?: boolean;
}

export function MiniChart({ data, showLabels = true }: MiniChartProps) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const W = 300;
  const H = 56;

  const x = (i: number) => (i / (values.length - 1)) * W;
  const y = (v: number) => H - ((v - min) / (max - min || 1)) * (H - 4) - 2;

  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${points} ${W},${H} 0,${H}`;
  const lastX = x(values.length - 1);
  const lastY = y(values[values.length - 1]);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: 56, overflow: "visible" }}
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#chartGrad)" />
        <polyline
          points={points}
          fill="none"
          stroke="#16a34a"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={lastX} cy={lastY} r="3" fill="#16a34a" />
      </svg>
      {showLabels && (
        <div className="flex justify-between mt-1.5">
          {data.map((d) => (
            <span
              key={d.month}
              className="text-[10px] text-[#ccc]"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {d.month}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
