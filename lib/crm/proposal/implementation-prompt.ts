// Deterministic "Implementation prompt" builder.
//
// Takes a finalised ProposalPackage + the upgrades the client agreed to +
// a chosen platform / access level, and returns one large copy-ready
// prompt for Claude Code. No LLM calls. No randomness. Same inputs →
// same output.
//
// The prompt itself is in English (so the engineering side stays
// universal) but it carries an explicit instruction telling Claude Code
// to write client-facing copy in the proposal locale (Dutch for nl).

import type { ProposalPackage, UpgradeKey } from "./package";

/** UI-friendly options. The UI also accepts "Other / unknown". */
export const PLATFORM_OPTIONS = [
  "WordPress",
  "Webflow",
  "Wix",
  "Squarespace",
  "Shopify",
  "Custom code (Next.js / static / framework)",
  "Unknown / other",
] as const;
export type PlatformOption = (typeof PLATFORM_OPTIONS)[number];

export const ACCESS_OPTIONS = [
  "GitHub repo",
  "CMS login",
  "SFTP / hosting panel",
  "Page-builder / editor access",
  "Browser only (read-only)",
  "Not yet shared",
] as const;
export type AccessOption = (typeof ACCESS_OPTIONS)[number];

/**
 * Canonical English titles for each upgrade key. The implementation prompt
 * is engineering-facing, so we pin these to English regardless of the
 * proposal's locale — Claude Code parses the same structure either way.
 */
const UPGRADE_TITLE_EN: Record<UpgradeKey, string> = {
  mobile: "Mobile optimisation",
  conversion: "CTA + conversion restructuring",
  speed: "Speed optimisation",
  trust: "Trust signal redesign",
  localSeo: "Local SEO sprint",
  booking: "Booking flow implementation",
  copy: "Hero + copy refresh",
  design: "Homepage redesign",
  analytics: "Analytics setup",
};

interface UpgradeGuidance {
  goal: string;
  whyItMatters: string;
  changes: string[];
  pagesAffected: string[];
  copySuggestions?: string[];
  technicalNotes: string[];
  testingChecklist: string[];
}

