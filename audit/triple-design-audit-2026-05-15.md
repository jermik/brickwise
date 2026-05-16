# Brickwise Triple-Skill Design Audit

**Date:** 2026-05-15
**Auditor:** Claude (impeccable + design-motion-principles + frontend-design lenses)
**Subject:** brickwise.pro (3 days old, launched 2026-05-12)
**Scope:** Homepage + /analyzer (highest-traffic deep page candidate)
**Stance:** Brickwise is a DATA product. Density is the spine. Do not strip it. Audit craft, not surface area.

---

## TL;DR

Brickwise has a real point of view. The dark bone+serif+mono palette with green/amber/red financial accents is genuinely distinctive, not generic Next.js SaaS. The Bloomberg-terminal HOLD vs BUY trade-ticket on the homepage is exceptional craft. The product earns its density.

The slip is in execution discipline: 665 em-dashes in source code (hard rule violation), Tailwind blue-500 (`#3b82f6`) leaking onto the analyzer's primary CTA, light-mode hex bleed in property-filters reset button, `transition-all` on two interactive surfaces, zero focus-visible states across the audited components, and a property-card framer-motion implementation that does the work of a CSS hover transition.

Three days old. Treat the below as a craft polish queue, not a redesign.

---

## 1. Impeccable lens (audit + critique + polish)

### Type system

**Shine.**

- Three-font system properly declared in `app/layout.tsx`: Inter (sans), DM Mono (numerics), DM Serif Display (display). All three with `display: swap` and CSS variables. Fontshare General Sans preloaded via non-blocking stylesheet with proper `preconnect`. This is the right setup.
- Mono font correctly reserved for numerics (`var(--font-dm-mono)` applied to yield, score, token price). Serif on section headings and property names. This pairing is the product's strongest visual signature.
- `fontVariantNumeric: "tabular-nums"` on the deltas in the HOLD/BUY trade-ticket. Correct.
- Tracking: 30px h1 has `tracking-[-0.3px]`, which is too loose. Mikey's own house rule is `-0.03em` on large display. At 30px that's roughly `-0.9px`. The hierarchy reads soft because the headline is fighting for presence against the dense info strip directly under it.

**Slip.**

- Homepage h1 is 30px. For a data product hero, 30px is timid. Compare against the 13px stat row sitting under it: the visual contrast is weak. Either push h1 to 36-42px with `tracking-[-0.04em]`, or push the stat row up to 14px monospace so the eye has a clear lead.
- Body copy at 12px (`text-[12px]`) appears in dozens of places: hero subtext, ranking sub-labels, comparison bars. 12px is sub-spec for body. It works as eyebrow/meta but is used here for primary reading text (e.g., the "476+ properties scored daily" lede). Bump primary body to 13px, keep 12px only for true metadata.
- `tracking-[0.04em]` on the eyebrow "Independent Tokenized RE Analytics" is fine. The deeper REVIEW · 01 / SWAP · 02 at `0.16em` is excellent and feels Bloomberg-grade.

### Color and contrast

**Shine.**

- Custom dark palette: `#0A0907` background (warm-black, not slate-900), `#F2EDE6` foreground (bone, not pure white). Avoids the default Tailwind dark-mode look entirely. This is the single biggest craft decision and it's right.
- Green `#22c55e` / amber `#f59e0b` / red `#ef4444` are emerald/amber/red-500 hex but live behind a non-default surface, so they read as "financial signals" not "Tailwind defaults."
- Liquid-glass effect in `globals.css` for landing hero logo chips is genuinely refined work.

**Slip.**

