import { ValueStatus } from "@/lib/types";
import { valueStatusColors, valueStatusLabel } from "@/lib/scoring";

interface ValueTagProps {
  status: ValueStatus;
}

export function ValueTag({ status }: ValueTagProps) {
  const { bg, text } = valueStatusColors(status);
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded"
      style={{ background: bg, color: text }}
    >
      {valueStatusLabel(status)}
    </span>
  );
}
