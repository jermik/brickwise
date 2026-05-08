import { AbsoluteFill } from "remotion";
import { BRAND, FONT_DISPLAY } from "../config/brand";

// ─────────────────────────────────────────────────────────────────────────
// Two square 1080x1080 stills for the @growthos.saas Instagram avatar.
// Rendered via `remotion still`, not part of any video composition.
//
// Both stay inside Instagram's circular crop (centred content, no
// edge-anchored details). Background is the brand near-black with a
// soft orange radial bloom centre — gives the mark a warm anchor at
// the small avatar size.
// ─────────────────────────────────────────────────────────────────────────

const SIDE = 1080;

export const ProfilePicConfig = {
  id: "profile-pic",
  fps: 30,
  width: SIDE,
  height: SIDE,
  durationFrames: 1,
} as const;

export const ProfilePicWordmarkConfig = {
  id: "profile-pic-wordmark",
  fps: 30,
  width: SIDE,
  height: SIDE,
  durationFrames: 1,
} as const;

const baseBg = (
  <AbsoluteFill
    style={{
      background: BRAND.bg,
      backgroundImage:
        "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.04) 32%, rgba(10,9,7,0) 70%)",
    }}
  />
);

/** Single bold "G" — reads cleanly at the 40 px feed-icon size. */
export function ProfilePic() {
  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {baseBg}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_DISPLAY,
        }}
      >
        <span
          style={{
            fontSize: 720,
            fontWeight: 800,
            color: BRAND.accent,
            letterSpacing: "-0.07em",
            lineHeight: 1,
            textShadow:
              "0 0 60px rgba(245,158,11,0.55), 0 0 140px rgba(245,158,11,0.28)",
          }}
        >
          G
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/** Stacked "GROWTH / OS" wordmark — better when displayed larger. */
export function ProfilePicWordmark() {
  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {baseBg}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: FONT_DISPLAY,
          letterSpacing: "-0.05em",
          lineHeight: 0.95,
          fontWeight: 800,
        }}
      >
        <span
          style={{
            fontSize: 232,
            color: BRAND.text,
            textShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          GROWTH
        </span>
        <span
          style={{
            fontSize: 232,
            color: BRAND.accent,
            textShadow:
              "0 0 32px rgba(245,158,11,0.55), 0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          OS
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
