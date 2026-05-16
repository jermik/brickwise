# Brickwise self-arbitrage — 30-day execution plan

**Date:** 2026-05-14
**Owner:** Mikey
**Capital envelope:** €10-50k (start €10k pilot, scale on evidence)
**Thesis:** Brickwise computes a 4-component score + fair-value flag across ~Lofty/RealT properties. Deploy own capital against own signal. Founders of analytical tools dogfood them (Bloomberg, Koyfin, S3 Partners). This is information asymmetry you legally created.

## Pre-flight reality check (from codebase audit 2026-05-14)

| Thing | State | Capital-deployment impact |
|---|---|---|
| Composite score (yield 30% + risk 25% + neighborhood 20% + value 25%) | Live, 0-100 per property | Signal exists |
| Buy/Hold/Avoid gates in `/lib/recommendations.ts` | Live | Decision logic exists |
| `fairValueStatus` flag (undervalued/fair/overpriced) | Live, currently 2 undervalued (both Detroit) | **Single-city signal — concentration risk** |
| Lofty + RealT live API ingestion | **NOT integrated.** Manual JSON refresh, 3-7 day lag | **Blocks fast trades — stale data risk** |
| Marketplace / DEX data (Algorand DEX, Levinswap) | **None.** No bid/ask, no volume, no spread | **Blocks liquidity-aware entry/exit** |
| Watchlist + portfolio tracking | Live, localStorage-only | Adequate for personal book |
| Public methodology page | Live at `/methodology` | Transparency moat exists |

**Verdict:** Don't deploy capital before closing the data freshness + liquidity gaps. Otherwise you're trading on signal the marketplace already priced in.

---

## Week 1 — Close the staleness gap

Goal: replace manual JSON refresh with live data pulls. Reduces lag from 3-7 days to <24h.

- **Lofty** — Algorand indexer (`algoindexer.algoexplorerapi.io`) for token prices + holder counts. Lofty does NOT have a documented public REST API for property metadata. Two paths:
  - (a) Scrape `lofty.ai` property pages on a daily cron (legal: public data, robots.txt permitting). Cache locally.
  - (b) Reach out to Lofty for API access. Pitch as a partner integration. Your Brickwise volume is potential mutual benefit.
- **RealT** — RealT has a community-maintained API at `api.realt.community` returning per-token rent, occupancy, NAV. Cron-pull daily.
- Add `data_freshness_at` field per property. Surface staleness warning in UI if >48h.
- Validate the 2 current Detroit "undervalued" flags against current Lofty marketplace before deploying anything.

**Time:** 15-25 hours engineering. Mostly cron + JSON parsers.

## Week 2 — Add liquidity overlay

Goal: detect whether a Buy signal is tradable at scale.

- **Lofty / Algorand:** Tinyman v2 SDK or Pact Finance API for orderbook depth on Lofty tokens. Compute: 24h volume, bid/ask spread, depth at ±2% from mid.
- **RealT / xDai (Gnosis):** Levinswap subgraph (The Graph) for pool reserves + 24h volume.
- Compute new field: `liquidityScore` (0-100) based on (volume / 24h) × (1 / spread).
- Downgrade Buy → Hold for any property where `liquidityScore < 30` OR `spread > 3%`.
- This is the actual edge: most retail buyers ignore liquidity. You'll skip the "looks undervalued but you'd move the market on exit" trap.

**Time:** 20-30 hours.

## Week 3 — Position rules + €10k pilot

Goal: deploy first capital. Hard rules, no discretion.

**Entry rules:**
- `overallScore ≥ 78` AND `fairValueStatus = undervalued` AND `liquidityScore ≥ 40` AND `spread ≤ 2.5%`
- Max position: **5% of capital envelope** (€500 at €10k stage)
- Max city concentration: 25% (avoid Detroit-only book)
- Max platform concentration: 70% (don't go 100% Lofty or 100% RealT)
- Min holding period: 30 days (no day-trading)

**Exit rules:**
- `fairValueStatus` flips to "overpriced" → trim 50%
- `overallScore` drops ≥10 points from entry → exit fully
- Occupancy drops below 80% → exit fully
- Yield drops below 6% AND `fairValueStatus` is no longer undervalued → exit fully

**Tax structure (NL-specific):**
- If holding personally: Box 3 vermogensrendementsheffing (~2.0-2.5% notional return tax on capital value Jan 1)
- If holding via Houdster-BV: Box 2 dividend tax (~25-26.9%) on extraction
- USD/EUR forex: tokens are USD-denominated; account for FX swings
- Lofty issues 1099 to US-domiciled investors. As NL resident: W-8BEN form to avoid US withholding. RealT structure differs (xDai chain, often no 1099)

**Action:** Set up a separate Lofty + RealT account specifically for the Brickwise house book. Don't co-mingle with personal speculation. Clean accounting from day one.

## Week 4 — Public house book + content flywheel

Goal: turn capital deployment into Brickwise content + credibility.

- Add `/house-book` page on brickwise.pro showing: positions held, entry signals, exit triggers, P&L (with delayed disclosure: positions visible only 7-14 days after entry to prevent front-running).
- Disclosure language: "This is Brickwise's own portfolio. Not financial advice. Educational only."
- Weekly post: "What Brickwise bought this week and why" — content moat, SEO boost, builds trust with paying users.
- Tracks against published methodology — proves the signal works (or shows when it doesn't, which is also content).

This is the meta-edge: most analytics tools never put their own money behind their signal. Doing so + publishing the book becomes the differentiator vs every other "tokenized RE platform comparison site."

---

## Risk register

| Risk | Mitigation |
|---|---|
| Detroit concentration in current undervalued flags | Expand coverage. Don't deploy >25% of capital to any one city. |
| Lofty / RealT secondary market illiquidity | Liquidity overlay (Week 2) is the gate. Skip illiquid tokens entirely. |
| Manual data updates miss platform changes (delistings, rent revisions) | Live API pulls (Week 1). `data_freshness_at` warning in UI. |
| NL tax exposure misclassified | Talk to your boekhouder identity (you). Houdster-BV may be cleaner above €50k. |
| Conflict of interest with paying Brickwise users | Public disclosure + delayed visibility. Build trust, not hide. |
| Signal degradation over time as more users follow Brickwise | Track signal alpha decay monthly. If retail catches up, the alpha goes to zero. Hedge by improving signal continuously. |

## Capital scaling rules

- **€10k pilot (Week 3-4):** prove rules work in live trading. Track signal vs realized return.
- **€10k → €25k:** require positive risk-adjusted return after 60 days (Sharpe > 1.0)
- **€25k → €50k:** require 90 days of clean execution + at least one Buy → exit cycle that confirmed the signal
- **€50k+ ceiling for personal-name holding.** Above that, restructure to BV for tax efficiency.

## Success metrics (60-day review)

- Realized IRR vs comparable Lofty/RealT index buy-and-hold
- Signal hit rate (% of Buy signals that closed profitable)
- Exit discipline (% of exits triggered by rules, not gut)
- House book traffic + signups attributed (Brickwise growth signal)

## Out of scope

- Algorithmic execution. All trades manual until book proves out at €25k+.
- Other platforms (Arrived, Fundrise, Ark7) — they're closed-end funds, not actively-traded tokens. Different game.
- Shorting. No short-side on these markets.
- Margin / leverage. Cash-only.
