# Brickwise — Re-audit (grounded in actual codebase)

**Correction up front:** Earlier strategy memo assumed Cleveland-focused agent-lead-gen. That was wrong. Real product: independent yield/risk analytics for tokenized rentals on Lofty + RealT (460 properties, 687 indexed pages), plus Algorand ecosystem directory, plus a hidden GrowthOS CRM for Dutch SMB agency work.

**State:** Post-product, pre-distribution. ~12 weekly visitors. Site is technically beautiful and completely invisible.

---

## 14-dimension audit

### 1. Landing page clarity
**Likely problem:** Trying to communicate both faces (analytics + Algorand directory). Hero should be one sentence: "Should you buy this $50 property token? 460 tokenized rentals scored honestly." Cut Algorand from above-the-fold. Make it a secondary surface from nav, not a hero element.

### 2. Onboarding friction
No signup = good. But there's no callback mechanism. Visitor reads analyzer, leaves, never returns. Email capture exists but ROI is low without a lead magnet attached. **Fix:** "Top 10 buy signals this week (free, weekly)" magnet auto-generated from existing data.

### 3. Conversion path
Current: visitor → analyzer → property → Lofty CTA. Friction wall: 90% of visitors won't pass Lofty's KYC + Algorand wallet barrier. Affiliate revenue is delayed weeks. **Email subscribers convert ~30x site-only visitors. Treat affiliate as the long-tail; treat email as the primary asset.**

### 4. Monetization timing
Affiliate is the right unit economics. Lofty is live; RealT/Ark7/Fundrise/Arrived pending (RealT requires email outreach already on the to-do). **Don't add SaaS pricing before 500 email subs.** Phase 2 (3-6 months): paid "Deal Alerts Pro" tier at €15-29/month for users who want push notifications when score >85 properties go live.

### 5. Activation loop
Undefined. The site has no "I get value, I'll come back" trigger. **Define it:** the activation event is "user opens the weekly email and clicks through to a ranking page." Track this as the north star, not raw site visits.

### 6. Retention hooks
None. `/watchlist` exists but requires Clerk login — friction wall for read-mode users. **Fix:** localStorage-backed "Save this property" with no auth. Add a "View saved properties" link in nav. Optional auth upgrade for cross-device sync.

### 7. SEO leverage
687 pages indexed, near-zero traffic = thin authority. Diagnosis isn't a content problem; it's a **backlink** problem. Domain is brand new, zero referring domains. **More pages won't fix this. Backlinks will.** Each HN/Reddit/IH post = 1-3 referring domains if it lands.

### 8. Distribution opportunities (huge unfinished list)
- **HN + 4 Reddit posts written but NOT SHIPPED.** This is the single highest-leverage move and it's just sitting there.
- "30.9% Cleveland yield" YouTube short = a hook with proven attention pattern. Should be 10 videos targeting different yield/scoring/comparison angles, not 1.
- **@BrickwisePro auto-tweet schedule** — data refreshes daily; auto-post "Top yield right now" / "New buy signal" / "Score change" alerts. Free content engine.
- **Quora answers** to "Is RealT legit" / "Is Lofty legit" — these are pure trust queries with high commercial intent, currently un-answered.
- **30 Algorand projects** in your directory = 30 partnership/backlink asks. Each project will link back if you ask.
- **Newsletter swaps** with small RE Substacks (BiggerPockets is too big; Marc Andreessen/Codie Sanchez orbit is too big; target newsletters with 1k-10k subs).

### 9. Trust signals
**This is where the product undersells itself most.** What's missing:
- No "Methodology" page explaining the scoring math — RE investors NEED to see the formula
- No author byline on Learn articles
- No "Last updated: [date]" on rankings
- No "About the analyst" page humanizing the operator
- "Not affiliated with Lofty/RealT" should be a prominent **independence badge**, not buried disclosure text

### 10. Differentiation
You're the **only** third-party analytics in this niche (confirmed in SEO_INTELLIGENCE.md). This should be top-of-page on every comparison/ranking. Currently soft.

### 11. Pricing strategy
Free now = correct for cold start. **Hold pricing decisions until 500 email subs.** When introduced, the bar to charge for is "alerts + watchlist sync + downloadable monthly report" not "access to the scorer" — the scorer must stay free for SEO.

### 12. Email capture strategy
Recently wired (drops audience dep, uses notification-email pattern). **Weakness:** no lead magnet. Capture rate will be <2% without one. With "Top 10 buy signals this week" PDF / Notion / CSV magnet: 8-15% realistic. Use `KIE_AI_API_KEY` already in env to auto-generate a branded PDF weekly.