const UPGRADE_GUIDANCE: Record<UpgradeKey, UpgradeGuidance> = {
  mobile: {
    goal: "Make the entire site reliably usable on a 360 px-wide phone with one thumb.",
    whyItMatters:
      "The majority of local searches happen on mobile. A broken mobile layout silently caps every other improvement on this list.",
    changes: [
      "Confirm a correct viewport meta tag is in <head>: <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.",
      "Mobile-first CSS: ensure no fixed-width containers; use max-width: 100% on images and embeds.",
      "Tap targets minimum 44×44 px; body copy at least 16 px.",
      "Replace hover-only menus with click/tap variants; verify mobile menu opens, closes, and is keyboard-accessible.",
      "Audit horizontal-scroll bugs at 320 / 375 / 414 / 768 px widths.",
    ],
    pagesAffected: ["Homepage", "service pages", "contact page", "global header / footer"],
    technicalNotes: [
      "On WordPress, check the theme's responsive options first — patching theme CSS is more durable than fighting plugins.",
      "On Webflow, work in the mobile / mobile-landscape breakpoints in Designer; do not rely on inline styles.",
      "Avoid 100vh layouts on iOS Safari — they break with the address-bar resize.",
    ],
    testingChecklist: [
      "Real-device test: iOS Safari + Android Chrome.",
      "Lighthouse mobile score ≥ 80.",
      "All primary CTAs reachable without horizontal scroll.",
      "No layout shift after fonts load.",
    ],
  },
  conversion: {
    goal: "Give every visitor a single, obvious next action above the fold and remove unnecessary friction in the contact path.",
    whyItMatters:
      "Most pages already get traffic — the conversion gap is usually about clarity and friction, not volume.",
    changes: [
      "One primary CTA above the fold (Book / Quote / Call) — no competing buttons.",
      "Sticky tap-to-call / Book-now button on mobile bottom edge.",
      "Cut contact form to ≤ 3 fields (Name, Email or Phone, Message).",
      "Add a tel: link wherever the phone number appears.",
      "Make the contact path reachable from every page header.",
    ],
    pagesAffected: ["Hero / above-the-fold of homepage", "service pages", "global mobile footer", "contact page"],
    copySuggestions: [
      "CTA candidates: \"Book a free consultation\", \"Get a quote in 24 hours\", \"Call now to discuss\".",
      "Below-CTA reassurance: \"No obligation. We reply within 1 business day.\"",
    ],
    technicalNotes: [
      "If a sticky bottom CTA is added, reserve safe-area-inset-bottom for iOS notched devices.",
      "Keep the original CTA position too — the sticky version supplements, not replaces.",
    ],
    testingChecklist: [
      "Click each CTA from desktop and mobile — every one routes to the intended action.",
      "Submit the contact form with valid + invalid input.",
      "tel: link launches the dialer on a real phone.",
    ],
  },
  speed: {
    goal: "Bring Largest Contentful Paint under 2.5 s on a mid-range mobile + 4G connection.",
    whyItMatters:
      "Speed affects bounce rate AND search ranking. Each second of delay measurably reduces conversions.",
    changes: [
      "Convert hero / product images to WebP or AVIF; serve correctly-sized responsive variants.",
      "Defer non-critical scripts (chat widgets, analytics extras) with `defer` or `async`.",
      "Enable HTTP caching for static assets and CDN cache where available.",
      "Lazy-load below-the-fold images.",
      "Audit and remove unused plugins / scripts.",
    ],
    pagesAffected: ["Homepage", "any image-heavy page (gallery, services, blog index)"],
    technicalNotes: [
      "On WordPress, prefer a maintained image-optimisation plugin over manual conversion.",
      "On Webflow, rely on the built-in responsive image handling; check that all images use the responsive variants.",
      "Don't combine multiple optimisation plugins — they fight each other.",
    ],
    testingChecklist: [
      "PageSpeed Insights mobile LCP under 2.5 s.",
      "No Cumulative Layout Shift > 0.1.",
      "Web Vitals \"Good\" rating across LCP / FID / CLS.",
    ],
  },
  trust: {
    goal: "Surface real customer proof and verifiable trust signals near the primary CTA.",
    whyItMatters:
      "For local services, reviews and testimonials are the single strongest persuasion lever.",
    changes: [
      "Embed a Google reviews badge / widget on the homepage.",
      "Add 3–5 short, attributed customer testimonials (first name + city) near the CTA.",
      "Display the Google rating + review count if positive.",
      "Show certifications, association memberships, or media mentions where they exist.",
    ],
    pagesAffected: ["Homepage", "service pages", "footer"],
    copySuggestions: [
      "Header for social proof block: \"What our customers say\" or \"Wat klanten zeggen\" if Dutch.",
      "Always quote real customers — never fabricate testimonials.",
    ],
    technicalNotes: [
      "Use a privacy-respecting review embed where possible (e.g. self-hosted excerpts vs full third-party iframes).",
      "Add LocalBusiness + AggregateRating JSON-LD reflecting only real ratings — never invent.",
    ],
    testingChecklist: [
      "Every quoted testimonial is from a real customer with permission to use their first name.",
      "AggregateRating schema validates in Google's Rich Results Test.",
    ],
  },
  localSeo: {
    goal: "Rank the site for [service] in [city] searches relevant to the business's actual area.",
    whyItMatters:
      "Most prospects find local services through Google search and the Maps pack. Without local-SEO basics in place, the site is fighting national competitors.",
    changes: [
      "Rewrite the homepage <title> to: [Service] in [City] — [Business Name].",
      "Write a 150-character meta description featuring main service + city.",
      "Ensure one descriptive H1 on every page.",
      "Add a city / region landing page targeting [Service] in [City].",
      "Add LocalBusiness JSON-LD with hours, address, phone, and geo.",
      "Claim and complete the Google Business Profile (10+ photos, services, hours, request reviews).",
    ],
    pagesAffected: ["Homepage", "every service page", "new city / region landing page", "global head metadata"],
    copySuggestions: [
      "Title format: \"[Service] in [City] — [Business Name]\".",
      "Meta description: weave in service + city + a soft hook (\"Book a 15-minute consultation\").",
    ],
    technicalNotes: [
      "Avoid keyword stuffing — natural mentions only.",
      "If migrating URLs, set 301 redirects from old to new and update internal links.",
    ],
    testingChecklist: [
      "Each page has a unique title + description.",
      "JSON-LD validates in Google's Rich Results Test.",
      "Internal links from homepage point to the new city / service pages.",
    ],
  },
  booking: {
    goal: "Let customers self-serve the most common booking / quote requests outside business hours.",
    whyItMatters: "Self-serve booking captures bookings that would otherwise be lost to voicemail and email back-and-forth.",
    changes: [
      "Embed a booking widget for the most common service (Calendly, Setmore, SimplyBook, Fresha, Treatwell, etc.).",
      "Add an auto-acknowledgement email confirming receipt + expected response time.",
      "Add a quote-request flow with the same auto-reply if outright booking isn't possible.",
    ],
    pagesAffected: ["Homepage", "primary service page", "contact page"],
    technicalNotes: [
      "Pick a tool the client can administer themselves — they'll edit times more often than you will.",
      "Make sure the embed is GDPR-friendly (cookie consent + data-processing terms).",
    ],
    testingChecklist: [
      "Book a real test slot end-to-end — confirm the email / SMS arrives.",
      "Cancel / reschedule path works.",
      "Embed loads on mobile.",
    ],
  },
  copy: {
    goal: "Make the hero answer \"who is this for, what do they do, why should I care\" within 5 seconds.",
    whyItMatters:
      "Visitors who can't pin down the offer in seconds bounce — the most expensive UX problem after broken mobile.",
    changes: [
      "Rewrite the hero headline to a one-line offer (service + audience + why).",
      "Add a short sub-headline reinforcing the proof point or differentiator.",
      "Replace generic stock language with concrete specifics (locations served, years in business, named services).",
    ],
    pagesAffected: ["Homepage hero", "service pages above the fold"],
    copySuggestions: [
      "Hero formula: [What we do] for [audience] in [area]. [Outcome / promise].",
      "Sub-headline: 1 sentence that cites a concrete proof (years, customers, ratings) without inventing numbers.",
    ],
    technicalNotes: [
      "Keep new copy human — no AI-style em dashes, no jargon, no buzzwords.",
      "If translating to Dutch, use natural conversational Dutch — not literal translations of English idioms.",
    ],
    testingChecklist: [
      "5-second test: a stranger can describe what the business does after a brief glance.",
      "Hero copy passes a basic readability check (short sentences, no buzzwords).",
    ],
  },
  design: {
    goal: "Refresh the visual layer (typography, spacing, colour, imagery) without changing the brand or rebuilding the IA.",
    whyItMatters:
      "First impressions form within seconds. A dated visual style quietly lowers trust before anyone reads a word.",
    changes: [
      "Pick a single sans-serif body font + complementary display font; remove other font families.",
      "Tighten heading line-height; relax body line-height to ~1.6.",
      "Pick a 4 / 8 / 12 / 16 / 24 / 32 / 48 px spacing scale and apply consistently.",
      "Remove gradients, drop-shadows, and effects that aren't serving a purpose.",
      "Replace stock photography with the client's own imagery if available.",
    ],
    pagesAffected: ["Homepage", "service pages", "global header / footer"],
    technicalNotes: [
      "Do not change the brand colour palette without explicit approval from the client.",
      "Document the new spacing / typography scale in a short style notes file or README.",
    ],
    testingChecklist: [
      "Side-by-side review with the client before publishing.",
      "Check both desktop and mobile look consistent.",
    ],
  },
  analytics: {
    goal: "Install measurement so future improvements can be evaluated.",
    whyItMatters: "Without analytics, every marketing decision is guesswork.",
    changes: [
      "Install GA4 with the recommended events (page_view, click, form_submit, contact).",
      "Install Google Search Console; submit the sitemap.",
      "Add event tracking for primary CTAs (book, call, quote).",
      "If applicable, install a privacy-friendly analytics tool (Plausible / Fathom) for daily-use dashboards.",
    ],
    pagesAffected: ["Global head", "any page with a primary CTA"],
    technicalNotes: [
      "Respect the client's cookie / GDPR setup — measurement should not block consent.",
      "Use one source of truth — don't install both GA4 and a duplicate measurement product without a reason.",
    ],
    testingChecklist: [
      "GA4 real-time view shows your test visit.",
      "Search Console verifies the property and pulls coverage data.",
      "Each tracked CTA fires its event in GA4 DebugView.",
    ],
  },
};

