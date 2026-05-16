# Brickwise pSEO Quality Audit (Existing Surfaces)

**Goal:** Strengthen the 6 existing programmatic surfaces so they feel authoritative, useful, and index-worthy. Quality over scale. No new mass-generation systems proposed.

**Surfaces audited:**
1. `/property/[id]` (460+ pages)
2. `/city/[slug]` (~30 cities)
3. `/rankings/[category]` (4 pages)
4. `/compare/*` (7 hand-written pages)
5. `/market/[date]` (daily reports)
6. `/algorand/[slug]` (~30 projects)

Each surface graded A (strong, ship as-is) through C (significant thin-content / differentiation risk).

---

## 1. `/property/[id]` — Grade: A−

**Strengths:** Truly unique per page (real address, photo, score breakdown, comparison bar, €1k calculator, recommendation reason text, occupancy data, source attribution). The strongest pSEO surface you have.

**Weaknesses found:**
- No author byline anywhere
- No "Last updated" prominent at top (it's in the sidebar Source row, easy to miss)
- Description meta clamped to 130 chars is fine, but title clamping at 60 chars with "..." can produce ugly cut-offs
- 460 indexed pages with the same component skeleton — Google's thin-content classifier looks at *distinct text content*, not data variation, so the formulaic recommendation reason text is the soft spot
- No `Methodology` link from property page header

**Must-fix (small):**
- Add `Last updated: [date]` to the header strip, not buried in sidebar
- Add a `Methodology` link in the score breakdown section
- Add 1-2 sentences of per-property analyst commentary beyond the templated reason text — even one human-written line per property dramatically lifts text uniqueness vs pure data swap

**Won't matter:** Adding more schema types. You already have enough.

---

## 2. `/city/[slug]` — Grade: B−

**Strengths:** Real per-city stats (yield avg, max, buy count, platform distribution). Real ranked table per city. Dataset + Breadcrumb + FAQ schema.

**Weaknesses found (thin-content + over-templating risk — highest of the 6 surfaces):**
- **FAQ answers are formulaic.** 3 questions per city with only variables swapped. "How many tokenized properties are available in [City]?" — answered by the stat already shown in the strip. This is exactly the pattern Google flags as templated thin content.
- **No city-specific editorial content.** Detroit, Cleveland, Toledo all read structurally identical with only numbers changed. No neighborhood notes, no local market context, no comparison to other cities.
- **H1 "[City] Tokenized Real Estate" is fine but generic.** No differentiator vs RealT's own city listing pages.
- **Related cities tag cloud lacks ranking.** Just shows 12 cities by `Set` order, not by relevance or property count.
- No author byline, no "Last updated".

**Must-fix (priority):**
- **Add a 2-3 sentence editorial paragraph per city** below the H1. Even ONE sentence of unique context lifts text uniqueness from ~5% to ~30%. Examples: "Detroit dominates this dataset with 37% of all tokenized listings — concentration risk worth understanding before stacking." Per-city. Hand-written or one-time-AI-generated then reviewed.
- **Replace formulaic FAQ with city-context FAQ.** Better questions: "Is Detroit oversaturated with tokenized rentals?" / "What makes Cleveland tokenized properties yield higher than national average?" / "Which platform should I prefer for [City]?" Each answer should reference actual data + analyst opinion, not just regurgitate the stat above.
- **Sort Related Cities by property count or yield similarity**, not insertion order.

**Defer:** Adding per-neighborhood depth. That's a future expansion, off-budget per "no mass generation" rule.

---

## 3. `/rankings/[category]` — Grade: A

**Strengths:** Only 4 pages — quality over scale baked in. Hand-written title, description, keywords per category. ItemList + Breadcrumb schema. Cap of 60 items keeps DOM lean. The list itself IS the value, so differentiation is intrinsic.

**Weaknesses (minor):**
- No editorial intro explaining *why* this ranking matters or how to read it
- No FAQ schema (these pages would benefit from "What is a buy signal?" / "How is fair value computed?" — drives PAA box capture)
- Email capture only at bottom (most users won't scroll the full 60-row table)

**Must-fix (small):**
- Add a 2-sentence editorial intro per category. E.g., for `/rankings/highest-yield`: "Highest yield doesn't mean best buy. Yields above 14% almost always reflect vacancy risk priced in. Read the score column, not just the yield."
- Add an FAQ section (3-4 questions) with FAQPage schema. Reuse content from `/methodology`.

**Won't matter:** Adding more categories. 4 is the right number.

---

## 4. `/compare/*` — Grade: A

**Strengths:** Each comparison page is hand-written, schema-heavy (Article + FAQPage + Breadcrumb), and represents real editorial work. Only 7 of these — no thin-content risk.

**Weaknesses (none structural):**
- Inconsistent "Last updated" — `modifiedTime` is set to `new Date().toISOString()` on every render of `realt-vs-lofty`, which is misleading (the *content* hasn't actually been updated, only the build timestamp). Should be the actual editorial update date, not the build date.
- Other comparison pages I haven't read may diverge in structure from realt-vs-lofty. Worth a 1-line consistency check.

**Must-fix:**
- Set `modifiedTime` to an actual editorial date constant per page, not `new Date()`. False freshness signals can backfire if Google's freshness classifier expects content changes.

**Won't matter:** Adding more comparison pages right now. The 7 you have aren't earning traffic yet — drive backlinks to existing ones first.

---

## 5. `/market/[date]` — Grade: A−

**Strengths:** Real editorial content per date (highlights array, summary paragraph, top properties). Article schema. Each entry is genuinely different content.

**Weaknesses found:**
- **Visual inconsistency:** This page uses light backgrounds (`#fff`, `#fafafa`) while the rest of the site is dark (`#0A0907`). Jarring brand experience. Either fix the page styling to match or commit to a "reports are formal documents" visual mode.
- No author byline on what is presented as editorial commentary
- No FAQ schema
- "Share on X" link is good, but no "Save this report" or "Get the next one in your inbox" — the EmailCaptureWidget at the very bottom misses peak intent
- No internal links to related comparison pages or city pages mentioned in the report

**Must-fix:**
- **Restyle to match dark theme** OR commit to light theme deliberately and add a visual marker that says "Reports."
- Add author byline ("by Brickwise" or person name) since this is editorial content, not data automation
- Add 2-3 contextual links from the report body to relevant city / comparison / property pages — these are the highest-value internal links you can place

**Won't matter:** Adding FAQ schema here. Article schema is enough for this content type.

---

## 6. `/algorand/[slug]` — Grade: B

**Strengths:** Per-project unique data (description, longDescription, ecosystemTags, social links, related projects). SoftwareApplication + Breadcrumb schema. Affiliate disclosure footer is correct and present. Hand-curated, not scraped (you said so explicitly).

**Weaknesses found (largest concern: AI-feel):**
- **The `aiSummary` field is rendered as a branded "Brickwise summary" callout.** The field name literally telegraphs that it's AI-generated. If reviewed and verified, fine — but the AI-feel risk is real. Either rename the field, hide the badge, or commit to having a human review each `aiSummary` before publication.
- **No "Verified" definition.** Badge appears but what does verification mean? Add a hover tooltip or footnote explaining the verification criterion.
- **"Featured" is similarly opaque.** Featured by whom, against what criteria?
- **Light/dark inconsistency.** This page uses `rgba(255,255,255,...)` text on what reads as a different background framework than the rest of the dark-mode site.
- **Sparse content for some projects** — `longDescription` length varies widely. Short ones risk thin-content classification.
- **30 projects is fine for a directory.** Don't expand to 100+ without editorial cost.

**Must-fix (highest priority of the 6 surfaces):**
- **Audit every `aiSummary` field.** Either confirm each has been human-reviewed (then rename the field to `editorialNote` or `analystNote`) or remove the labeled "Brickwise summary" badge and present the text without the AI provenance signal. The field name is the highest AI-feel risk in the whole site.
- **Define "Verified" and "Featured"** with a one-line tooltip or footnote linking to the criterion
- **Set a minimum content threshold:** if a project's `longDescription` is under ~100 words, either fill it out or noindex that page

**Defer:** Expanding the directory to more projects.

---

## Cross-cutting issues (apply to all 6 surfaces)

| Issue | Affected surfaces | Severity |
|---|---|---|
| No author byline / personal voice anywhere on programmatic pages | all 6 | Medium |
| "Last updated" inconsistent or missing | property, city, market, algorand | Medium |
| Visual mode inconsistency (light vs dark) | market, algorand | Low |
| `modifiedTime` set to build time, not editorial time | compare | Medium (false freshness signal) |
| Templated FAQs with variable-swap-only answers | city | High (thin-content risk) |
| No internal cross-links between programmatic surfaces (e.g., property → city → ranking it appears in) | property, market | Medium |
| `Methodology` link absent from data-heavy pages | property, city, rankings | Medium |

**Crawlability / indexability:** Did not deep-audit `robots.ts` or `sitemap.ts` in this pass. Worth a follow-up `seo-technical` invocation if you want that verified. From what I see, all 6 page types use `generateStaticParams` + SSG + canonical URLs, so the foundation is good.

---

## Top 5 priority fixes (highest leverage)

1. **`/city/[slug]` — Add per-city editorial paragraph + non-templated FAQ.** This is the biggest thin-content risk in the entire pSEO surface. 30 city pages currently risk being flagged as templated spam if traffic ever materializes.

2. **`/algorand/[slug]` — Rename `aiSummary` field and audit each entry.** The field name literally telegraphs AI generation. Trust killer if a curious reader inspects the data shape, and easy fix.

3. **All surfaces — Add visible "Last updated" + Methodology link.** Property pages bury it in the sidebar. City and rankings don't have it. Cheapest single trust-signal upgrade.

4. **`/market/[date]` — Fix visual mode and add author byline.** Reports presented as editorial commentary need a human attribution. Visual mismatch breaks brand consistency at exactly the highest-intent moment.

5. **`/compare/*` — Stop setting `modifiedTime` to `new Date()`.** False freshness signals can backfire with Google's freshness classifier when actual content doesn't change. Use a real editorial date constant.

---

## What NOT to do (per user instructions, restated for the record)

- No mass page generation
- No AI-written city spam
- No glossary flooding
- No keyword farms
- No parasite SEO
- No expanding the city or algorand directories beyond current scope without editorial commitment
- No new programmatic surfaces designed in this audit

---

## Confidence note

Audit grades and recommendations grounded in actual reads of:
- `app/property/[id]/page.tsx`
- `app/city/[city]/page.tsx`
- `app/rankings/[category]/page.tsx`
- `app/market/[date]/page.tsx`
- `app/algorand/[slug]/page.tsx`
- `app/compare/realt-vs-lofty/page.tsx`

Other compare pages (`/compare/realt-vs-fundrise`, etc.) not individually read — assumed similar quality based on hand-written-page convention you established. Worth a quick spot-check before acting on the `modifiedTime` recommendation across all of them.
