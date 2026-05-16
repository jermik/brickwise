# Brickwise — Final Launch Posts (Anti-Spam Version)

Copy-paste ready. **Do not include URLs in Reddit post bodies** — drop the bare domain name once, near the bottom, as a casual mention. New accounts linking to their own domain trip Reddit's spam filters fast.

For Show HN and Indie Hackers, the link goes in the platform's URL field, not the body.

Order to post (one per day, not all at once):

1. Day 1: Hacker News
2. Day 2: r/RealEstateInvesting
3. Day 3: Indie Hackers
4. Day 4: r/passive_income
5. Day 5: r/AlgorandOfficial

---

# Post 1 — Hacker News (Show HN)

**Where:** https://news.ycombinator.com/submit

**URL field:**
```
https://brickwise.pro
```

**Title:**
```
Show HN: Brickwise – yield and risk scoring for 460 tokenized rental properties
```

**Text (optional but recommended for HN):**
```
Hi HN — I built Brickwise because I got tired of comparing tokenized rental real estate platforms (Lofty, RealT) by hand. These platforms let you buy LLC-backed shares of single-family rentals starting at $50, but no one was tracking yields, occupancy, or fair value across them in a comparable way.

It pulls every active listing from both platforms and computes a 0–100 score per property using a weighted composite: yield (30%), risk (25%), neighborhood (20%), fair value (25%). Then it produces a buy/hold/avoid recommendation based on the score and cross-listing relative ranking.

A few things I found interesting while building this:

- 37% of every active listing is in Detroit. The platforms are heavily concentrated in midwest cashflow markets.
- The highest yield in the dataset is 30.89% net (a Cleveland property on Lofty). My model rates it 78/100 — solid but not top. Yields that high are usually a vacancy risk signal in disguise.
- The best-scoring properties (82/100) are spread across 8 different cities, not concentrated. The pattern is yield-above-city-average + occupancy >90% + neighborhood quality + token priced near fair value.
- Fair-value estimation is the hardest piece. No MLS comp data for tokenized properties, so I'm using a hedonic model trained on the platforms' own historical price/rent ratios. Open to better approaches.

Stack: Next.js 16 App Router (SSG + ISR for 687 static pages), TypeScript, JSON data store, Vercel. All scoring runs at build time / on revalidate.

Not affiliated with Lofty or RealT. No paywall, no signup. The whole analyzer, all 460 properties, the comparison pages, and the rankings are free.

I'd love feedback on:
1. How would you approach fair-value estimation when there's no MLS comp data?
2. What other tokenized RE platforms should I add? (Roots, Ark7, Arrived are the obvious next ones.)
3. Anyone here actually investing in tokenized rentals? Curious how you'd want this scored.
```

---

# Post 2 — r/RealEstateInvesting

**Where:** https://reddit.com/r/RealEstateInvesting/submit (type: text post, not link)

**Title:**
```
I analyzed 460 tokenized rental properties on Lofty and RealT. The highest-yielding one pays 30.9% — and I'd still avoid it.
```

**Body (text post, no link):**
```
Spent the last few months pulling data on every tokenized rental property listed on Lofty and RealT — the two main platforms that let you buy LLC-backed shares of single-family rentals for $50 a share. I built a scorer for myself and figured I'd share what the data actually says, because the marketing on these platforms is wildly optimistic.

Numbers across 460 active properties as of this week:

- Average expected net yield: 10.08% (after property tax, insurance, management)
- Highest yield: 30.89% — 2094 W 34th Place, Cleveland, listed on Lofty
- 37% of every active listing is in Detroit (169 properties). Cleveland is second at 32.
- 8 properties tie at a top score of 82/100, and they're spread across Dallas, Scottsdale, Columbia, Las Cruces, Davenport, Cleveland, and Aurora — not concentrated in one city.

A few honest things I learned that nobody talks about:

1. The highest yields are almost always a vacancy/neighborhood red flag dressed up as a feature. The 30.9% Cleveland property scores 78/100 on my model — solid, not top. The platforms quietly mark high-yield properties on rough streets.

2. Concentration risk is real. If you spread $5k across 100 Lofty/RealT tokens, you're probably 40% Detroit. One Detroit property-tax change ripples through your portfolio at once.

3. Liquidity is theoretical for most listings. Lofty's market maker is fast on the big-volume tokens but thin on the rest. RealT's Uniswap secondary works but spreads can be 10%+.

4. Token prices drift from fair value. You're often paying 5–15% above implied fair value because the secondary market is small and one-sided.

My honest take: as 5–10% of a broader real estate allocation, defensible. As your primary RE exposure, no — illiquidity plus concentration risk don't pencil for serious capital.

I put the scorer at brickwise.pro if anyone wants to poke at the data. No signup, no paywall, not affiliated with either platform.

What sectors of fractional rental are people here actually allocating to? Curious if anyone's stacked across multiple platforms.
```

