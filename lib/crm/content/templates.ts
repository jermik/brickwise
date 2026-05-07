import type { ContentAngle } from "./types";

// Template definitions for the GrowthOS content engine. Each template is
// pure data — the generator substitutes {placeholders} at render time.
//
// Tone rules (enforced by every template):
//   - Honest framing: "could help", "potential opportunity",
//     "based on visible website signals"
//   - No fake claims, no "guaranteed clients"
//   - No spam instructions
//   - Mandatory CTA in the last 5 seconds
//
// Available placeholders:
//   {city}            "Rotterdam"
//   {city_upper}      "ROTTERDAM"
//   {niche}           "Gym"
//   {niche_lower}     "gym"
//   {niche_plural}    "gyms"
//   {niche_upper}     "GYM"
//   {audience}        "Freelancers"
//   {audience_lower}  "freelancers"
//   {n}               "20" (default)

export interface RawScene {
  durationSeconds: number;
  onscreen: string;
  voiceover: string;
  bRoll: string;
}

export interface ContentTemplate {
  id: ContentAngle;
  label: string;
  titleTemplate: string;
  hookTemplate: string;
  scenes: RawScene[];
  cta: string;
  captionTemplate: string;
  hashtagsBase: string[];
  pinnedComment: string;
  thumbnailTemplate: string;
  retentionNotes: string;
}

const COMMON_HASHTAGS = [
  "localbusiness",
  "freelance",
  "webdesign",
  "localseo",
  "agencylife",
];

// ── A — Discovery showcase ─────────────────────────────────────────────────

const TEMPLATE_A: ContentTemplate = {
  id: "discovery_leads",
  label: "A — Discovery showcase",
  titleTemplate: "I found {n} {niche_plural} in {city} with bad websites — in 2 minutes",
  hookTemplate:
    "I just found {n} {niche_plural} in {city} whose websites could be losing them clients — and it took me 2 minutes.",
  scenes: [
    {
      durationSeconds: 3,
      onscreen: "{n} {niche_upper}S · {city_upper} · 2 MIN",
      voiceover:
        "I just found {n} {niche_plural} in {city} whose websites could be losing them clients — and it took 2 minutes.",
      bRoll: "Screen recording: GrowthOS Discovery filter form opens",
    },
    {
      durationSeconds: 9,
      onscreen: "1. Pick country + city + niche",
      voiceover:
        "I picked the country, the city {city}, and the niche {niche_lower}.",
      bRoll: "Discovery filter being filled in: Country dropdown, city field, niche dropdown",
    },
    {
      durationSeconds: 12,
      onscreen: "2. OpenStreetMap finds local businesses",
      voiceover:
        "GrowthOS pulled real local businesses from public OpenStreetMap data — names, websites, phone numbers, addresses. No scraping.",
      bRoll: "Results table populating with rows; cursor scrolling through",
    },
    {
      durationSeconds: 14,
      onscreen: "3. Auto-audit each site",
      voiceover:
        "I selected the ones with weak websites and imported them. GrowthOS auto-analysed each homepage — title tags, meta description, mobile, contact form — and gave each a score.",
      bRoll: "Imported leads list with score rings filling in",
    },
    {
      durationSeconds: 17,
      onscreen: "4. See exactly who needs help",
      voiceover:
        "Now I have {n} {niche_plural} with audit scores, top problems, and a recommended offer for each. Based on visible website signals, these are real opportunities.",
      bRoll: "Lead detail page showing top-3 problems and suggested offer",
    },
    {
      durationSeconds: 5,
      onscreen: "Try GrowthOS",
      voiceover:
        "If you sell websites or local SEO, try GrowthOS. Link in bio.",
      bRoll: "GrowthOS landing page hero",
    },
  ],
  cta: "Link in bio. Try GrowthOS for your city.",
  captionTemplate:
    "{n} local {niche_plural} in {city} with website gaps — found in 2 minutes 🎯\n\nThis is what GrowthOS does: pulls local businesses from public data, audits their sites, and shows you who actually needs help.\n\nNo scraping. No spam. Just a faster start to personalised outreach.\n\nDrop your city in the comments and I'll show you what shows up there.",
  hashtagsBase: [...COMMON_HASHTAGS, "freelancer", "agency", "leadgen"],
  pinnedComment:
    "Q&A coming next — drop your city + niche below 👇 (this is for personalised outreach, not bulk spam)",
  thumbnailTemplate: "{n} {niche_upper}S\n{city_upper}",
  retentionNotes:
    "Hook in first 3s names a number + place + time (pattern interrupt). Show real screen recording, not stock. Each scene has a numbered title for visual scanability. Save the CTA for the last 5s — keep momentum until the final beat.",
};