### 13. Content flywheel
**Massive latent leverage. Data refreshes daily; content doesn't.** Build:
- Weekly auto-generated "Top buy signals this week" blog post (cron job, fed by existing scoring engine)
- Monthly "Tokenized RE market report" (already exists at `/market`; under-distributed — should be the primary newsletter content)
- Annual "Tokenized Real Estate 2026 Report" PDF — massive link bait, downloadable in exchange for email

### 14. Product-led growth opportunities
- **Embeddable scorer widget** — let RE/crypto Substack writers embed a "live yield chart" iframe. Every embed = a backlink + a referral funnel.
- **Public `/api/scores.json`** — makes Brickwise the source of truth for tokenized RE data. Niche but moaty.
- **"Share this score" OG image** — branded property-card image rendered server-side, auto-shareable on Twitter/X with backlink to the property page.

---

## Must do now (this week)
1. **Ship the 5 launch posts.** They're written. Send them.
2. **Add a lead magnet** to email capture — "Top 10 buy signals" auto-PDF.
3. **Add "Methodology" page** explaining the 0-100 score. Link from every ranking + property page.
4. **Add "Last updated" + author byline** to all rankings and Learn articles.
5. **Email RealT** for affiliate URL (already noted as pending in handoff).
6. **Set up `@BrickwisePro` auto-tweet cron** — at minimum, weekly "Top yield right now" post auto-generated from data.

## Should do later (4-12 weeks)
7. Build `/api/scores.json` public endpoint + 1-paragraph docs.
8. Build an embed widget (iframe) for newsletter writers.
9. Ship 2-3 more comparison pages: "RealT vs Roots", "Lofty vs Honeybricks" (capture brand+brand long-tail).
10. Run backlink outreach to 30 Algorand directory projects — "We listed you, want to swap a mention?"
11. Year-end "Tokenized RE 2026 Report" — gated download, becomes the email-capture mega-magnet.
12. Quora answer campaign on "is RealT legit" / "is Lofty legit" / "tokenized real estate worth it".
13. Decide Algorand-directory positioning: extract it (own subdomain) or commit to "Brickwise = Algorand RWA intelligence" framing. Currently dilutes the brand.

## Ignore completely
- More `/watchlist` features (zero current users; build retention via email not in-product).
- SaaS pricing tier before 500 email subs.
- Mobile app.
- Multi-chain expansion (Ethereum L2s, Polygon RWAs) before Lofty+RealT funnel is profitable.
- AI chatbot / "ask the data" feature.
- Live chat support.
- Generic "fractional real estate investing" content — RealT/Lofty/Arrived already dominate; you can't out-rank with no authority.

---

## Hidden weaknesses
- **`/growthos` landing page is split focus.** GrowthOS is internal tooling that uses the Brickwise codebase — it should NOT have public marketing surface. Either commit to it as a sellable product (different motion entirely) or noindex it. Right now it's confusing both for SEO and brand.
- **CRM/GrowthOS coupling.** Long-term debt; will need extraction. Not urgent but flag it before scaling either side.
- **37% Detroit concentration** is a *story* you used in the HN post — turn it into a permanent `/learn/detroit-tokenized-real-estate-concentration` explainer targeting the exact-match geo query.
- **"Is RealT legit" / "Is Lofty legit"** — huge trust queries that your platform-review pages should optimize title tags for directly (currently they don't).
- **No live chat / no founder-visible Twitter activity** — at the trust stage of this funnel, a face matters more than another comparison page.

## Looks good, won't matter (without other moves)
- The 7 comparison pages already shipped — built, beautifully marked-up, just waiting for traffic. Don't build more comparison pages right now; drive traffic to the existing ones.
- Brand identity refresh — done, fine. Don't redo it.
- AI discoverability files (`/llms.txt`, `/llms-full.txt`) — useful but not load-bearing yet. Don't iterate on them.
- 687 indexed pages — number is impressive, traffic isn't. More pages won't fix this; backlinks will.

## Undersells the product
- **Headline:** "Tokenized real estate analytics" is dry. Try: "Should you buy this $50 property token? 460 tokenized rentals, scored honestly." or "The only independent analyzer for Lofty and RealT properties."
- **Methodology hidden in fine print** — should be a featured surface.
- **"Not affiliated"** should be a badge, not buried.
- **Distribution frequency story** (Lofty daily vs Fundrise quarterly compounding gap) is in your draft Reddit post but not on the site — it should be a permanent comparison page.
- **The founder's actual hands-on RE knowledge** — site reads like a faceless data tool. It would convert higher with one personality-led "About the analyst" page + a weekly newsletter signed by name.

---

## Highest-leverage single action

**Ship the HN post tomorrow.** Everything else is downstream of "did we move from 12 weekly visitors to 5,000." No content addition, no SEO tweak, no schema update will deliver the unlock that one front-page HN moment can. The post is written. Send it.