---

# Post 3 — Indie Hackers

**Where:** https://www.indiehackers.com/post/new (set "URL" field to https://brickwise.pro)

**Title:**
```
Built a yield scorer for tokenized real estate (460 properties tracked). Surface is up, traffic is 0. What's the unlock?
```

**Body:**
```
Spent the last 4 weeks building Brickwise — a yield and risk scorer for tokenized rental real estate on Lofty and RealT. 460 properties tracked, 687 indexed pages, all free to browse, no paywall. The technical SEO is clean: route-specific canonicals, structured JSON-LD per page, sitemap, llms.txt for AI crawlers, comparison pages for the 5 main platforms.

The problem: 12 visitors in the last 7 days, and 11 of them are me.

What worked technically:

- Programmatic SEO via SSG + generateStaticParams. Every property, every city, every ranking has its own static URL. 687 pages from one data file.
- AI discoverability layer (/llms.txt, /llms-full.txt) — cheap to ship, probably high-leverage for Perplexity/ChatGPT crawlers
- Honest comparison pages instead of "we ranked everything" hub pages. Specific search intent (e.g. "Lofty vs Arrived") converts better than generic best-of pages

What didn't work:

- Building everything before talking to anyone. Classic mistake. The site is technically beautiful and totally invisible.
- No affiliate links yet. The 5 platforms I cover all have referral programs. Every CTA on the site currently links to platform homepages with zero monetization.
- No email capture for the first 3 weeks. Just shipped that this week.

What I'm trying next:
- Reddit + HN distribution this week (this is post-launch day 3)
- Affiliate program signups with Lofty, Fundrise, Arrived, Ark7
- Weekly recurring market update post — give Google a "this site is alive" signal

The cold-start problem is brutal when you build a content site solo. Curious what worked for others here who launched content/data products. Specifically: how did you get from "indexed but invisible" to "first 1000 organic visitors"?
```

---

# Post 4 — r/passive_income

**Where:** https://reddit.com/r/passive_income/submit (type: text post)

**Title:**
```
I tested 5 fractional real estate apps for cashflow frequency. The compounding gap between daily and quarterly distributions is bigger than I expected.
```

**Body:**
```
Did a writeup comparing the 5 main fractional real estate platforms specifically on cashflow frequency, since that's what I actually care about for passive income vs total return. Real-world numbers across all 5:

| Platform | Minimum | Distributions |
|---|---|---|
| Lofty | $50 | Daily (USDC) |
| RealT | $50–100 | Weekly (USDC) |
| Ark7 | $20 | Monthly (USD) |
| Fundrise | $10 | Quarterly |
| Arrived | $100 | Quarterly |

What this means in practice if you reinvest distributions:

- Lofty pays USDC every day. You're DRIP-ing 365 times a year vs Fundrise's 4. On $10k at 10% net yield, the compounding gap vs quarterly is meaningful over 5+ years — not life-changing, but a few hundred dollars extra annually for nothing.
- Catch: Lofty requires a crypto wallet (Algorand). USDC distributions go to your wallet, not your bank. If "I don't want to learn crypto" is a hard line for you, Fundrise or Arrived are the only real options.
- Ark7 is the underrated middle ground — $20 min, monthly USD distributions, regulated securities, no crypto. Smaller catalog than the others.
- Arrived's quarterly distributions plus 5–7 year hold makes it the worst pick if cashflow is the goal. Best pick if you want set-and-forget single-family rental exposure with no thinking.
- Fundrise is the lowest barrier ($10) but you give up per-property selection — you're buying fund shares, not specific homes.

Honest opinion after running data on 460 listings across these platforms (brickwise.pro if you want the per-property scorer): the right choice depends entirely on whether you care about cashflow frequency or absolute simplicity. Most "best of" comparisons online ignore the distribution-frequency dimension entirely.

What's everyone here using? Anyone running multiple in parallel for diversification?
```