- `app/analyzer/page.tsx:229` and `:237`: primary Compare button hardcodes `background: "#3b82f6"` (Tailwind blue-500) plus a 12% tint variant. This is the textbook generic-SaaS color leaking onto the most visible CTA on the page. It contradicts every other CTA on the site which uses bone-on-charcoal (`#F2EDE6` background, `#0A0907` text). Replace with the bone primary, or commit to a fourth financial color (cyan, gold) defined in `globals.css` as a token. Right now it just looks like an unfinished migration.
- `components/property/property-filters.tsx:246`: reset button uses `background: "#fff5f5"; color: "#dc2626"; border: "1px solid #fecaca"`. Three light-mode hex values on a dark surface. The button will glow like a hazard sign. It needs the same `rgba(239,68,68,0.08)` / `#ef4444` / `rgba(239,68,68,0.22)` triad used on the avoid-cards (line 1027 of `app/page.tsx`). Cheap fix, ugly bug.
- The yellow accent `#C99846` in the REVIEW section (line 510, 536, 542) is beautiful and right. Nowhere else in the codebase. Either elevate it to a token (`--brand-gold`) and use it consistently, or accept that it lives only here, but at minimum add it to `globals.css` instead of inlining.
- `#7CA982` and `#9DC3A4` (mossy green in SWAP section, line 580, 638, 663, 677) same story. Lovely color, lives only in `app/page.tsx`. Token it.
- Faint scrollbar thumb is `#2A2420` matching the border token. Good.

### Hierarchy and information density

**Shine.**

- HOLD vs BUY trade-ticket grid (`grid-cols-[1.2fr_auto_1.2fr_auto]`) is the highest-craft moment on the site. The diamond glyphs, arrow SVG, mono delta pipe, and the bone-on-charcoal EXECUTE CTA together feel like a Bloomberg terminal repurposed for retail. This deserves to define the brand more loudly.
- Reality-check section with `REVIEW · 01` eyebrow and zero-padded line numbers reads like an editorial column. Excellent.
- 4-column Rankings grid with rank-1 highlighted green is restrained and useful.

**Slip.**

- The "Anti-hype" amber link sits between the email capture and the Best pick. It interrupts the natural read: hero → coverage strip → email → BEST PICK. The Anti-hype is more interesting than the email capture; consider swapping their order, or pushing the email capture below Best Pick entirely.
- Coverage strip (line 226) uses interpunct separators (`·`) styled in `text-[#e5e5e5]` which is a hardcoded near-white that doesn't honor the `--muted-foreground` token. Replace with `rgba(242,237,230,0.25)` to match the bone-tint system.
- Best Pick stats grid uses `gap: 1, background: "#2A2420"` (the border color used as a 1px grout). This is a known trick to fake hairlines without 4 separate borders. It works but is fragile: if the inner cells ever get rounded corners independently, the grout breaks. Note for the file.

### Cognitive load

The page is dense but the rhythm works because there's a strict alternation: hero → flat strip → loud trade-ticket → calm card → editorial review → trade-tickets → grid of cards → 4-up rankings → 3-up category breakdown → 3-up platform coverage → grid of avoids. The eye gets a beat between dense sections.

The only real cognitive-load failure: the homepage has TWO email capture widgets (line 258 and line 1085) for the same digest. Pick one. The second sits below "Properties to avoid" which is emotionally the wrong place to ask for an opt-in.

### Brand consistency

Tokens are declared in `globals.css` lines 32-65, but components routinely inline raw hex (`#F2EDE6`, `#22c55e`, `#131109`) instead of consuming `var(--foreground)` / `var(--green)` / `var(--card)`. Across the audited files: 57 inline-style blocks on the analyzer page alone, 76 duplicated hex literals. This means a future token change requires global find-and-replace, not a single line edit. Not a launch blocker. A six-month tech-debt note.

### Em-dashes in source code (hard-rule violation)

665 em-dash characters across 109 source files. Worst offenders:

- `lib/crm/content/templates.ts`: 64
- `lib/data/properties.ts`: 63
- `lib/crm/content/types.ts`: 29
- `app/learn/what-is-tokenized-real-estate/page.tsx`: 22
- `app/llms-full.txt/route.ts`: 20

This is Mikey's hardest house rule. Most are in CRM content templates and seed data, which means they propagate into LLM output, generated proposals, and content marketing pages. A one-time find-and-replace pass (` — ` → `. `, `  --  ` → `, `) will take an hour and remove the AI-text fingerprint from every downstream artifact.

