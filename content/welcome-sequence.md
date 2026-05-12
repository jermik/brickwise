# Brickwise Welcome Sequence

Trigger: New email subscriber via `/api/subscribe` (homepage capture or any inline widget).
Goal: First affiliate click + return visit. Build trust before any ask.
Length: 5 emails over 12 days.
Sender: Mikey, Brickwise (founder voice, plain text feel).
Exit: Manual unsubscribe. No re-engagement branch yet.

Voice rules: skeptical, anti-hype, no em dashes, no fluff, specific numbers over generalities.

---

## Email 1 — Welcome (send: immediate)

**Subject:** You're in. Here's the top-scored property right now.
**Preview:** One quick read and a link to start with.

**Body:**

Welcome to Brickwise.

You signed up because you want a neutral take on tokenized rental real estate. That's what this list is. Once a week I send one short note with what the data shows. Nothing else.

To start: the highest-scored property on Lofty + RealT right now is in the rankings below. 82 out of 100. Yield, occupancy, neighborhood quality, and fair value all check out. 60 seconds to look.

[See the top-scored properties]

The four emails after this one cover the things most buyers get wrong on these platforms. No selling, no urgency, no hype. If you decide tokenized rentals aren't for you, that's a fine outcome.

Mikey
Brickwise

**CTA:** See the top-scored properties → `https://brickwise.pro/rankings/highest-yield`

---

## Email 2 — Contrarian hook (send: day 2)

**Subject:** The 30.9% yield I'd still avoid
**Preview:** Why the highest yield in the dataset isn't the best buy.

**Body:**

Quick one.

The highest-yielding property in the whole tokenized rental dataset is a Cleveland house on Lofty paying 30.89% net. On paper, unbeatable.

My model scores it 78 out of 100. Solid. Not top.

Yield that high almost always prices in something the listing won't tell you. Vacancy risk. Rough-street risk. A property the platform is having trouble moving. Overlay rent stability, neighborhood data, and occupancy history, and the picture gets uglier than the headline rate.

The best-scoring properties (82) sit at 9 to 13% yield with strong occupancy and tight fair-value spread. Boring. Boringly profitable.

[See the scoring methodology]

If you remember one thing from this list: yield is the easy number. Risk-adjusted yield is the only one that matters.

Mikey

**CTA:** See the scoring methodology → `https://brickwise.pro/methodology`

---

## Email 3 — Concentration risk (send: day 4)

**Subject:** 37% of every tokenized rental is in one city
**Preview:** The concentration risk nobody warns you about.

**Body:**

A thing I didn't expect when I started building Brickwise.

37% of every active tokenized rental property on Lofty + RealT is in Detroit. 169 properties.

This matters because most people spreading $1,000 to $10,000 across "a diversified set of tokens" end up with roughly 40% of the portfolio in one metro. One property-tax revision, one tenant-protection law change, one local rental shift, and your "diversified" position moves together.

The buy signals on Brickwise downweight concentration. The 8 top-scored properties right now are spread across Dallas, Scottsdale, Columbia, Las Cruces, Davenport, Cleveland, and Aurora.

If you're starting a position, mix cities deliberately. Three good Detroit picks is a lot. Three Detroit picks of any score is too many.

[See the buy signals across cities]

Mikey

**CTA:** See the buy signals across cities → `https://brickwise.pro/rankings/buy-signals`

---

## Email 4 — Methodology transparency (send: day 7)

**Subject:** How I score 460 properties (full methodology)
**Preview:** Public weights, no black box.

**Body:**

I get this question a lot: how does the scoring actually work?

Composite of four signals.

- Yield (30%): expected net rental yield after property tax, insurance, and management
- Risk (25%): vacancy history, tenant turnover, property age, deferred maintenance signals
- Neighborhood (20%): crime indices, school quality, median income, employment base
- Fair value (25%): hedonic model comparing token price against historical price-to-rent ratios across the dataset

That's it. No black box, no proprietary AI, no judgment calls beyond the weights. The weights are public so you can disagree with them and apply your own.

I rebuild the scores daily against fresh data from both platforms. A property that scored 82 last month can sit at 71 today if rent or occupancy moves.

[Read the full methodology]

If you ever see a score on Brickwise that contradicts what you're seeing on the platform, reply to this email and tell me. The data trail is auditable, and corrections are how this stays useful.

Mikey

**CTA:** Read the full methodology → `https://brickwise.pro/methodology`

---

## Email 5 — First move + soft affiliate (send: day 12)

**Subject:** If you're actually going to buy your first token
**Preview:** One honest path in.

**Body:**

Last email in this welcome series.

If you've decided you want to buy a tokenized rental property, here's the cleanest first move I can give you.

1. Open a Lofty account. Largest platform, secondary market actually works, distributions hit daily in USDC. The Algorand wallet step takes 10 minutes once and never again.

2. Don't buy the highest yield. Start with one of the current 82-scored picks. $50 to $200 is enough for a first position. You want to see how distributions, statements, and the dashboard behave before sizing up.

3. Wait two weeks before adding a second property. One full distribution cycle and one secondary-market price quote will teach you more than any review.

[Open a Lofty account]

Full disclosure: that link is an affiliate. Brickwise earns a referral fee if you sign up through it. The scoring on this site is not influenced by it. The recommendation above is the one I would give you regardless. If you'd rather skip the referral, go to lofty.ai directly. No hard feelings.

After this, you'll hear from me roughly once a week with the data-driven updates. Reply anytime if there's a property you want me to look at.

Mikey

**CTA:** Open a Lofty account → Lofty affiliate URL (use `decorateLoftyUrl` helper)

---

## Implementation notes

Resend audience-free pattern is already in place for `/api/subscribe`. For automated sequencing the simplest options:

1. **Resend Broadcasts** (manual sends per email, audience required). Avoided per prior decision.
2. **Resend Workflows** (automated drip, audience required). Same blocker.
3. **DIY scheduler**: store subscribers + signup timestamp in Supabase, run a Vercel Cron job daily that queries due-to-send rows and calls `resend.emails.send()`. Cleanest fit with current stack.

Recommended: ship Email 1 inline from `/api/subscribe` immediately (already a one-line addition), then build the DIY scheduler for Emails 2 through 5. Total work: ~2 hours.

## Metrics to track

- Open rate (target: 50%+ on Email 1, 30%+ steady state — small honest list)
- Click rate (target: 15%+ Email 1, 8%+ later emails)
- Email 5 affiliate click rate (this is the conversion event)
- Unsubscribe rate per email (sub-1% per send is healthy)
- Reply rate (qualitative signal for trust and audience fit)
