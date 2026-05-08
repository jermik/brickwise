import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { BRAND } from "../../config/brand";
import { LogoLockup } from "./LogoLockup";
import { KineticText } from "./KineticText";
import { FakeDashboard } from "./FakeDashboard";
import { WhooshFlash } from "./WhooshFlash";
import { AnimatedGrid } from "./AnimatedGrid";

/**
 * High-retention 6-second SaaS-TikTok hook for GrowthOSCut.
 *
 * Density principle: never let the eye settle. 4 text + 1 dashboard
 * beat + 5 mini-flashes between them + a constantly-scrolling grid
 * keeps the second half (3–6 s) as energetic as the first half.
 *
 * Beat map @ 30 FPS (180 frames):
 *
 *   0.00 → 0.73   LogoLockup            GROWTHOS letter slam
 *   0.65 → 0.80   mini-flash             4-frame orange whoosh
 *   0.73 → 1.67   KineticText            "AGENCIES."
 *   1.55 → 1.70   mini-flash
 *   1.67 → 2.60   KineticText (accent)   "WASTE HOURS."
 *   2.45 → 2.60   mini-flash
 *   2.60 → 3.67   KineticText            "FINDING LEADS."
 *   3.50 → 3.67   mini-flash
 *   3.67 → 5.60   FakeDashboard           live "47 sites scanned" with
 *                                         a count-up ticker on the stat
 *                                         (extended to fill the closing
 *                                         beat — the previous "AUTOMATIC."
 *                                         slam was removed for feeling
 *                                         buzzwordy)
 *   4.80 → 5.00   mini-flash
 *   5.60 → 6.00   WhooshFlash             closing transition into footage
 *
 * AnimatedGrid runs the entire 6 s underneath so even quiet frames
 * have motion. No real footage. No voice (parent template plays
 * intro-voice.mp3 over 0–3 s).
 */
export function HookSequence() {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);

  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      {/* Constant background motion — runs the full 6 s */}
      <AnimatedGrid />

      <Sequence from={f(0.0)} durationInFrames={f(0.73)}>
        <LogoLockup fadeOutAt={f(0.73) - 4} />
      </Sequence>

      <MiniFlash startSec={0.65} fps={fps} />

      <Sequence from={f(0.73)} durationInFrames={f(0.94)}>
        <KineticText lines={["AGENCIES."]} fadeOutAt={f(0.94) - 3} />
      </Sequence>

      <MiniFlash startSec={1.55} fps={fps} />

      <Sequence from={f(1.67)} durationInFrames={f(0.93)}>
        <KineticText
          lines={["WASTE", "HOURS."]}
          accentIndex={1}
          staggerFrames={4}
          fadeOutAt={f(0.93) - 3}
        />
      </Sequence>

      <MiniFlash startSec={2.45} fps={fps} />

      <Sequence from={f(2.6)} durationInFrames={f(1.07)}>
        <KineticText
          lines={["FINDING", "LEADS."]}
          staggerFrames={4}
          fadeOutAt={f(1.07) - 3}
        />
      </Sequence>

      <MiniFlash startSec={3.5} fps={fps} />

      <Sequence from={f(3.67)} durationInFrames={f(1.93)}>
        <FakeDashboard fadeOutAt={f(1.93) - 4} />
      </Sequence>

      <MiniFlash startSec={4.8} fps={fps} />

      {/* Closing whoosh — bigger than the mini-flashes, transitions
          straight from the dashboard into the real footage. */}
      <Sequence from={f(5.6)} durationInFrames={f(0.4)}>
        <WhooshFlash durationFrames={f(0.4)} />
      </Sequence>
    </AbsoluteFill>
  );
}

/**
 * 4-frame orange whoosh sliver between text beats. Subtle on its own,
 * but stacked across the timeline they create the feeling of a beat-
 * synced edit.
 */
function MiniFlash({ startSec, fps }: { startSec: number; fps: number }) {
  const startFrame = Math.round(startSec * fps);
  const dur = 4;
  return (
    <Sequence from={startFrame} durationInFrames={dur}>
      <WhooshFlash durationFrames={dur} />
    </Sequence>
  );
}