---

## 2. Design-motion-principles lens (Kowalski / Krehel / Tompkins)

### Inventory of motion in the audited code

- `globals.css` defines two keyframes: `marquee` (translateX, used somewhere on landing) and `fadeInUp` (opacity + 18px translateY, used as `.reveal` with `cubic-bezier(0.16, 1, 0.3, 1)`). This is Kowalski's signature easing curve. Correct choice.
- `.reveal-1` through `.reveal-6` stagger 70ms apart. Tight, restrained, not theatrical. Good.
- `components/ui/score-ring.tsx`: pure SVG circle with `strokeDasharray`. **No animation.** Static. The score ring is the product's hero data primitive. It should draw on viewport entry.
- `components/property/property-card.tsx`: uses `framer-motion` (`motion.div`, `motion.img`) but the implementation does work a CSS hover transition could do. Three motion components, no `whileHover` / `whileInView` / `initial`+`animate` props visible in the snippets. Either commit to motion properly or drop framer-motion from this component and save the bundle.
- `components/landing/hero.tsx`: zero motion. No framer, no reveal classes detected. Static.
- `components/analyzer/chart-view.tsx`: zero motion, no framer.

### Per-designer critique

**Emil Kowalski** would say: easing curve and stagger are correct, but the motion budget is unused on the elements that matter most. Score rings, yield bars, and the SWAP delta pipes should `whileInView` with a 400ms ease-out. Not as decoration, as a way to draw the eye to the number that just resolved. He'd also flag that the property-card image has `transition-transform duration-300 group-hover:scale-[1.03]` (homepage line 347) which is fine, but the card itself doesn't lift. A 2-3px upward translate on hover (`group-hover:translate-y-[-2px]`) with the same 300ms feels less like a stock photo and more like a UI surface.

**Jakub Krehel** would call out the two `transition-all` usages (`app/analyzer/page.tsx:134`, `components/property/property-card.tsx:161`). `transition-all` will animate any layout-affecting property that ever changes, including ones added later by a maintainer who didn't know. Always name the property: `transition-[opacity,transform,background-color]`. Cheap, fast, correct.

**Jhey Tompkins** would push for one signature motion moment. Brickwise has none. The HOLD vs BUY trade-ticket is begging for a 600ms entrance where the HOLD column fades in, then the arrow draws (stroke-dashoffset), then the BUY column fades in, then the +€ delta counts up. That's a 1.2-second sequence that turns a screenshot into a video and makes the product feel alive. Build it once in a `<SwapTicket>` component, run `whileInView once`, done.

### Loading states

Not audited (deep-page coverage). The homepage and analyzer both render server-side from `PROPERTIES` constant so there's no skeleton state visible. Flag for later: when the daily refresh runs, what does the analyzer look like mid-fetch? Suspense boundary with a 4-column skeleton matching the existing grid.

### Verdict

Motion intent is right (Kowalski curve, staggered reveals) but motion coverage is shallow. Add motion to the score ring (mandatory) and the SWAP trade-ticket (optional but transformative). Strip `transition-all`. Drop framer-motion from property-card unless it does something a CSS transition cannot.

---

## 3. Frontend-design lens (bar-setting)

### Where Brickwise clears the bar

- Custom palette derived from a coherent warm-dark foundation, not Tailwind defaults. Pass.
- Three-font system with mono numerics. Pass and exceeds.
- Grain overlay in `globals.css` (line 144-154). 2.8% opacity SVG noise on `body::before`. Adds texture depth that 99% of Next.js SaaS sites lack. Pass.
- Liquid-glass shimmer effect on logo chips (line 92-121). Genuinely refined work, the kind of detail that signals "someone cared." Pass.
- Bloomberg-style trade-ticket layout for swap suggestions. Distinctive. Pass.
- Editorial eyebrows (`REVIEW · 01`, `SWAP · 02`, `SAME CAPITAL`) with mono tracking and zero-padded numerals. Pass.

