# Brickwise Launch Strategy — Pre-Flight Audit

**Status:** Launch posts written and ready (`content/launch-posts-final.md`). Product is live. Site is technically beautiful and invisible (~12 weekly visitors). This document audits the existing plan against the ORB framework and identifies the gaps that will determine whether the launch lands or dies in the new queue.

---

## Where Brickwise sits in the 5-phase model

The skill defines 5 phases: Internal → Alpha → Beta → Early Access → Full Launch.

**Brickwise has skipped phases 1-4** and is going directly to Full Launch. For a free public analytics tool with no signup, this is reasonable. But it introduces specific risks:

- No seed audience to feed the launch first-hour signal
- No early validation of the analyzer flow with real outside users
- No pre-built reservoir of supporters who'll comment/upvote
- No prior content traffic to leverage

These are not deal-breakers, but they are the highest-leverage things to address in the next 48 hours before posting.

---

## ORB audit (Owned / Rented / Borrowed)

### Owned channels — WEAK
| Channel | Status | Gap |
|---|---|---|
| brickwise.pro (site) | Live, 687 pages indexed | Methodology page missing, "About" weak, no author byline |
| Email list | Capture wired, 0 subscribers | No lead magnet, no welcome sequence, no schedule |
| Blog/learn hub | 4 articles | No publishing cadence, no author face |
| Community (Slack/Discord) | None | Not needed yet, but consider after first 100 subs |
| Newsletter | None | Should be the post-launch retention engine |

**Critical:** Every visitor from HN/Reddit who doesn't subscribe is lost. Without a lead magnet, capture rate will be sub-2%. Fix BEFORE posting.

### Rented channels — DECENT
| Channel | Status | Gap |
|---|---|---|
| @BrickwisePro (X) | Live, thread pinned | No auto-update schedule, no follower base yet |
| Reddit accounts | Ready, copy written | Account reputation thin (per handoff: IH explicitly blocked for low rep) |
| YouTube Shorts | 10 scripts ready | None recorded yet |
| HN account | Ready to post | Karma level unknown — verify before Tuesday |
| Indie Hackers | Blocked (new account) | Defer per handoff |

### Borrowed channels — LARGELY UNTAPPED (biggest opportunity)
| Opportunity | Status |
|---|---|
| 30 Algorand projects in your directory | Zero outreach. Each is a "we listed you, mention us back?" ask. |
| Small RE Substacks / newsletters | Zero outreach. Not BiggerPockets-tier; target 1k-10k sub newsletters. |
| Crypto RWA Twitter accounts | Zero. There are 20-30 accounts that tweet weekly about RWAs. |
| Real estate YouTubers (mid-tier) | Zero outreach. Same playbook as the TRMNL/Snazzy Labs case study. |
| Affiliate platform reciprocity | Lofty live. RealT/Ark7/Arrived/Fundrise pending. Each is a co-marketing opportunity, not just affiliate-link mechanics. |

**Borrowed channels are the single highest-leverage untapped surface.** Cheap, high-trust, compounds.

---

## Pre-flight gap analysis (before you press send on HN)

### MUST FIX before posting (24-48 hours of work)

1. **Build a seed audience.** HN escapes the new queue if it gets ~5-15 organic upvotes + 3-5 thoughtful comments within the first 30 minutes. With 0 email list and 12 weekly visitors, there's no native pump. **Action:** Personally DM 15-25 friends/contacts (Twitter, Slack, real life) the day before. Ask them to bookmark the HN post when it goes live, upvote IF they actually like it, comment honestly. Do NOT ask for fake engagement. This is the difference between front page and dead.

2. **Add a lead magnet to email capture.** Without one, capture will be <2%. With "Top 10 buy signals this week" auto-generated PDF or simple emailed list: 8-15%. Use `KIE_AI_API_KEY` for a branded cover image. Wire the magnet today.

3. **Add a Methodology page and link from every ranking/property page.** RE investors WILL ask "how is this scored." Anticipate the HN top comment: "Show me the math." Have a one-page methodology doc live before posting.