// ── B — Audit breakdown ────────────────────────────────────────────────────

const TEMPLATE_B: ContentTemplate = {
  id: "audit_breakdown",
  label: "B — Audit demonstration",
  titleTemplate:
    "This {niche_lower} in {city} could be losing clients because of its website",
  hookTemplate:
    "I audited this {city} {niche_lower}'s website in 60 seconds. Here's what's likely costing them customers.",
  scenes: [
    {
      durationSeconds: 3,
      onscreen: "{niche_upper} · {city_upper} · 60s AUDIT",
      voiceover:
        "I audited this {city} {niche_lower}'s website in 60 seconds. Here's what could be costing them clients.",
      bRoll: "Mobile-frame screen recording of the prospect's homepage",
    },
    {
      durationSeconds: 12,
      onscreen: "Problem 1 — Not mobile-friendly",
      voiceover:
        "First, the site isn't mobile-friendly. Most local searches happen on phones — a slow, broken layout means the visitor bounces.",
      bRoll: "Mobile preview vs desktop preview side-by-side",
    },
    {
      durationSeconds: 13,
      onscreen: "Problem 2 — No local SEO",
      voiceover:
        "Second, the page title doesn't mention the city or service. Google has no signal to rank them locally.",
      bRoll: "View Source highlighting the title tag",
    },
    {
      durationSeconds: 13,
      onscreen: "Problem 3 — Hidden CTA",
      voiceover:
        "Third, there's no clear next step on the homepage. Visitors who want to book have to hunt for it.",
      bRoll: "Highlighting the missing CTA above the fold",
    },
    {
      durationSeconds: 14,
      onscreen: "Fix in a Local SEO Sprint",
      voiceover:
        "Three problems, a few hours of work. This is exactly what a Local SEO Sprint package is for — based on visible website signals, this could meaningfully help their lead flow.",
      bRoll: "GrowthOS audit page showing the score + suggested offer",
    },
    {
      durationSeconds: 5,
      onscreen: "GrowthOS in bio",
      voiceover:
        "Want this audit for your city? Link in bio.",
      bRoll: "GrowthOS landing page",
    },
  ],
  cta: "Link in bio. Audit a business in your city in 60 seconds.",
  captionTemplate:
    "Quick 60-second audit of a {city} {niche_lower}.\n\n3 visible website signals that could be costing them clients:\n• Not mobile-friendly\n• No local SEO in the title\n• No clear CTA above the fold\n\nThis is the kind of thing a Local SEO Sprint fixes in a few hours. Honest framing — based on what I can see, not guarantees.\n\nWhat do you check first when you audit a local site?",
  hashtagsBase: [...COMMON_HASHTAGS, "audit", "websiteaudit", "conversionoptimization"],
  pinnedComment:
    "Audit framework in next video. What's the first thing you check on a local site?",
  thumbnailTemplate: "60s\nAUDIT",
  retentionNotes:
    "Use mobile-frame screen recordings — they read faster than desktop on a vertical phone. Numbered problems (1, 2, 3) trigger a list-completion bias and pull the viewer to the resolution. Don't overclaim — say 'could be costing' not 'is costing'.",
};

// ── C — Proposal automation ───────────────────────────────────────────────

