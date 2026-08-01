# Refresh Brief: `/learn/how-to-invest-in-tokenized-real-estate`

**Date:** 2026-08-01  
**Mode:** Monthly Refresh — Early Advisory  
**Eligibility note:** Page last committed 2026-06-11 (51 days). 90-day threshold not met until 2026-09-09. Brief is advisory — act on it in September or when platform onboarding flows change materially.

---

## Page facts

| | |
|---|---|
| Route | `/learn/how-to-invest-in-tokenized-real-estate` |
| File | `app/learn/how-to-invest-in-tokenized-real-estate/page.tsx` |
| Primary keyword | `how to invest in tokenized real estate` |
| H1 | (inferred from code) Step-by-step guide framing |
| Last committed | 2026-06-11 |
| Current steps | 1) Choose platform → 2) Create account + KYC → 3) Fund account → 4) Research properties |

---

## Current angle vs SERP intent

**Current angle:** Linear step-by-step guide. Four confirmed steps (from code review): choose platform, complete KYC, fund account, research properties. Data-anchored with live counts and averages from PROPERTIES.

**Likely SERP intent (keyword: "how to invest in tokenized real estate"):** High-funnel, beginners who are close to acting. SERP intent typically includes:
- A clear numbered list (already present — good)
- A "minimum viable start" amount (currently $50 — this will need updating if platforms change minimums)
- A "how do I actually get the USDC?" explainer (ACH → exchange → USDC → wallet is still non-obvious for many users)
- A "what to do after you buy" section (how to track income, how to reinvest, when to sell)
- A "common mistakes" or "what to avoid" section — this is a high-engagement format that competitors use

**Live SERP check:** Could not fetch — proxy blocked external access. Owner should run `google.com/search?q=how+to+invest+in+tokenized+real+estate` and check:
- Whether top results include YouTube/video results (signal that user wants visual onboarding)
- PAA questions — add any not currently in the page
- Whether a "beginner's step-by-step" article with 8+ steps outranks the current 4-step format

---

## Gaps in current content

1. **Only 4 confirmed steps; stops at "Research properties."** A complete guide should include at minimum: buying the token (actual transaction mechanics), receiving and tracking income, understanding your first payout, and what to do in year 2 (tax reporting, DRIP decision, portfolio rebalancing). The current guide ends before the investor actually completes a purchase.
2. **No "How to get USDC to fund your account" section.** The single most common friction point for first-time tokenized RE investors is the fiat-to-USDC conversion. The guide should address this: buy USDC on Coinbase/Kraken, send to wallet, deposit to platform — with notes on the Algorand vs Ethereum wallet distinction. {TODO: verify current fastest fiat-to-USDC path for each platform}.
3. **No "Common mistakes to avoid" section.** High-engagement format. Candidates: buying the highest-yield property without checking the risk score, concentrating in one city, ignoring the PMM spread on Lofty, using an exchange wallet instead of a self-custody wallet, failing to declare USDC distributions as income. None require fabricated data.
4. **No "How to use Brickwise to choose a property" integration.** This is the most natural place to promote the Brickwise score — a reader who has decided to invest is a qualified audience for our score methodology. A brief "Before you buy, run it through Brickwise" callout with a link to the analyzer would close the conversion loop.
5. **No "What happens after you buy" section.** First-time investors don't know what to expect: when does the first payout arrive, why was it less than the advertised yield, what is a K-1, how do I see my portfolio. This section reduces post-purchase anxiety and supports retention.
6. **No Algorand wallet setup section for Lofty.** The KYC step mentions needing a wallet, but doesn't explain Pera Wallet setup (the recommended Algorand wallet). This is a common drop-off point for new Lofty investors. {TODO: confirm current recommended Algorand wallet — MyAlgo is being deprecated; Pera appears to be the current standard}.

---

## Proposed new H2 sections

Add these — to be inserted into the existing numbered step flow, or as a "Before you start" + "After you buy" frame around the existing steps:

