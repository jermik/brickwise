import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND, FONT_DISPLAY, FONT_MONO } from "../../config/brand";

const ROWS: { name: string; flag: string; severity: "bad" | "warn" }[] = [
  { name: "Dental Park Rotterdam",  flag: "no mobile",     severity: "bad" },
  { name: "Salon Liefde",           flag: "slow site",     severity: "bad" },
  { name: "BarberShop A'dam",       flag: "no CTA",        severity: "warn" },
  { name: "Vivo Pizza Utrecht",     flag: "broken form",   severity: "bad" },
  { name: "GymCity",                flag: "old design",    severity: "warn" },
  { name: "Notarus B.V.",           flag: "no schema",     severity: "warn" },
];

interface FakeDashboardProps {
  /** Frame at which the dashboard starts fading out (relative to its <Sequence>). */
  fadeOutAt?: number;
}

/**
 * Stylised "Discovery results" panel. Looks like a real dashboard
 * snapshot with rows of businesses + audit flags appearing in a
 * stagger. Anchored by an orange "47 SITES SCANNED" stat bar at the
 * top so the viewer instantly understands what's happening.
 */
export function FakeDashboard({ fadeOutAt = 999_999 }: FakeDashboardProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = interpolate(
    frame,
    [fadeOutAt - 6, fadeOutAt],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        padding: 64,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        opacity: fade,
        fontFamily: FONT_DISPLAY,
      }}
    >
      <Header frame={frame} fps={fps} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {ROWS.map((row, i) => (
          <Row key={row.name} row={row} index={i} frame={frame} fps={fps} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

function Header({ frame, fps }: { frame: number; fps: number }) {
  const enter = spring({ frame, fps, durationInFrames: 16, config: { damping: 200, stiffness: 320, mass: 0.45 } });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 24px",
        borderRadius: 18,
        background: "rgba(245,158,11,0.08)",
        border: `1px solid ${BRAND.accentBorder}`,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [-20, 0])}px)`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 22,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: BRAND.accent,
        }}
      >
        Discovery — live
      </span>
      <span
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 56,
          fontWeight: 800,
          color: BRAND.accent,
          letterSpacing: "-0.04em",
        }}
      >
        47 sites scanned
      </span>
    </div>
  );
}

function Row({
  row,
  index,
  frame,
  fps,
}: {
  row: (typeof ROWS)[number];
  index: number;
  frame: number;
  fps: number;
}) {
  const local = frame - 8 - index * 4;
  const enter = spring({
    frame: local,
    fps,
    durationInFrames: 14,
    config: { damping: 200, stiffness: 360, mass: 0.5 },
  });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const tx = interpolate(enter, [0, 1], [-30, 0]);

  const colour = row.severity === "bad" ? BRAND.bad : BRAND.accent;
  const icon = row.severity === "bad" ? "✕" : "⚠";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "16px 22px",
        borderRadius: 14,
        background: BRAND.surface,
        border: `1px solid ${BRAND.border}`,
        opacity,
        transform: `translateX(${tx}px)`,
        willChange: "transform, opacity",
      }}
    >
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${colour}1a`,
          color: colour,
          fontWeight: 800,
          fontSize: 24,
        }}
      >
        {icon}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 30,
          fontWeight: 600,
          color: BRAND.text,
          letterSpacing: "-0.02em",
        }}
      >
        {row.name}
      </span>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 22,
          color: colour,
          textTransform: "lowercase",
        }}
      >
        {row.flag}
      </span>
    </div>
  );
}
