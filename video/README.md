# Brickwise video pipeline

Local Remotion pipeline that turns the Brickwise screen recording + a content
script into vertical 1080×1920 short-form videos for TikTok / Reels / Shorts.
Local-only. No cloud rendering. No auto-posting.

## File layout

```
public/demo/raw-demo.mp4           ← drop your screen recording here
video/src/
  index.tsx                        ← Remotion entry (registerRoot)
  Root.tsx                         ← <Composition> registrations
  types.ts                         ← VideoConfig / SceneConfig / Subtitle
  config/brand.ts                  ← colours, fonts, easing
  components/
    DemoLayer.tsx                  ← <OffthreadVideo> wrapper
    SceneRenderer.tsx              ← walks scenes, applies zoom/highlight
    HookOverlay.tsx                ← opening title card
    AnimatedCaption.tsx            ← timed caption track
    ZoomBox.tsx                    ← smooth scale + transform-origin
    HighlightBox.tsx               ← animated rectangle highlight
    ProgressBar.tsx                ← thin orange retention bar
    CTACard.tsx                    ← end card
  templates/
    IFoundBadWebsites.tsx          ← 30 s — discovery hook
    LeadToOutreach90s.tsx          ← 90 s — full-flow walkthrough
    AISalesResearcher.tsx          ← 45 s — product narrative
  scripts/render-all.mjs           ← renders all 3 + a thumbnail PNG each
remotion.config.ts                 ← publicDir = ./public, etc.
out/                               ← rendered .mp4 + .thumb.png (gitignored)
```

## Add the footage

1. Record the demo (see `public/demo/README.md` for capture settings + a recommended take).
2. Save as `public/demo/raw-demo.mp4`.

## Add or edit a script

Each template owns its own subtitle track + scene markers in
`video/src/templates/<Template>.tsx`. The shape:

```ts
subtitles: [
  { startMs: 200,   endMs: 4_500, text: "I found 47 bad websites today" },
  { startMs: 5_000, endMs: 8_500, text: "All in one Rotterdam search." },
  // ...
],
```

`startMs` and `endMs` are milliseconds from the start of the composition (not
the source MP4). The component splits these into per-line `<Sequence>` so each
caption fades in independently.

## Configure timestamps + scene effects

Inside the same file, the `scenes` array drives zoom + highlight overlays:

```ts
scenes: [
  // Plain demo, no effect
  { startFrame: 0,        endFrame:  5 * FPS, effect: "neutral" },

  // Smooth zoom toward a point on the canvas
  {
    startFrame: 5 * FPS,
    endFrame: 14 * FPS,
    effect: "zoom",
    zoom: { x: 0.5, y: 0.36, scale: 1.18 },   // 50% across, 36% down, 18% closer
    bigCaption: "Search by niche + city",      // (currently unused — reserved)
  },

  // Animated rectangle highlight
  {
    startFrame: 14 * FPS,
    endFrame: 22 * FPS,
    effect: "highlight",
    highlight: { x: 0.06, y: 0.42, w: 0.88, h: 0.18 }, // fractions of 1080×1920
  },
],
```

`x`, `y`, `w`, `h` are fractions of the canvas — the same numbers work whatever
resolution you eventually pick. `FPS = 30` is constant in every template.

## Render

| Command | Does |
|---|---|
| `npm run video:preview` | Opens the Remotion Studio in your browser. Live-edits, scrubbing, prop tweaks. The fastest way to iterate on timings. |
| `npm run video:render -- IFoundBadWebsites out/i-found-bad-websites.mp4` | Renders one composition to MP4. Composition IDs come from `Root.tsx`. |
| `npm run video:render:all` | Renders all three templates + a thumbnail PNG per template into `out/`. |

The first render downloads Chromium (~150 MB, one-time) — that's expected.

### Thumbnail-only export

`render-all` already dumps a `*.thumb.png` next to each MP4. For ad-hoc still
exports:

```
npx remotion still video/src/index.tsx IFoundBadWebsites out/cover.png --frame=30
```

## Customising

- **Adjust pacing** — change `videoStartSec` / `videoEndSec` in a template's
  config to crop a different slice of the source MP4.
- **Reuse the source for different vibes** — clone a template, change the
  `hookText`, `subtitles`, and zoom centres. Register it in `Root.tsx`.
- **Brand tweaks** — edit `video/src/config/brand.ts`. All components read
  from the same token set.
- **Add a new platform format** — change `width` / `height` on the config and
  Remotion will render at that resolution. The fraction-based scene config
  scales automatically.

## Compliance / scope

- Local rendering only. Nothing is uploaded.
- No auto-posting; the operator opens the rendered MP4 and posts manually.
- No external AI video APIs.
- Captions and scripts are written by hand — sourced from the Brickwise
  content engine where useful, but always reviewed before render.
