# Refresh Brief: `/compare/best-fractional-real-estate-platforms`

**Date:** 2026-08-01  
**Mode:** Monthly Refresh — Early Advisory  
**Eligibility note:** Page last committed 2026-06-11 (51 days). 90-day threshold not met until 2026-09-09. Brief is advisory — act on it in September or when a platform changes its terms, fees, or structure.

---

## Page facts

| | |
|---|---|
| Route | `/compare/best-fractional-real-estate-platforms` |
| File | `app/compare/best-fractional-real-estate-platforms/page.tsx` |
| Primary keyword | `best fractional real estate platforms 2026` |
| Priority in sitemap | 0.85 |
| Last committed | 2026-06-11 |
| Platforms covered | Lofty, RealT, Fundrise, Arrived, Ark7 |
| Revalidate | 86400 (daily) |

---

## Current angle vs SERP intent

**Current angle:** Editorial comparison table of 5 platforms (Lofty, RealT, Fundrise, Arrived, Ark7) with columns: type, minimum, distributions, liquidity, geo focus, best for. Table-first format with brief descriptive rows per platform.

**Likely SERP intent (keyword: "best fractional real estate platforms"):** High-funnel, informational-comparative. User is at the top of the funnel, hasn't committed to any platform, wants a trusted scoreboard. SERP typically surfaces pages that:
- Rank platforms explicitly (not just list them)
- Include a clear winner per use case
- Show actual performance numbers (yields, returns), not just feature lists
- Address newer entrants (Groundfloor, Streitwise, Yieldstreet — note: not all are "fractional RE")
- Have a "which one to start with" decision-path close

**Brickwise's differentiator here:** We have real yield data on Lofty and RealT. The other platforms (Fundrise, Arrived, Ark7) would need manually sourced yield data or {TODO} placeholders. Generic comparison sites have no access to this proprietary data — make it visible.

**Live SERP check:** Could not fetch — proxy blocked external access. Owner should run `google.com/search?q=best+fractional+real+estate+platforms+2026` and check:
- Top 3 pages: what's their ranking format (numbered list? table? cards?)
- Do any mention Groundfloor, Streitwise, or new 2026 entrants?
- PAA questions — add any not currently answered.
- Is there a featured snippet? If so, match its format (usually a list or a "quick comparison table").

---

## Gaps in current content

1. **No explicit platform ranking.** Current content lists platforms without ranking them #1–5. "Best" in the title implies a ranked opinion, but the table is neutral. Users want to know: if I can only pick one, which one? Not having a clear #1 per use case weakens this page against competitors who do rank.
2. **No yield data for non-tokenized platforms.** Fundrise, Arrived, and Ark7 have published return data. The current page has no yield comparison row. A simple "recent reported return" column (with source links and caveats) would make this page far more useful. Use {TODO} placeholders for current figures.
3. **No Groundfloor or Streitwise mention.** Both are debt-based fractional RE platforms that compete for the same search queries. Not covering them makes Brickwise look narrower-scope. A brief "Platforms not included" callout with a one-line explanation (e.g., "Groundfloor is a debt platform, not equity — we focus on equity/rental-income products") signals rigor, not avoidance.
4. **No track record / longevity column.** For investors worried about platform shutdowns: "Operating since [year]" is a quick trust signal. Fundrise (2010), RealT (2019), Lofty (2018?), Arrived (2020), Ark7 (2019?). Verify dates: {TODO: confirm founding years}.
5. **No regulatory model row.** Reg A+, Reg D, Reg CF — these determine accreditation requirements. A one-line note per platform (with verification) addresses the non-accredited investor use case. Use {TODO: confirm regulatory tier for each platform}.
6. **No "What Is Fractional Real Estate?" section.** This is a top-of-funnel page. Some visitors won't know the category. A brief two-paragraph intro (or a "New to this? Start here" link to `/learn/what-is-tokenized-real-estate`) reduces bounce for first-time visitors.

---

## Proposed new H2 sections

Add these — before or after the main comparison table, to be decided by writer:

1. **Platforms Ranked by Use Case** — Instead of (or in addition to) the table, add a "which platform wins for X" section:
   - Lowest minimum → Fundrise ($10)
   - Daily income → Lofty
   - DeFi integration → RealT
   - Hands-off, no crypto → Fundrise or Arrived
   - Best data transparency → Brickwise scores both Lofty and RealT (internal plug)
   Note: Do not fabricate rankings — base on observable features only.
2. **Yield Comparison (What Returns Has Each Platform Reported?)** — Row per platform showing most recently published return figure (with source link and caveat that past returns don't indicate future results). {TODO: look up current Fundrise reported net return, Arrived reported return, Ark7 reported return — do not invent numbers}. Lofty and RealT yields are available from Brickwise live data.
3. **How Long Has Each Platform Been Operating?** — Founding year + brief milestone (first property, platform launch, regulatory milestone). Signals trust for new investors. {TODO: confirm founding years and key milestones for each platform}.
4. **Platforms Not Included in This Comparison** — One-sentence note on Groundfloor (debt-based, not equity), Streitwise (non-accredited REIT, different structure), Yieldstreet (diversified alts, not pure RE). Explain inclusion criteria: "We focus on platforms that offer direct fractional ownership in individual rental properties and pay regular distributions."

---

## Internal-link opportunities

**Link FROM this page TO:**
- `/learn/lofty-review` — Lofty row should link here. {Check: does it?}
- `/learn/realt-review` — RealT row should link here. {Check: does it?}
- `/compare/realt-vs-lofty` — add a contextual "For a deeper comparison of the two tokenized platforms, see our dedicated page."
- `/learn/what-is-tokenized-real-estate` — add in the intro section.
- `/compare/best-real-estate-investing-apps` — add a note: "Looking for app experience comparison? See our best real estate investing apps ranking."
- `/rankings/highest-yield` — add: "See today's highest-yield tokenized properties across Lofty and RealT."

**Link TO this page FROM:**
- `/learn/lofty-review` — "How does Lofty compare to all major platforms? See our full comparison."
- `/learn/realt-review` — same.
- `/compare/realt-vs-lofty` — add a link for readers who want the broader 5-platform view.
- `/learn/how-to-invest-in-tokenized-real-estate` — in the "choose your platform" section.

---

## Stat / data refresh points

The page currently has static platform data (minimums, distribution frequency, etc.). These can go stale:

- `{TODO: verify Fundrise minimum is still $10 — they have changed this multiple times}`
- `{TODO: verify Arrived minimum is still $100}`
- `{TODO: verify Ark7 minimum and current platform status}`
- `{TODO: confirm RealT minimum range $50–100 is still accurate}`
- `{TODO: verify Fundrise still offers "quarterly" distributions — they have had periods of suspended redemptions}`
- `{TODO: check if Arrived has changed liquidity terms — they have had periodic secondary market offerings}`
- `{TODO: confirm founding years for each platform}`
- `{TODO: look up most recently published net return figures for Fundrise, Arrived, Ark7 — use as a yield comparison row with source links and caveats}`

---

## Human action required

1. Run live SERP check for "best fractional real estate platforms 2026" — identify competitor pages, their ranking format, and PAA questions.
2. Verify all platform minimums, distributions, and fee structures against current platform websites.
3. Decide whether to add a #1 platform pick or keep the neutral table format.
4. Write new sections per brief — do not use brief text as copy.
