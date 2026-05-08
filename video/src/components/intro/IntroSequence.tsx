import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { BRAND } from "../../config/brand";
import { LogoLockup } from "./LogoLockup";
import { KineticText } from "./KineticText";
import { FakeDashboard } from "./FakeDashboard";
import { WhooshFlash } from "./WhooshFlash";

/**
 * 6-second motion-graphic intro for GrowthOSShort.
 *
 * Beat map @ 30 FPS:
 *   0.0s  →  1.2s    LogoLockup       (GROWTHOS slams in letter-by-letter)
 *   1.2s  →  2.6s    KineticText      ("BAD WEBSITES." with accent line)
 *   2.6s  →  4.6s    FakeDashboard    (live discovery results animate in)
 *   4.6s  →  5.8s    KineticText      ("AUTOMATICALLY." accented)
 *   5.6s  →  6.0s    WhooshFlash      (orange transition into real footage)
 *
 * Background sits on BRAND.bg for the whole 6s; each beat is its own
 * <Sequence> so its frame counter resets. No real footage is used.
 */
export function IntroSequence() {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);

  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      <Sequence from={f(0.0)} durationInFrames={f(1.2)}>
        <LogoLockup fadeOutAt={f(1.2) - 4} />
      </Sequence>

      <Sequence from={f(1.2)} durationInFrames={f(1.4)}>
        <KineticText
          lines={["BAD", "WEBSITES."]}
          accentIndex={1}
          fadeOutAt={f(1.4) - 4}
        />
      </Sequence>

      <Sequence from={f(2.6)} durationInFrames={f(2.0)}>
        <FakeDashboard fadeOutAt={f(2.0) - 4} />
      </Sequence>

      <Sequence from={f(4.6)} durationInFrames={f(1.2)}>
        <KineticText
          lines={["AUTOMATICALLY."]}
          accentIndex={0}
          fadeOutAt={f(1.2) - 2}
        />
      </Sequence>

      {/* Final whoosh — overlays whatever's beneath in the last 0.4s. */}
      <Sequence from={f(5.6)} durationInFrames={f(0.4)}>
        <WhooshFlash durationFrames={f(0.4)} />
      </Sequence>
    </AbsoluteFill>
  );
}