---

# Post 5 — r/AlgorandOfficial

**Where:** https://reddit.com/r/AlgorandOfficial/submit (type: text post)

**Title:**
```
I scored every active Lofty property on Algorand (around 300 listings). Average net yield is 10%, highest is 30.9%. Notes from looking at the data.
```

**Body:**
```
Lofty is probably the largest real-world asset use case on Algorand by token count. I've been tracking every active listing they have and built a scorer for yield, occupancy stability, neighborhood quality, and fair value. Sharing what I found because the on-chain real estate data is more interesting than the marketing suggests.

Numbers as of this week:

- Roughly 300+ Lofty properties active (mixed with RealT data, my full set is 460)
- Average expected net yield across Lofty: ~10%
- Highest yield: 30.89% on a Cleveland property
- USDC daily distributions actually do hit your wallet on schedule — verified across multiple listings
- The Proactive Market Maker provides real same-day liquidity on the high-volume tokens. Lower-volume tokens have thin liquidity, which is the honest weak point

Algorand-specific observations:

- The full ownership flow is on-chain (LLC membership represented by ASA tokens). This is one of the cleanest "real-world asset" implementations on any chain — not just a vague wrapped representation
- Gas costs are effectively zero, which makes the daily distributions actually viable. On Ethereum mainnet this model wouldn't survive
- The PMM is one of the few production examples of an automated market maker for non-fungible-ish real-world assets. Worth studying

Concentration concerns that aren't Algorand's fault but matter:

- 37% of all tokenized listings (Lofty + RealT combined) are in Detroit. Heavy single-city exposure
- Token prices on the secondary market drift from fair value by 5–15% on illiquid listings
- Scores cluster around 70–82/100 — there are no perfect properties, and the platform is honest about that

I put the data and scoring at brickwise.pro, not affiliated with Lofty. Free, no signup. Curious what other AlgoFam folks are doing with tokenized RE — anyone seriously stacking?
```

---

# Posting tactics (read before posting)

**For all five posts:**

- Post one per day. Block 2 hours after posting to actually engage with comments. A post with 30 author-replies outperforms 200 silent upvotes.
- Best timing: Tuesday or Wednesday, 9–11am US Eastern. Avoid Fridays and weekends.
- If a post gets removed, **do not repost it.** Modmail the sub asking why. Adjust and post in 2 weeks if needed.
- Do not link-drop in other comment threads on the same subs this week. Save those for next month.

**Reddit-specific anti-spam:**

- The bare domain "brickwise.pro" in the body is fine. **Do not** make it a clickable link with markdown brackets. Don't include "https://" or "www."
- Don't use any tracking parameters (?utm=...) in Reddit-mentioned domains — automod sometimes flags those.
- Don't post the same post in two subs the same day, even with rewording.
- If your Reddit account is under 30 days old or has low karma, expect 1–2 of the 3 Reddit posts to be auto-removed. Modmail to request approval — this works more often than you'd think on real-content posts.

**HN-specific:**

- Submit at 8–9am US Pacific (11am–12pm Eastern). HN traffic peaks then.
- HN expects honest engagement. Reply to top comments within the first hour, even if just "good point, hadn't considered that."
- If you don't reach the front page in the first 2 hours, the post is dead. Don't repost.

**Track results in Vercel Analytics:**

- Don't use UTM tags in Reddit bodies (automod risk)
- DO check the Vercel Analytics "Referrers" tab daily — Reddit and HN referrers will show up there with the source path

**Expect:**

- HN front page (top 30) = 2,000–8,000 visitors over 24 hours
- r/RealEstateInvesting front page = 500–3,000 visitors
- Other Reddit posts = 100–500 visitors each if they land
- Indie Hackers = 100–500 visitors over a few days

If you hit even half of these on the first try, the site goes from 12 weekly visitors to 5,000+. That's the unlock.