### Where Brickwise slips into generic Next.js SaaS

- Hardcoded Tailwind blue `#3b82f6` on the analyzer's primary CTA. The single biggest visual offender. The product's whole identity is "we're not crypto-bro-blue, we're financial-paper-bone" and then the most-clicked button on the highest-traffic deep page is crypto-bro-blue.
- Light-mode color leakage in the property-filters reset button (`#fff5f5` / `#dc2626` / `#fecaca`). Reads as a half-finished port from a light-theme template.
- Most components inline raw hex instead of consuming the CSS variable tokens. The tokens exist, they're just not used. This is the visible signature of a "vibe-coded" component, not a designed one. Refactor in passes, not all at once.
- Zero `focus-visible` styles across the audited components. Every button has a hover state, none have a keyboard-focus state. Accessibility gap and a craft gap. Add a global `:focus-visible { outline: 2px solid #C99846; outline-offset: 3px; }` in `globals.css`.
- Two `transition-all` usages. Cheap fix.
- Property-card framer-motion implementation is decorative, not functional. Either commit or drop.

### Bar-setting components nominated

Promote the SWAP trade-ticket pattern to its own component (`<SwapTicket>`) and use it on `/portfolio`, `/watchlist`, and in email digest screenshots. It's the single most distinctive surface on the site. Don't bury it on the homepage.

---

## Top 3 critical issues

Visible to every visitor on the most-trafficked routes. Fix this week.

### C1. Tailwind blue-500 on the analyzer's primary CTA

**File:** `app/analyzer/page.tsx`
**Lines:** 229-231, 237-239
**Issue:** `background: "#3b82f6"` on Compare button and `rgba(59,130,246,0.12)` on its tint. Contradicts the brand palette established everywhere else on the site. Looks like default Tailwind.
**Fix:** Replace with bone primary `background: "#F2EDE6", color: "#0A0907"` to match all other primary CTAs (e.g., homepage line 484, EXECUTE buttons line 719). Or commit a brand-cyan token if you want a tertiary color, but define it once in `globals.css` and reuse.
**Effort:** 5 minutes.

### C2. 665 em-dashes in source code

**Worst offenders:** `lib/crm/content/templates.ts` (64), `lib/data/properties.ts` (63), `app/compare/**` pages, `app/learn/**` pages.
**Issue:** Mikey's hard rule. Em-dashes are the AI-text fingerprint. They propagate from seed data into the rendered site (e.g., property `shortDescription` fields), into generated CRM content, into email digests. Every visitor sees them.
**Fix:** Global find-and-replace pass: replace ` — ` with `. ` or `, ` depending on context, `--` with the same. Then add a Vitest assertion that scans `lib/**` for the character and fails CI.
**Effort:** 60 minutes for the pass, 15 minutes for the CI guard.

### C3. Property-filters reset button is light-mode-bleed

**File:** `components/property/property-filters.tsx`
**Line:** 246
**Issue:** `background: "#fff5f5"; color: "#dc2626"; border: "1px solid #fecaca"`. Three light-mode hex values inside a dark-theme product. Will glow like a hazard sign next to every other element.
**Fix:** Use the dark-theme red triad already in use on avoid-cards: `background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.22)"`.
**Effort:** 2 minutes.

---

## Top 5 quick wins (under 30 minutes each)

### Q1. Strip `transition-all`

**Files:**
- `app/analyzer/page.tsx:134` (compare-mode toggle button)
- `components/property/property-card.tsx:161` (Best Buy badge overlay)

**Fix:** Replace `transition-all` with `transition-[opacity,transform,background-color]` (or `transition-colors transition-transform` if Tailwind only).
**Effort:** 5 minutes total.

### Q2. Add global `:focus-visible` ring

**File:** `app/globals.css` (add to `@layer base`)
**Fix:**

```css
@layer base {
  :focus-visible {
    outline: 2px solid #C99846;
    outline-offset: 3px;
    border-radius: 3px;
  }
  button, a, input, select { outline: none; }
  button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible {
    outline: 2px solid #C99846;
    outline-offset: 3px;
  }
}
```

