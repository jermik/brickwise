import { RiskLevel } from "@/lib/types";
import { riskColor } from "@/lib/scoring";

interface RiskBadgeProps {
  risk: RiskLevel;
}

export function RiskBadge({ risk }: RiskBadgeProps) {
  const color = riskColor(risk);
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[#555]">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      {risk}
    </span>
  );
}