4. **Add an "About the analyst" page.** Trust is the conversion killer. Faceless data tool = doubt. One paragraph, photo, what you do, why you built this. Link from footer.

5. **Verify HN account karma.** Per handoff section 8, Indie Hackers is blocked for reputation. HN may be similar. Check karma level. If low, post needs to be exceptional to escape new queue.

6. **Schedule a "first 2 hours of HN" engagement block.** Per the skill case study (SavvyCal, Reform): treat it as an all-day event. Reply to every comment in the first hour. If you can't, don't post.

### SHOULD FIX before posting (4-8 hours of work)

7. **Build a 3-email welcome sequence.** Trigger on email capture. Email 1: confirm + link to top 5 buy signals. Email 2 (day 3): methodology explainer. Email 3 (day 7): "want weekly updates? here's what they look like." Without this, captured emails go cold.

8. **Set up the "Top yield this week" auto-tweet** from @BrickwisePro. Cron + your existing scoring data = free recurring content. Critical for keeping the X account alive between manual posts.

9. **Add "Last updated: [date]" timestamps** to all rankings. Without it, returning visitors can't tell if data is fresh. Conversion killer.

10. **Pre-write 3-5 anticipated HN comment replies.** Top likely comments: "How do you compute fair value?", "Is this affiliated?", "What about [X newer platform]?", "Why $50 minimum matters", "Liquidity concerns on small markets". Draft replies now; paste in real time.

### CAN WAIT (post-launch within 7 days)

11. Comparison pages for any new platforms you want long-tail traffic on
12. Methodology deepdive blog post (separate from one-page summary)
13. Algorand directory backlink outreach (30 emails, batched, low priority)
14. Newsletter cadence (start after 100 subs)
15. YouTube Shorts recording (after HN to see which hook resonated)

---

## Sequencing critique (your current plan)

Current order in `launch-posts-final.md`:
1. Day 1: HN
2. Day 2: r/RealEstateInvesting
3. Day 3: Indie Hackers
4. Day 4: r/passive_income
5. Day 5: r/AlgorandOfficial

**Issues:**

- **Indie Hackers is blocked per handoff.** Remove from sequence or replace with another channel. Day 3 slot is empty.
- **r/AlgorandOfficial last is weakest sequencing.** AlgoFam is the most niche, most loyal, most likely to upvote and engage. Move it earlier (Day 2 or 3) to seed warm signal across platforms.
- **Sequential daily posts assume HN momentum carries.** It doesn't. HN traffic dies in 18 hours regardless of outcome. Reddit traffic is independent. Treat each as standalone. **Don't delay a Reddit post because HN flopped.** Don't accelerate one because HN spiked.
- **No Product Hunt in the plan.** Worth considering. PH audiences differ from HN (more designers/PM types, less data-science skeptics). Pros: more credibility-bump and ongoing visibility from PH listing page. Cons: requires more prep (hunter, polished visuals, demo GIF). Could be ~2 weeks out.

**Suggested revised sequence:**

| Day | Platform | Rationale |
|---|---|---|
| Day 1 | HN | Highest potential ceiling, time-sensitive |
| Day 2 | r/AlgorandOfficial | Warmest niche audience, low risk |
| Day 3 | r/RealEstateInvesting | Largest target audience |
| Day 4 | rest day (engage with HN/Reddit follow-ups) | Don't post when over-extended |
| Day 5 | r/passive_income | Generalist RE/income audience |
| Week 2 | Product Hunt (if prepped) | After learning what messaging resonated |

---

## Post-launch playbook (what to do when traffic arrives)

Skill emphasizes: "Your launch isn't over when the announcement goes live."

If HN lands (2,000-8,000 visitors in 24 hours):

**Within first hour:**
- Reply to every comment, especially critical ones
- Don't get defensive — agree publicly with valid criticism, fix small issues live (data refresh, typo, etc.)
- Pin a comment thread that surfaces the most asked question with a thoughtful answer

