"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Property } from "@/lib/types";
import { getRecommendation } from "@/lib/recommendations";

interface ChartViewProps {
  properties: Property[];
}

const W = 800, H = 460;
const ML = 52, MR = 24, MT = 24, MB = 52;
const CW = W - ML - MR;
const CH = H - MT - MB;

function xPos(yld: number, maxYld: number) {
  return ML + (yld / maxYld) * CW;
}
function yPos(score: number) {
  return MT + CH - (score / 100) * CH;
}
function dotR(p: Property) {
  const v = p.tokenPrice * p.totalTokens;
  return Math.max(5, Math.min(20, 3 + Math.log10(Math.max(v, 10)) * 2.8));
}
function dotColor(action: string) {
  if (action === "Buy") return "#22c55e";
  if (action === "Hold") return "#f59e0b";
  return "#ef4444";
}

export function ChartView({ properties }: ChartViewProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState<{ p: Property; cx: number; cy: number } | null>(null);

  const maxYld = Math.ceil(Math.max(...properties.map((p) => p.expectedYield), 10) / 2) * 2;
  const xTicks = Array.from({ length: maxYld / 2 + 1 }, (_, i) => i * 2);
  const yTicks = [0, 25, 50, 75, 100];

  const recs = new Map(properties.map((p) => [p.id, getRecommendation(p, properties)]));

  return (
    <div className="rounded-[10px] overflow-hidden" style={{ background: "#fff", border: "1px solid #ebebeb" }}>
      <div className="px-5 pt-4 pb-1 flex items-center justify-between">
        <div>
          <div className="text-[13px] font-semibold" style={{ color: "#111" }}>Yield vs. Quality</div>
          <div className="text-[11px]" style={{ color: "#a3a3a3" }}>Bubble size = total property value · click any dot to open</div>
        </div>
        <div className="flex items-center gap-4">
          {(["Buy", "Hold", "Avoid"] as const).map((a) => (
            <div key={a} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: dotColor(a), opacity: 0.8 }} />
              <span className="text-[11px]" style={{ color: "#737373" }}>{a}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative px-2 pb-2">
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          {/* Grid */}
          {yTicks.map((t) => (
            <line key={`y${t}`} x1={ML} y1={yPos(t)} x2={W - MR} y2={yPos(t)} stroke="#f0f0f0" strokeWidth="1" />
          ))}
          {xTicks.map((t) => (
            <line key={`x${t}`} x1={xPos(t, maxYld)} y1={MT} x2={xPos(t, maxYld)} y2={H - MB} stroke="#f0f0f0" strokeWidth="1" />
          ))}

          {/* Axes */}
          <line x1={ML} y1={MT} x2={ML} y2={H - MB} stroke="#d4d4d4" strokeWidth="1.5" />
          <line x1={ML} y1={H - MB} x2={W - MR} y2={H - MB} stroke="#d4d4d4" strokeWidth="1.5" />

          {/* Y axis labels */}
          {yTicks.map((t) => (
            <text key={`yl${t}`} x={ML - 8} y={yPos(t) + 4} textAnchor="end" fontSize="10" fill="#a3a3a3">{t}</text>
          ))}

          {/* X axis labels */}
          {xTicks.filter((t) => t % 2 === 0).map((t) => (
            <text key={`xl${t}`} x={xPos(t, maxYld)} y={H - MB + 16} textAnchor="middle" fontSize="10" fill="#a3a3a3">{t}%</text>
          ))}

          {/* Axis titles */}
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="11" fill="#737373" fontWeight="500">Expected Yield (%)</text>
          <text x={10} y={H / 2} textAnchor="middle" fontSize="11" fill="#737373" fontWeight="500" transform={`rotate(-90,10,${H / 2})`}>Overall Score</text>

          {/* Dots */}
          {properties.map((p) => {
            const rec = recs.get(p.id)!;
            const cx = xPos(p.expectedYield, maxYld);
            const cy = yPos(p.overallScore);
            const r = dotR(p);
            const color = dotColor(rec.action);
            const isHov = hovered?.p.id === p.id;
            return (
              <circle
                key={p.id}
                cx={cx} cy={cy} r={isHov ? r + 2 : r}
                fill={color} fillOpacity={isHov ? 0.95 : 0.7}
                stroke={color} strokeWidth={isHov ? 2 : 1} strokeOpacity={0.9}
                style={{ cursor: "pointer", transition: "r 0.1s, fill-opacity 0.1s" }}
                onMouseEnter={() => setHovered({ p, cx, cy })}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/property/${p.id}`)}
              />
            );
          })}

          {/* Tooltip */}
          {hovered && (() => {
            const { p, cx, cy } = hovered;
            const rec = recs.get(p.id)!;
            const tw = 190, th = 90;
            const tx = cx + dotR(p) + 8 + tw > W ? cx - dotR(p) - tw - 8 : cx + dotR(p) + 8;
            const ty = Math.max(MT, Math.min(cy - 20, H - MB - th));
            return (
              <g>
                <rect x={tx} y={ty} width={tw} height={th} rx="6" fill="white" stroke="#e5e5e5" strokeWidth="1" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.1))" />
                <text x={tx + 10} y={ty + 18} fontSize="11" fontWeight="600" fill="#111">{p.name.length > 22 ? p.name.slice(0, 22) + "…" : p.name}</text>
                <text x={tx + 10} y={ty + 32} fontSize="10" fill="#737373">{p.flag} {p.city} · {p.platform}</text>
                <text x={tx + 10} y={ty + 50} fontSize="10" fill="#a3a3a3">Yield</text>
                <text x={tx + 44} y={ty + 50} fontSize="11" fontWeight="600" fill="#22c55e">{p.expectedYield}%</text>
                <text x={tx + 80} y={ty + 50} fontSize="10" fill="#a3a3a3">Score</text>
                <text x={tx + 116} y={ty + 50} fontSize="11" fontWeight="600" fill="#111">{p.overallScore}</text>
                <text x={tx + 10} y={ty + 66} fontSize="10" fill="#a3a3a3">Monthly</text>
                <text x={tx + 55} y={ty + 66} fontSize="11" fontWeight="600" fill="#111">€{p.monthlyRent}</text>
                <text x={tx + 100} y={ty + 66} fontSize="10" fill="#a3a3a3">Token</text>
                <text x={tx + 134} y={ty + 66} fontSize="11" fontWeight="600" fill="#111">€{p.tokenPrice.toFixed(0)}</text>
                <rect x={tx + 10} y={ty + 74} width={50} height={12} rx="3" fill={`${dotColor(rec.action)}20`} />
                <text x={tx + 35} y={ty + 83} textAnchor="middle" fontSize="9" fontWeight="700" fill={dotColor(rec.action)}>{rec.action}</text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}