const TEMPLATE_C: ContentTemplate = {
  id: "proposal_flow",
  label: "C — Proposal automation",
  titleTemplate: "How I generate personalised proposals in 30 seconds",
  hookTemplate:
    "I used to spend an hour writing proposal emails. Now it's 30 seconds — without sounding like a template.",
  scenes: [
    {
      durationSeconds: 3,
      onscreen: "1 HOUR → 30 SECONDS",
      voiceover:
        "I used to spend an hour on every proposal email. Now it takes 30 seconds — and they don't read like templates.",
      bRoll: "Stopwatch graphic, then GrowthOS proposal page",
    },
    {
      durationSeconds: 10,
      onscreen: "Step 1 — audit the site",
      voiceover:
        "First, I run the audit. GrowthOS scores the website on four dimensions and surfaces the top three problems.",
      bRoll: "Audit form, scores filling in, top-3 problems list appearing",
    },
    {
      durationSeconds: 10,
      onscreen: "Step 2 — generate proposal",
      voiceover:
        "One click and it drafts a personalised email referencing the actual issues — not generic copy.",
      bRoll: "Generate Proposal button click, email tab populating",
    },
    {
      durationSeconds: 10,
      onscreen: "Step 3 — personalise + send",
      voiceover:
        "I read the draft, tweak the last ten percent, and send it manually. There's no bulk send and no automatic mailing — that's the whole point.",
      bRoll: "Operator editing the draft, then copy-to-clipboard",
    },
    {
      durationSeconds: 12,
      onscreen: "Plus a follow-up draft",
      voiceover:
        "Same package gives me a 3-day follow-up draft, a call script, and a pinned-comment idea. Nothing automated, just less blank-page time.",
      bRoll: "Tabs: initial email, follow-up email, call script",
    },
    {
      durationSeconds: 5,
      onscreen: "GrowthOS in bio",
      voiceover:
        "Try it — link in bio.",
      bRoll: "GrowthOS landing page",
    },
  ],
  cta: "Link in bio. Less blank-page time, more sent emails.",
  captionTemplate:
    "Personalised proposal in 30 seconds, not an hour ⏱\n\nGrowthOS pulls the audit findings into a draft email referencing the actual problems on their site. I review, tweak, send manually.\n\n→ no bulk send\n→ no auto-mailing\n→ no fake personalisation\n\nMandatory opt-out line is built into every draft.",
  hashtagsBase: [...COMMON_HASHTAGS, "salescopy", "coldemail", "outreach"],
  pinnedComment: "Yes the opt-out line is mandatory — every draft includes one.",
  thumbnailTemplate: "1 HOUR →\n30 SEC",
  retentionNotes:
    "Lead with the time-saved number — that's the real promise. Be explicit about NO bulk send and NO auto-mailing in both voiceover and caption — credibility on this is the whole brand.",
};

// ── D — Full workflow ─────────────────────────────────────────────────────

