import { Sequence } from "remotion";
import type { VideoConfig } from "../types";
import { DemoLayer } from "./DemoLayer";
import { ZoomBox } from "./ZoomBox";
import { HighlightBox } from "./HighlightBox";

interface SceneRendererProps {
  config: VideoConfig;
}

/**
 * Walks `config.scenes`, wrapping the underlying demo footage in the
 * right zoom / highlight per scene. One <Sequence> per scene so each
 * scene's `useCurrentFrame()` is local — required for the zoom/pulse
 * springs to start at 0.
 */
export function SceneRenderer({ config }: SceneRendererProps) {
  return (
    <>
      {config.scenes.map((scene, i) => (
        <Sequence
          key={i}
          from={scene.startFrame}
          durationInFrames={Math.max(1, scene.endFrame - scene.startFrame)}
        >
          {scene.effect === "zoom" && scene.zoom ? (
            <ZoomBox focus={scene.zoom}>
              <DemoLayer config={config} />
            </ZoomBox>
          ) : (
            <DemoLayer config={config} />
          )}
          {scene.effect === "highlight" && scene.highlight && (
            <HighlightBox rect={scene.highlight} />
          )}
        </Sequence>
      ))}
    </>
  );
}
