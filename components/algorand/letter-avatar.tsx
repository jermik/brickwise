// Gradient letter avatar used as a deterministic fallback when a project
// has no logoUrl, or when a remote logo fails to load. Premium look,
// brand-aligned. Zero network calls.

interface LetterAvatarProps {
  name: string;
  size?: number;
  rounded?: number;
}

// Stable hash → palette index. Same name always renders the same gradient.
function hashIndex(s: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % mod;
}

const PALETTES: { from: string; to: string }[] = [
  { from: "#3B82F6", to: "#1D4ED8" }, // electric blue (brand)
  { from: "#60A5FA", to: "#312E81" }, // indigo
  { from: "#0EA5E9", to: "#075985" }, // sky
  { from: "#06B6D4", to: "#155E75" }, // cyan
  { from: "#A78BFA", to: "#4C1D95" }, // violet
  { from: "#F472B6", to: "#9D174D" }, // pink
  { from: "#22C55E", to: "#14532D" }, // green
  { from: "#F59E0B", to: "#92400E" }, // amber
  { from: "#EF4444", to: "#7F1D1D" }, // red
  { from: "#E11D48", to: "#831843" }, // rose
];

export function LetterAvatar({ name, size = 56, rounded = 12 }: LetterAvatarProps) {
  const letter = (name.trim()[0] ?? "?").toUpperCase();
  const palette = PALETTES[hashIndex(name, PALETTES.length)];

  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`,
        color: "#FFFFFF",
        fontSize: Math.round(size * 0.42),
        fontWeight: 700,
        letterSpacing: "-0.04em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        userSelect: "none",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 2px rgba(0,0,0,0.18)",
      }}
    >
      {letter}
    </div>
  );
}
