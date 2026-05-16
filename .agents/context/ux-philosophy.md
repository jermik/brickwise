# Brickwise UX Philosophy

*How we build the product. Load before any UI/UX work.*

## Core principles

1. **Scoring is the hero.** Every property and city page surfaces the composite score in the first viewport. Everything else supports it.
2. **Methodology is visible, not hidden.** The 30/25/20/25 weight breakdown is one click away from every score. No "learn more" black boxes.
3. **No signup walls on public data.** All 460+ property scores, rankings, and city pages are free, no email gate.
4. **Email capture is contextual, not modal-spammy.** One sticky bar, one inline form, one footer form. No exit-intent pop-ups.
5. **Speed beats polish.** Pages must SSR fast and render the score in the first paint. Cold-start latency on cards is a bug, not a tradeoff.
6. **Data freshness is shown, not assumed.** Every score displays its last-refreshed date.

## Visual rules
- Trust-first aesthetic: spare, type-led, numeric tables welcome
- No stock-photo investors-shaking-hands imagery
- No crypto neon-purple gradients
- No hero illustrations of skyscrapers or coins
- Charts plain and readable on mobile, no 3D anything
- Score badges color-coded with explicit thresholds, not vibes

## Interaction rules
- Buy signal labels link to the methodology that produced them
- Risk factors are listed inline with the score, not in a tooltip
- Tables sortable by yield, score, fair-value gap, city
- Affiliate clicks marked as such (small "(affiliate)" or "(referral)" label)
- Mobile-first; desktop is a progressive enhancement

## What we do not do
- Hide complexity behind "AI summaries"
- Use motion as a distraction from data density
- Add gamification (streaks, badges, levels)
- Add a "social" layer
- Add comments under property pages
- Build watchlists that require login (yet — only after retention is proven)

## Indexability is sacred
Every public page must SSR with H1, meta, OG image, and JSON-LD intact. Routes that need auth go behind the app shell, never the public shell. See `project_brickwise_appshell_seo_gotcha` memory.
