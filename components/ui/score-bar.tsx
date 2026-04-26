import { scoreColor } from "@/lib/scoring";

interface ScoreBarProps {
  label: string;
  score: number;
}

export function ScoreBar({ label, score }: ScoreBarProps) {
  const color = scoreColor(score);
  return (
    <div className="mb-3.5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-[#737373]">{label}</span>
        <span
          className="text-xs font-medium"
          style={{ fontFamily: "var(--font-dm-mono)", color }}
        >
          {score}
        </span>
      </div>
      <div className="h-[3px] rounded-full bg-[#ebebeb]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}
