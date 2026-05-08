import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { BRAND } from "../../config/brand";
import { LogoLockup } from "./LogoLockup";
import { KineticText } from "./KineticText";
import { FakeDashboard } from "./FakeDashboard";
import { WhooshFlash } from "./WhooshFlash";

/**
 * High-retention 6-second SaaS-TikTok hook for GrowthOSCut.
 *
 * Beat map @ 30 FPS (180 frames). Tight, money-focused, six beats so
 * the eye keeps moving for the first six seconds:
 *
 *   0.00 → 0.73 s   LogoLockup           GROWTHOS letter slam
 *   0.73 → 1.67 s   KineticText          "AGENCIES."
 *   1.67 → 2.60 s   KineticText (accent) "WASTE HOURS."
 *   2.60 → 3.67 s   KineticText          "FINDING LEADS."
 *   3.67 → 4.93 s   FakeDashboard         live "47 sites scanned"
 *   4.93 → 6.00 s   KineticText (accent) "AUTOMATIC."
 *   5.60 → 6.00 s   WhooshFlash overlay   orange transition out
 *
 * No real footage. No voice (the parent template plays
 * intro-voice.mp3 over 0..3s). Audience: web design agencies /
 * freelancers — the message is "stop doing this manually."
 */
export function HookSequence() {
  const { fps } = useVideoConfig();
  const f = (sec: number) => Math.round(sec * fps);

  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      <Sequence from={f(0.0)} durationInFrames={f(0.73)}>
        <LogoLockup fadeOutAt={f(0.73) - 4} />
      </Sequence>

      <Sequence from={f(0.73)} durationInFrames={f(0.94)}>
        <KineticText lines={["AGENCIES."]} fadeOutAt={f(0.94) - 3} />
      </Sequence>

      <Sequence from={f(1.67)} durationInFrames={f(0.93)}>
        <KineticText
          lines={["WASTE", "HOURS."]}
          accentIndex={1}
          staggerFrames={4}
          fadeOutAt={f(0.93) - 3}
        />
      </Sequence>

      <Sequence from={f(2.6)} durationInFrames={f(1.07)}>
        <KineticText
          lines={["FINDING", "LEADS."]}
          staggerFrames={4}
          fadeOutAt={f(1.07) - 3}
        />
      </Sequence>

      <Sequence from={f(3.67)} durationInFrames={f(1.26)}>
        <FakeDashboard fadeOutAt={f(1.26) - 4} />
      </Sequence>

      <Sequence from={f(4.93)} durationInFrames={f(1.07)}>
        <KineticText
          lines={["AUTOMATIC."]}
          accentIndex={0}
          fadeOutAt={f(1.07) - 2}
        />
      </Sequence>

      {/* Orange whoosh overlays the very tail of the last beat. */}
      <Sequence from={f(5.6)} durationInFrames={f(0.4)}>
        <WhooshFlash durationFrames={f(0.4)} />
      </Sequence>
    </AbsoluteFill>
  );
}