const TEMPLATE_D: ContentTemplate = {
  id: "full_workflow",
  label: "D — Full GrowthOS demo",
  titleTemplate: "From {city} {niche_plural} to outreach emails — in 5 minutes",
  hookTemplate:
    "Watch me go from zero to {n} ready-to-send personalised proposals for {city} {niche_plural} in 5 minutes.",
  scenes: [
    {
      durationSeconds: 4,
      onscreen: "0 → {n} PROPOSALS · 5 MIN",
      voiceover:
        "Zero to {n} ready-to-send proposals for {city} {niche_plural}. 5 minutes. No bulk tools. Watch.",
      bRoll: "Empty GrowthOS dashboard",
    },
    {
      durationSeconds: 12,
      onscreen: "Discover",
      voiceover:
        "Discovery: country, city {city}, niche {niche_lower}. OpenStreetMap returns local businesses. I select the ones with weak sites.",
      bRoll: "Discovery search → results → multi-select → import",
    },
    {
      durationSeconds: 12,
      onscreen: "Audit",
      voiceover:
        "Audit: each homepage gets fetched, parsed, and scored automatically across four dimensions.",
      bRoll: "Auto-analysis filling in audit checklists, scores updating",
    },
    {
      durationSeconds: 13,
      onscreen: "Propose",
      voiceover:
        "Proposals: GrowthOS picks the right offer for each lead's score profile and drafts a personalised email referencing the specific issues.",
      bRoll: "Lead detail with proposal generated, email tab visible",
    },
    {
      durationSeconds: 14,
      onscreen: "Follow up",
      voiceover:
        "Follow-ups: I review and send each draft manually. A 3-day follow-up auto-schedules. Hard cap at 2 chases per lead. Done.",
      bRoll: "Follow-ups page with leads queued",
    },
    {
      durationSeconds: 5,
      onscreen: "GrowthOS",
      voiceover:
        "Five minutes. Try it — link in bio.",
      bRoll: "GrowthOS landing CTA",
    },
  ],
  cta: "Link in bio. Try GrowthOS end-to-end.",
  captionTemplate:
    "Full GrowthOS workflow for {city} {niche_plural}:\n\n1. Discover (OSM, no scraping)\n2. Audit (auto, 4 dimensions)\n3. Propose (personalised, manual send)\n4. Follow up (capped at 2)\n\nNo bulk send. Ever. Built for personalised outreach to local businesses.\n\nThis is what an honest agency stack looks like in 2026.",
  hashtagsBase: [...COMMON_HASHTAGS, "agencyworkflow", "saas", "leadgen", "freelancer"],
  pinnedComment: "Build your own version of this stack? Reply with your tools — happy to compare.",
  thumbnailTemplate: "0 → {n}\n5 MIN",
  retentionNotes:
    "Four-act structure with on-screen step labels (Discover / Audit / Propose / Follow up) acts as a visual progress bar — viewers stay because they want to see all four. Keep each segment under 15s.",
};

// ── E — Education ─────────────────────────────────────────────────────────

const TEMPLATE_E: ContentTemplate = {
  id: "freelancer_education",
  label: "E — Education",
  titleTemplate: "How {audience_lower} actually find local clients in 2026",
  hookTemplate:
    "If you're a {audience_lower} waiting for referrals, you're leaving money on the table. Here's what actually works.",
  scenes: [
    {
      durationSeconds: 4,
      onscreen: "{audience_upper} · LOCAL CLIENTS",
      voiceover:
        "If you're a {audience_lower} waiting for referrals, you're leaving money on the table. Here's what actually works for finding local clients.",
      bRoll: "Quick montage of local-business storefronts",
    },
    {
      durationSeconds: 11,
      onscreen: "Step 1 — Pick a niche + a city",
      voiceover:
        "Pick one niche, one city. {niche_plural} in {city}, for example. Specific beats broad — it's easier to position yourself.",
      bRoll: "Map of {city}, niche dropdown highlighted",
    },
    {
      durationSeconds: 12,
      onscreen: "Step 2 — Find them on the map",
      voiceover:
        "Use a tool that pulls local businesses from public data — Google Maps, OpenStreetMap, your own list. Don't scrape platforms.",
      bRoll: "Discovery results loading",
    },
    {
      durationSeconds: 14,
      onscreen: "Step 3 — Audit before pitching",
      voiceover:
        "Look at their website before you reach out. Note two specific things you'd improve. Mention them by name in your message — that's what converts.",
      bRoll: "Audit checklist + top problems",
    },
    {
      durationSeconds: 14,
      onscreen: "Step 4 — Personalised outreach",
      voiceover:
        "Send a short, specific message manually. Include an opt-out line. Cap follow-ups at two. This is real local outreach — not spam.",
      bRoll: "Email draft with opt-out highlighted",
    },
    {
      durationSeconds: 5,
      onscreen: "Tools in bio",
      voiceover:
        "Tools to do all of this — link in bio.",
      bRoll: "GrowthOS landing page",
    },
  ],
  cta: "Link in bio for the full toolkit.",
  captionTemplate:
    "Real local outreach for {audience_lower} in 2026:\n\n1. Pick a niche + city (specific beats broad)\n2. Find businesses on public data — never scrape platforms\n3. Audit before pitching — note 2 specific issues\n4. Send personalised manual messages with an opt-out line\n5. Cap follow-ups at 2\n\nThat's it. No bulk send. No fake automation.",
  hashtagsBase: [...COMMON_HASHTAGS, "education", "businessgrowth", "freelancetips"],
  pinnedComment: "Save this for the next time you're tempted to buy a 'leads list'.",
  thumbnailTemplate: "LOCAL\nCLIENTS",
  retentionNotes:
    "Numbered list (1-2-3-4) is the proven retention pattern for educational shorts. Pause briefly after step 3 ('that's what converts') — the rhetorical bump keeps viewers through to step 4.",
};

