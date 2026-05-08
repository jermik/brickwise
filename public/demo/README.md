# Demo footage

Drop the raw screen recording at `public/demo/raw-demo.mp4`.

The Remotion pipeline references this file via `staticFile("demo/raw-demo.mp4")`. Each template crops a different slice via `videoStartSec` / `videoEndSec`, so a single source MP4 is enough.

## Recommended capture settings

| Setting | Value |
|---|---|
| Resolution | 1920×1080 desktop or 1080×1920 portrait recording (anything; templates cover-fit) |
| Frame rate | 30 fps (matches the templates) |
| Codec | H.264 (`.mp4`) |
| Audio | Optional — templates render the demo muted and rely on captions / future voiceover |
| Length | ≥ 30 s. Templates need up to ~84 s of footage; loop the source if shorter. |

## What to record

A screen capture showing the full lead → audit → proposal → email path:

1. Open `/crm/discovery`, search "dentists" + "Rotterdam".
2. Click **Import + Audit** on a card.
3. The auto-audit runs — the panel renders with detections.
4. Click **Apply suggestions**, **Save audit**.
5. Click **Make Proposal**, scroll through the proposal package, the implementation prompt, the outreach emails.
6. Click **Send email** in the outreach section.

A single take with no cursor jitter works best. The templates pick zoom centres (`x`, `y` in `0..1` fractions) that target the centre of the canvas by default — adjust them in `video/src/templates/<Template>.tsx` once you know exactly where each interesting moment lands in your recording.