The gold accent (`#C99846`) already lives in the REVIEW section. Promoting it as the focus color also doubles as the start of brand-token consolidation.
**Effort:** 10 minutes.

### Q3. Animate the ScoreRing on viewport entry

**File:** `components/ui/score-ring.tsx`
**Fix:** Wrap the foreground circle in `motion.circle` (framer-motion is already in deps), animate `strokeDashoffset` from `circ` to `circ - dash` with `whileInView`, `viewport={{ once: true, margin: "-50px" }}`, `transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}`. Use the same Kowalski curve already in `globals.css`.
**Effort:** 20 minutes.

### Q4. Promote brand-gold and brand-moss to tokens

**File:** `app/globals.css`
**Fix:** Add to `:root`:

```css
--brand-gold: #C99846;
--brand-gold-soft: rgba(201,152,70,0.65);
--brand-moss: #7CA982;
--brand-moss-soft: #9DC3A4;
```

And add `--color-brand-gold` etc. to `@theme inline`. Then in `app/page.tsx` lines 510, 536, 542, 580, 618, 638, 663, 677 swap raw hex for `var(--brand-gold)` / `var(--brand-moss)`. Mechanical change, big tidy.
**Effort:** 25 minutes.

### Q5. Remove duplicate email capture

**File:** `app/page.tsx`
**Lines:** Either remove block at 258-264 OR block at 1083-1090.

**Recommendation:** Keep the bottom one but move it BEFORE the "Properties to avoid" section (currently at line 1008). Emotional logic: ask for the opt-in after the value is delivered (best pick + rankings) and before the negative section, not after.
**Effort:** 5 minutes.

---

## Top 3 deeper improvements (1+ hour, queue for later)

### D1. Token-consolidation pass

**Why:** Every component currently inlines raw hex values (`#F2EDE6`, `#22c55e`, `#131109`, `#2A2420`) instead of using the tokens already defined in `globals.css`. 76+ duplicated hex literals on the analyzer page alone. This blocks any future theming work (light mode, white-label, accessibility variant).

**Approach:** One PR per route. Start with `app/page.tsx` (homepage). Replace every raw hex with its `var(--token)` equivalent. Add a Vitest snapshot test that the rendered DOM contains only known tokens.

**Effort:** 4-6 hours spread across the active routes.

### D2. SwapTicket component + signature motion

**Why:** The HOLD vs BUY trade-ticket on the homepage (line 597-732) is the most distinctive piece of UI on the entire site. It's also inline in the homepage file and not reusable.

**Approach:**
1. Extract to `components/portfolio/swap-ticket.tsx`.
2. Add a `whileInView` choreographed entrance: HOLD column fades+slides in (200ms), arrow path draws via stroke-dashoffset (300ms), BUY column fades+slides in (200ms), delta `+€X,XXX` counts up from 0 (400ms). Total ~1100ms.
3. Use it on `/portfolio` and `/watchlist` and embed a static SVG screenshot of it in the weekly email digest. That signature motion becomes the brand.

**Effort:** 2-3 hours.

### D3. Typography retune for the data-product role

**Why:** Density is the spine, but the spine is currently set in 12px body type, 30px h1. Both feel undersized for a serious financial product. The serif/mono/sans system is right; the sizes are timid.

**Approach:**
- Homepage h1: 30px → 38px, `tracking-[-0.04em]`, `leading-[1.05]`.
- Section headings (currently 18px serif): 18px → 21px.
- Primary body (currently 12px): 12px → 13px. Keep 11-12px for metadata only.
- Mono numerals in the Best Pick stats grid (13px): bump to 15-16px. Numbers are the product, let them lead.

**Effort:** 1-2 hours. Mostly mechanical, requires a screenshot diff pass to check no layouts break.

---

## Per-skill verdict