// ── F — Product overview ───────────────────────────────────────────────────

const TEMPLATE_F: ContentTemplate = {
  id: "growthos_overview",
  label: "F — Product overview",
  titleTemplate: "GrowthOS in 60 seconds",
  hookTemplate:
    "GrowthOS in 60 seconds — the local outreach CRM for {audience_lower}.",
  scenes: [
    {
      durationSeconds: 3,
      onscreen: "GROWTHOS · 60s",
      voiceover:
        "GrowthOS in 60 seconds — the local outreach CRM for {audience_lower}.",
      bRoll: "GrowthOS logo, dashboard preview",
    },
    {
      durationSeconds: 10,
      onscreen: "What it is",
      voiceover:
        "It's a CRM built for selling websites, SEO, and automation services to local businesses. Discovery, audit, proposals, follow-ups — one workflow.",
      bRoll: "Sidebar tour: Dashboard → Discovery → Leads → Follow-ups",
    },
    {
      durationSeconds: 13,
      onscreen: "What it does",
      voiceover:
        "Pulls local businesses from public data. Audits their websites across four dimensions. Drafts personalised proposals you send manually. Schedules follow-ups, capped at two.",
      bRoll: "Quick cuts of each module",
    },
    {
      durationSeconds: 11,
      onscreen: "What it's not",
      voiceover:
        "It's not a bulk-email tool. It does not send anything automatically. There's no scraping and no broadcast feature. Manual outreach, organised.",
      bRoll: "Compliance section of GrowthOS landing page",
    },
    {
      durationSeconds: 13,
      onscreen: "Who it's for",
      voiceover:
        "{audience}, web designers, SEO consultants, small agencies — anyone selling services to local businesses who wants a more honest, more organised way to do it.",
      bRoll: "Use cases grid from landing page",
    },
    {
      durationSeconds: 5,
      onscreen: "Try it",
      voiceover:
        "Link in bio.",
      bRoll: "GrowthOS landing CTA",
    },
  ],
  cta: "Link in bio. Try GrowthOS.",
  captionTemplate:
    "GrowthOS — the local outreach CRM for {audience_lower}.\n\n→ Discover local businesses from public data\n→ Audit websites across 4 dimensions\n→ Generate personalised proposals\n→ Schedule capped follow-ups\n\nNo bulk send. No scraping. No fake automation. Built for personalised outreach to local businesses.",
  hashtagsBase: [...COMMON_HASHTAGS, "saas", "crm", "agencytool"],
  pinnedComment: "Free to try — link in bio. Replies welcome.",
  thumbnailTemplate: "GROWTH\nOS",
  retentionNotes:
    "Classic 'what it is / what it does / what it's not / who it's for' structure. The 'what it's not' beat is the highest-retention moment because it surprises viewers — most product videos avoid that section.",
};

// ── Index ──────────────────────────────────────────────────────────────────

export const CONTENT_TEMPLATES: Record<ContentAngle, ContentTemplate> = {
  discovery_leads: TEMPLATE_A,
  audit_breakdown: TEMPLATE_B,
  proposal_flow: TEMPLATE_C,
  full_workflow: TEMPLATE_D,
  freelancer_education: TEMPLATE_E,
  growthos_overview: TEMPLATE_F,
};
