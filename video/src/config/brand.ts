// Brickwise brand tokens for video. Mirrors the dark dashboard look:
// near-black backdrop, soft-cream text, single orange accent.

export const BRAND = {
  bg: "#0A0907",
  surface: "#131109",
  text: "#F2EDE6",
  textMuted: "rgba(242, 237, 230, 0.7)",
  textFaint: "rgba(242, 237, 230, 0.4)",
  border: "#2A2420",
  accent: "#f59e0b",
  accentSoft: "rgba(245, 158, 11, 0.18)",
  accentBorder: "rgba(245, 158, 11, 0.4)",
  good: "#10b981",
  bad: "#f87171",
} as const;

/** Spring easing tuned for short-form social pacing. */
export const EASE = {
  damping: 200,
  stiffness: 220,
  mass: 0.6,
} as const;

export const FONT_DISPLAY =
  "'Geist Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
export const FONT_MONO =
  "'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
