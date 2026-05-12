# FactuurDirect Marketing Skills Plan

**Current mode:** SEO maintenance (declared 2026-05-08, after Phase 1a shipped). Default = no infrastructure work. Priority shifted to product/content/conversion.

**Stack:** Vite + vite-react-ssg on Vercel. SSG-prerendered marketing routes; SPA fallback for app/auth. Repo: `jermik/factuur-maatje-plus`.

**Note:** Move this file into the FactuurDirect repo when you switch contexts.

---

## Step 0 — Foundational (do this first, once)

Trigger: **`product-marketing-context`**

Writes `.agents/product-marketing-context.md` in the FactuurDirect repo describing the product, ICP (Dutch freelancers/ZZP'ers building invoices?), positioning. ~10 min interactive Q&A. Every other marketing skill reads this file first.

---

## Active priority skills (trigger as tasks come up)

| Skill | When to trigger | Why it fits |
|---|---|---|
| `page-cro` | First. Audit homepage, pricing, signup. | Direct match for "conversion focus" mandate |
| `copywriting` | When improving existing page copy | No SEO infra change required |
| `onboarding-cro` | Post-signup activation in the SPA app | Big lever for SaaS; users sign up but don't activate |
| `signup-flow-cro` | If signup completion rate is low | Reduce friction in registration |
| `email-sequence` | Welcome / onboarding / dunning emails | Lifecycle automation |
| `pricing-strategy` | When considering tier or price changes | Van Westendorp, packaging |
| `content-strategy` | Planning content without building SEO infra | Editorial calendar, topic clusters |
| `churn-prevention` | If churn is a known issue | Cancel flows, save offers, dunning |
| `paywall-upgrade-cro` | Free-to-paid conversion moments | In-app upgrade prompts |

---

## Hold for later (don't trigger in SEO maintenance mode)

- `seo-audit` (marketing-skills version) — already have SEOmator-based version
- `programmatic-seo`, `schema-markup`, `ai-seo`, `site-architecture` — SEO infrastructure, explicitly frozen
- `paid-ads`, `ad-creative` — until organic conversion is proven
- `referral-program` — premature without retention proof
- `directory-submissions`, `aso-audit` — not aligned with current priorities

---

## How to trigger

- "Audit FactuurDirect pricing page for conversion" → `page-cro`
- "Write onboarding email sequence" → `email-sequence`
- "Why aren't users activating after signup?" → `onboarding-cro`
- "Should I raise prices?" → `pricing-strategy`

---

## Suggested sequence (first 3 moves)

1. `product-marketing-context` (10 min, one-time)
2. `page-cro` on homepage (highest leverage, fastest signal)
3. `onboarding-cro` on the post-signup flow (activation = retention foundation)
