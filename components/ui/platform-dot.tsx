import { Platform } from "@/lib/types";
import { platformColor } from "@/lib/scoring";

interface PlatformDotProps {
  platform: Platform;
  light?: boolean;
}

export function PlatformDot({ platform, light }: PlatformDotProps) {
  const color = platformColor(platform);
  return (
    <span
      className="inline-flex items-center gap-1"
      style={{
        fontSize: 11,
        color: light ? "rgba(255,255,255,0.85)" : "#a3a3a3",
      }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{ width: 5, height: 5, background: color, display: "inline-block" }}
      />
      {platform}
    </span>
  );
}