1. **Before You Start: What You'll Need** — Bullet list: government-issued ID (for KYC), a US bank account or USDC in a crypto wallet, an Algorand wallet (for Lofty), an Ethereum wallet (for RealT), 15–30 minutes for KYC. Keeps beginners from starting and dropping off mid-flow.
2. **Step 2.5 (or a separate step): Get USDC** — How to go from USD in a bank account to USDC in a wallet, for each platform. Simplified: bank → Coinbase → USDC → Pera Wallet (Lofty) or MetaMask (RealT). Note: this step can be done in parallel with KYC. {TODO: confirm current easiest on-ramp path per platform — verify Coinbase is still available for both chains without conversion fees}.
3. **How to Use Brickwise to Pick a Property** — Brief "here's how to read a Brickwise score" section with a CTA to `/analyzer`. Explain: score 0–100, yield weight 30%, risk 25%, neighborhood 20%, fair value 25%. Show one example of a "Buy" vs "Avoid" property comparison. Do not invent specific addresses — pull from current data or use a generic example.
4. **What to Expect After Your First Purchase** — Timeline: 24–48h for first payout on Lofty (daily), 7 days for RealT (weekly). Notes: the first payout may be prorated. USDC arrives in your connected wallet automatically. No action needed to receive income. How to check your wallet balance (Pera Wallet app for Algorand; any Ethereum wallet for RealT).
5. **Common Mistakes to Avoid** — Numbered list, 5–7 items. Examples: buying highest-yield without checking risk score (the "yield trap"), concentrating in one city, holding tokens on an exchange wallet (not self-custody), ignoring PMM spread when comparing prices, not planning for tax reporting in year one.
6. **Tax Implications: What to Know Before You Start** — Brief intro-level explainer: distributions are typically ordinary income, the platform (or your CPA) may provide a K-1 or 1099. Crypto wallet transactions may require Form 8949. Not tax advice. Link out to resources. {TODO: confirm whether Lofty and RealT issue K-1 or 1099 for the current tax year}.

---

## Internal-link opportunities

**Link FROM this page TO:**
- `/analyzer` — already linked via "Research properties" step. Ensure this is prominent.
- `/learn/lofty-review` — add: "Read our full Lofty review before signing up."
- `/learn/realt-review` — same for RealT.
- `/compare/realt-vs-lofty` — add in the "Choose your platform" step.
- `/methodology` — add in the "How to use Brickwise" section.
- `/rankings/highest-yield` and `/rankings/buy-signals` — add as next steps after buying first property.
- `/algorand` — add when explaining Algorand wallet setup.

**Link TO this page FROM:**
- `/learn/what-is-tokenized-real-estate` — add "Ready to invest? See our step-by-step guide."
- `/compare/best-fractional-real-estate-platforms` — add in the "getting started" section.
- `/compare/realt-vs-lofty` — add after the verdict: "Ready to start? Follow our step-by-step investing guide."
- `/page.tsx` (home) — check whether the home page links to this guide for new visitors.

---

## Stat / data refresh points

The page pulls `count`, `avgYield`, and `buyCount` dynamically from PROPERTIES — good. Hardcoded items to verify:

- `{TODO: confirm "$50–100 minimum effective deposit" is still accurate for both platforms}`
- `{TODO: confirm Pera Wallet is still the recommended Algorand wallet for Lofty — MyAlgo status?}`
- `{TODO: confirm KYC timeline "1–24 hours" — has this changed for either platform?}`
- `{TODO: confirm ACH / wire deposit options are still available on both platforms}`
- `{TODO: verify whether direct USDC deposit is still supported on both platforms}`
- `{TODO: confirm that non-US investors can still access some Lofty/RealT properties — has this changed?}`

---

## Human action required

1. Run live SERP check for "how to invest in tokenized real estate" and "buy real estate tokens step by step" — note step count in top results and any unique sections competitors include.
2. Test the Lofty and RealT onboarding flow (or verify with platform docs) to confirm current steps are still accurate.
3. Verify Algorand wallet recommendation (Pera vs MyAlgo) with current platform documentation.
4. Write new sections per this brief — do not use brief text as copy.
