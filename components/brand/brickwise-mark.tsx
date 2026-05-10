// Brickwise mark — reusable React component.
// Drop anywhere: sidebar, navbar, login screen, hero, footer.
//
// Variants:
//   "dark"  (default) — for dark UI (CRM, dashboard, hero)
//   "light"            — for cream/white surfaces
//   "mono"             — pure monochrome for print/single-color contexts
//
// Sizes via the `size` prop (px). Default 32.
//
// The component is pure SVG (no client JS), safe in Server Components.

import type { CSSProperties } from "react";

interface BrickwiseMarkProps {
  size?: number;
  variant?: "dark" | "light" | "mono";
  withWordmark?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function BrickwiseMark({
  size = 32,
  variant = "dark",
  withWordmark = false,
  className,
  style,
}: BrickwiseMarkProps) {
  const id = `bm-${variant}`;

  const palette =
    variant === "dark"
      ? {
          bg: ["#0E0E16", "#05050B"] as const,
          cell: ["#FFFFFF", "#D6DBE6"] as const,
          accent: ["#60A5FA", "#1D4ED8"] as const,
        }
      : variant === "light"
      ? {
          bg: ["#FAFAF9", "#FAFAF9"] as const,
          cell: ["#1A1B22", "#0A0A12"] as const,
          accent: ["#60A5FA", "#1D4ED8"] as const,
        }
      : {
          bg: ["#0A0A12", "#0A0A12"] as const,
          cell: ["#FFFFFF", "#FFFFFF"] as const,
          accent: ["#FFFFFF", "#FFFFFF"] as const,
          accentOpacity: 0.55,
        };

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: withWordmark ? size * 0.35 : 0,
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Brickwise"
        role="img"
      >
        <defs>
          <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.bg[0]} />
            <stop offset="100%" stopColor={palette.bg[1]} />
          </linearGradient>
          <linearGradient id={`${id}-accent`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.accent[0]} />
            <stop offset="100%" stopColor={palette.accent[1]} />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill={`url(#${id}-bg)`} />
        <rect x="3"  y="21" width="8" height="8" rx="1.6" fill={palette.cell[0]} />
        <rect x="12" y="21" width="8" height="8" rx="1.6" fill={palette.cell[0]} />
        <rect x="21" y="21" width="8" height="8" rx="1.6" fill={palette.cell[0]} />
        <rect x="3"  y="12" width="8" height="8" rx="1.6" fill={palette.cell[0]} />
        <rect x="12" y="12" width="8" height="8" rx="1.6" fill={palette.cell[0]} />
        <rect
          x="3"
          y="3"
          width="8"
          height="8"
          rx="1.6"
          fill={`url(#${id}-accent)`}
          opacity={variant === "mono" ? 0.55 : undefined}
        />
      </svg>
      {withWordmark && (
        <span
          style={{
            fontSize: size * 0.62,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: variant === "light" ? "#0A0A12" : "#FFFFFF",
          }}
        >
          Brickwise
        </span>
      )}
    </span>
  );
}