export interface BuildImplementationPromptInput {
  pkg: ProposalPackage;
  selectedKeys: UpgradeKey[];
  platform: PlatformOption;
  access: AccessOption;
  /** Lead website URL (optional — included in the client-context block). */
  websiteUri?: string;
}

export function buildImplementationPrompt(
  input: BuildImplementationPromptInput,
): string {
  const { pkg, selectedKeys, platform, access, websiteUri } = input;
  const lines: string[] = [];

  lines.push(`# Implementation prompt — ${pkg.lead.businessName}`);
  lines.push("");
  lines.push(
    "> Generated by Brickwise. Paste this into Claude Code (or hand it to whoever is implementing) once you have access to the client's website.",
  );
  lines.push("");

  // 1. Client context
  lines.push("## 1. Client context");
  lines.push("");
  lines.push(`- **Business:** ${pkg.lead.businessName}`);
  lines.push(`- **Niche / category:** ${pkg.lead.category}`);
  lines.push(`- **City / location:** ${pkg.lead.city}`);
  lines.push(
    `- **Locale:** ${pkg.locale === "nl" ? "Dutch (nl) — client-facing copy must be in natural Dutch" : "English (en) — client-facing copy must be in clean idiomatic English"}`,
  );
  lines.push(`- **Website:** ${websiteUri ?? "(URL not yet shared)"}`);
  lines.push("");

  // 2. Website access
  lines.push("## 2. Website access");
  lines.push("");
  lines.push(`- **CMS / platform:** ${platform}`);
  lines.push(`- **Access available:** ${access}`);
  lines.push("");
  if (access === "Not yet shared") {
    lines.push(
      "> Access has not been shared yet. Ask the client for the appropriate credentials before starting any change.",
    );
    lines.push("");
  }

  // 3. Audit summary
  lines.push("## 3. Audit summary");
  lines.push("");
  lines.push(pkg.executiveSummary);
  lines.push("");
  if (pkg.priorityProblems.length > 0) {
    lines.push("**Top priority issues:**");
    lines.push("");
    pkg.priorityProblems.forEach((p, i) => {
      lines.push(`${i + 1}. **${p.title}** [${p.severity}]`);
      lines.push(`   - Why it matters: ${p.whyItMatters}`);
      lines.push(`   - Potential impact: ${p.potentialImpact}`);
      lines.push(`   - Suggested fix: ${p.howToImprove}`);
    });
    lines.push("");
  }

  // 4. Selected scope
  lines.push("## 4. Selected implementation scope");
  lines.push("");
  if (selectedKeys.length === 0) {
    lines.push(
      "_No scope selected. Pick the upgrades the client agreed to and regenerate this prompt._",
    );
    lines.push("");
  } else {
    for (const key of selectedKeys) {
      const upg = pkg.recommendedUpgrades.find((u) => u.key === key);
      const guidance = UPGRADE_GUIDANCE[key];
      if (!guidance) continue;
      const title = UPGRADE_TITLE_EN[key];
      const hours = upg
        ? `${upg.estimatedHours.min}–${upg.estimatedHours.max}h`
        : "estimate not available";

      lines.push(`### ${title}  (~${hours})`);
      lines.push("");
      lines.push(`- **Goal:** ${guidance.goal}`);
      lines.push(`- **Why it matters:** ${guidance.whyItMatters}`);
      lines.push("- **Exact changes to make:**");
      for (const c of guidance.changes) lines.push(`  - ${c}`);
      lines.push(
        `- **Pages / sections likely affected:** ${guidance.pagesAffected.join(", ")}`,
      );
      if (guidance.copySuggestions && guidance.copySuggestions.length > 0) {
        lines.push("- **Copy suggestions:**");
        for (const c of guidance.copySuggestions) lines.push(`  - ${c}`);
      }
      lines.push("- **Technical notes:**");
      for (const c of guidance.technicalNotes) lines.push(`  - ${c}`);
      lines.push("- **Testing checklist:**");
      for (const c of guidance.testingChecklist) lines.push(`  - [ ] ${c}`);
      lines.push("");
    }
  }

  // 5. Implementation rules
  lines.push("## 5. Implementation rules");
  lines.push("");
  lines.push("- Make focused changes only. Do not redesign the site unless the scope above explicitly requires it.");
  lines.push("- Preserve the existing brand identity (colours, typography, voice, imagery).");
  lines.push("- Never invent testimonials, reviews, ratings, or unverifiable claims.");
  lines.push("- Never remove existing content unless replacing it with explicitly authored copy.");
  lines.push("- Keep all changes SEO-safe: preserve URLs, redirects, canonical tags, and the sitemap.");
  lines.push("- Keep the site fully functional after every commit.");
  lines.push("- Document each change in the commit message and PR description.");
  if (pkg.locale === "nl") {
    lines.push(
      "- **Client-facing copy must be written in natural Dutch unless otherwise specified.** Use conversational Dutch, not literal translations of English phrasing.",
    );
  } else {
    lines.push("- Client-facing copy must be in clean, idiomatic English.");
  }
  lines.push("");

  // 6. Platform-specific notes
  lines.push("## 6. Platform-specific notes");
  lines.push("");
  lines.push(
    "- **If WordPress:** prefer theme / child-theme edits over plugin sprawl; check the page builder (Elementor / Divi / Gutenberg) before overriding CSS; flush cache after deploys (object cache, page cache, CDN).",
  );
  lines.push(
    "- **If Webflow:** make changes via the Designer where possible; preserve component instances; sync to staging before publish; export only as a last resort.",
  );
  lines.push(
    "- **If Wix or Squarespace:** structural HTML edits are limited — focus on copy, settings, and SEO panel changes; flag anything that needs custom code or a platform migration.",
  );
  lines.push(
    "- **If Shopify:** edit the active theme's Liquid via a duplicated theme; ship via theme preview link before going live; respect locked sections.",
  );
  lines.push(
    "- **If custom code (Next.js / static / framework):** branch from main, work in a PR, ensure CI passes, keep the deploy preview link, and include a one-line rollback note in the PR description.",
  );
  lines.push("");

  // 7. Deliverables
  lines.push("## 7. Deliverables");
  lines.push("");
  lines.push("Return:");
  lines.push("");
  lines.push("1. List of files / pages changed.");
  lines.push("2. Before / after copy excerpts for any client-facing text edited.");
  lines.push("3. A short implementation summary (3–5 bullets).");
  lines.push("4. The testing checklist with each item marked done / not done.");
  lines.push("5. Rollback notes (how to revert each change).");
  lines.push(
    "6. Commit hash if a code repo exists, or the equivalent CMS revision id.",
  );
  lines.push("");
  lines.push(
    `_Generated by Brickwise on ${new Date().toISOString().slice(0, 10)} for ${pkg.lead.businessName}._`,
  );

  return lines.join("\n");
}