**Impeccable.** Shine: warm-dark palette, three-font system, editorial eyebrows, mono numerics, trade-ticket layout, grain overlay, liquid-glass detail. Slip: 665 em-dashes, blue-500 on analyzer CTA, light-mode bleed in filter reset, raw hex instead of tokens, undersized body type, zero focus-visible rings.

**Design-motion-principles.** Shine: Kowalski easing curve correctly chosen, staggered reveals on hero, 70ms stagger interval. Slip: motion is decorative not functional, score ring is static (should draw in), framer-motion in property-card does work CSS could do for free, `transition-all` in two places, no signature motion moment. Krehel and Tompkins would both file the same complaint: you have the easing right and the philosophy right, you just haven't deployed it on the elements that matter.

**Frontend-design.** Shine: distinctive enough to be recognizable as Brickwise, not Next.js-shadcn-template. Slip: the moments where it slips into generic SaaS are all small, fixable, and all on the highest-traffic surfaces. Fix the analyzer CTA and the focus rings and the bar moves from "distinctive" to "production-grade."

---

## Portfolio coherence vs wbsoboekhouder.nl

These are two different products with two different identities.

- **wbsoboekhouder.nl:** warm-light "ink/paper/orange" palette, Fraunces serif + sans pairing, cubic-bezier(.2,.9,.3,1) motion, rigorous `:focus-visible` outlines on every interactive surface, no third-party scripts, inline CSS tokens. Looks like a Dutch accounting publication, intentionally analog.
- **Brickwise.pro:** dark warm-black "bone/cream + green/amber/red" palette, DM Serif Display + Inter + DM Mono, cubic-bezier(0.16, 1, 0.3, 1) reveals, grain overlay, liquid-glass detail. Looks like a Bloomberg terminal for retail.

They do NOT feel like the same brand and they SHOULDN'T. wbsoboekhouder sells trust to Dutch SMBs, Brickwise sells signal to retail crypto/RE investors. Different audiences, different surface treatments.

What ties them together as Mikey's portfolio:
- Both pair a display serif with a clean sans. Both use mono for numerals.
- Both avoid Tailwind default palettes (well, brickwise mostly avoids).
- Both use cubic-bezier custom easing, not default Tailwind transitions.
- Both write copy that doesn't sound like a template.
- Both ship without sycophantic openers or em-dash padding (modulo the 665 source-code em-dashes, which leak into rendered text).

Verdict: two distinct identities, same craftsperson. That's the right answer for a multi-brand portfolio. Coherence at the philosophy level, not the surface level. The single thing that would unify them more is fixing the em-dash leak: wbsoboekhouder is much cleaner on this axis, Brickwise drags the average down.

---

## What this audit explicitly does NOT recommend

- Stripping data density. The dense card grids, the 4-column rankings, the 3-column category breakdowns, the SWAP trade-ticket. Keep all of it. The density IS the product.
- Adding hero illustrations or marketing imagery. The current property photographs serve double duty as data and as visual. Adding decorative imagery would dilute that.
- A redesign. The product is 3 days old, the foundation is solid. This is a craft polish queue, not a rebuild.
- Switching off framer-motion. Keep it. Use it on the score ring and the swap ticket. Drop it from property-card unless you commit to a real `whileHover` choreography.
- Light mode. The warm-dark palette IS the identity. Don't undermine it.

---

## File inventory referenced

- `app/globals.css` (155 lines, token definitions)
- `app/layout.tsx` (171 lines, three-font system)
- `app/page.tsx` (1110 lines, homepage)
- `app/analyzer/page.tsx` (450 lines, deep-page audited)
- `components/property/property-card.tsx` (191 lines, framer-motion + transition-all)
- `components/property/property-filters.tsx` (256 lines, light-mode bleed bug)
- `components/ui/score-ring.tsx` (static, animation candidate)
- `components/ui/score-bar.tsx` (static, animation candidate)
- `components/landing/hero.tsx` (307 lines, zero motion)
- `lib/crm/content/templates.ts` (64 em-dashes)
- `lib/data/properties.ts` (63 em-dashes)

---

End audit.