**Within first 24 hours:**
- Tweet the HN thread link from @BrickwisePro
- DM 5-10 people who commented thoughtfully — invite to subscribe
- Publish a "lessons from launch day" thread for X (this becomes future content)

**Within first 7 days:**
- Email list welcome sequence fires for new subs
- Publish blog post: "What people asked about Brickwise on HN" (recap = content)
- Add the most-requested feature/fix from comments (signals responsiveness)
- Reach out to 5 Algorand directory projects with the "we listed you" backlink ask
- Pitch 3 small RE/crypto Substacks for a mention or guest post

**Within first 30 days:**
- Decide if there's a paid tier signal in the data (do people actually want alerts? Survey the email list directly.)
- Launch comparison page for whichever platform appeared most in HN/Reddit comments
- Record 3 YouTube Shorts using the hooks that resonated most on launch posts

If HN flops (post dies in new queue):

- Do NOT repost. Reddit and X posts are independent — proceed.
- Submit "ask HN" within 4 weeks with a different framing (e.g., "Ask HN: How would you score risk for tokenized real estate?")
- Treat the writeup as evergreen — publish it on the blog regardless. Permalink it. Distribute via Reddit comment links over the next 2 months.

---

## Ongoing launch cadence (post-first-wave)

Your daily-refreshing data is your unfair advantage. Most launches die because there's nothing new to talk about after week 2. Brickwise has data movement every single day.

Recurring launch moments (set up before first-wave fades):

- **Weekly** — auto-generated "Top yield right now" tweet + blog snippet
- **Weekly** — newsletter: "5 buy signals this week, 2 to avoid"
- **Monthly** — market report at `/market/[date]` (already built — distribute it)
- **Quarterly** — "State of tokenized real estate Q[N]" PDF (annual-report-style, big link-bait piece)
- **As-needed** — new comparison page = mini-launch moment (X thread + Reddit drop in relevant sub)

Each of these is a small launch in the ORB sense. None require new product work.

---

## The single highest-leverage pre-flight action

**Build the seed audience.** Everything else in this audit is improvement at the margin. The HN post lives or dies based on whether the first 30 minutes produces signal. With 12 weekly visitors and 0 email subs, you have no native signal. DM 15-25 real people the day before. Honestly, no fake engagement. This is the difference between Brickwise reaching 5,000 weekly visitors and 12.

---

## Updated launch checklist

### Before pressing send on HN
- [ ] Lead magnet wired to email capture
- [ ] Methodology page live
- [ ] About the analyst page live
- [ ] Last updated timestamps on rankings
- [ ] HN account karma verified (or alternative submitter lined up)
- [ ] 15-25 personal DMs sent to seed engagement
- [ ] 2-hour engagement block scheduled for first hour after post
- [ ] 3-5 pre-drafted comment replies ready
- [ ] Email welcome sequence wired (3 emails)
- [ ] @BrickwisePro auto-tweet cron live (or scheduled manually for week 1)

### Launch day
- [ ] HN post live at 8-9am US Pacific (Tuesday or Wednesday)
- [ ] Within 30 min: reply to every comment, even critical
- [ ] Within 1 hour: tweet the HN link from @BrickwisePro
- [ ] Track Vercel Analytics referrers tab

### Within 7 days
- [ ] All Reddit posts published per revised sequence
- [ ] Email welcome sequence firing for new subs
- [ ] Blog recap of HN questions
- [ ] First 5 Algorand directory backlink asks sent
- [ ] First 3 newsletter/Substack pitches sent

---

## Done with this skill. Next recommended skill invocation

After launch lands, invoke:
- **`lead-magnets`** to flesh out the "Top 10 buy signals" magnet properly
- **`email-sequence`** to design the welcome series
- **`competitor-profiling`** to deepen the comparison page library based on what HN/Reddit asked about
- **`ai-seo`** to optimize `/llms.txt` and `/llms-full.txt` for the citations that will come post-launch
