// ─────────────────────────────────────────────────────────────────────────
// Proposal Package — locale-aware (en | nl).
//
// Pure deterministic derivation from Lead + RichAudit + LeadScore. No
// machine translation; Dutch prose is hand-authored. Same inputs always
// produce the same output for a given locale.
// ─────────────────────────────────────────────────────────────────────────

import type { Lead } from "../types";
import type { AuditIssue, IssueSeverity, RichAuditData } from "../audit/types";
import type { LeadScore } from "../lead-scoring/types";
import { buildLocalizedIssues, type Locale } from "../audit";
import { OFFER_TEMPLATES, getOffer } from "../types";

export type { Locale };

// ── Types ─────────────────────────────────────────────────────────────────

export interface PriorityProblem {
  title: string;
  severity: IssueSeverity;
  whyItMatters: string;
  potentialImpact: string;
  howToImprove: string;
}

export interface RecommendedUpgrade {
  title: string;
  shortExplanation: string;
  expectedBenefit: string;
  difficulty: "easy" | "medium" | "hard";
  priority: 1 | 2 | 3;
  estimatedHours: { min: number; max: number };
  relatedOfferId?: string;
  relatedOfferName?: string;
  relatedOfferPrice?: string;
}

export interface OutreachEmail {
  subject: string;
  body: string;
  recipient?: string;
}

export interface ProposalPackage {
  locale: Locale;
  generatedAt: string;
  lead: { id: string; businessName: string; city: string; category: string };
  executiveSummary: string;
  priorityProblems: PriorityProblem[];
  recommendedUpgrades: RecommendedUpgrade[];
  outreachEmail: OutreachEmail;
  followUpEmail: OutreachEmail;
  fullProposalText: string;
}

// ── Locale strings ────────────────────────────────────────────────────────
//
// All visible prose is collected here per locale so a translator (or an
// agency wanting to fork the tone) only has to touch one place.

interface LocaleStrings {
  /** Returns a full clause that fits the executive-summary sentence pattern. */
  ratingPhrase: (score: number) => string;
  dimensionLabels: Record<"mobile" | "conversion" | "localSeo" | "speed" | "trust" | "copy", string>;
  executiveSummary: (lead: Lead, audit: RichAuditData) => string;
  subjectVariants: (lead: Lead) => string[];
  outreachBody: (lead: Lead, audit: RichAuditData, topUpgradeTitle: string) => string;
  followUpBody: (lead: Lead) => string;
  optOut: string;
  upgradeCopy: Record<UpgradeKey, { title: string; shortExplanation: string; expectedBenefit: string }>;
  fullProposalLabels: {
    title: (name: string) => string;
    executiveSummary: string;
    priorityIssues: string;
    recommendedUpgrades: string;
    why: string;
    impact: string;
    fix: string;
    benefit: string;
    work: string;
    fitsIn: (offerName: string, price: string) => string;
    footer: string;
    priorityHigh: string;
    priorityMid: string;
    priorityLow: string;
    difficultyLabels: Record<"easy" | "medium" | "hard", string>;
  };
}

type UpgradeKey =
  | "mobile"
  | "conversion"
  | "speed"
  | "trust"
  | "localSeo"
  | "booking"
  | "copy"
  | "design"
  | "analytics";

const STRINGS_EN: LocaleStrings = {
  // Returns a full clause that drops cleanly into:
  //   "After reviewing X's website, ${phrase} (N/100 overall, ...)."
  ratingPhrase: (score) => {
    if (score >= 80) return "the site appears to be in good shape";
    if (score >= 60) return "the site looks reasonable but has clear room to improve";
    if (score >= 40) return "there's clear room for improvement in several areas";
    return "there appears to be significant room for improvement";
  },
  dimensionLabels: {
    mobile: "the mobile experience",
    conversion: "how visitors convert into enquiries",
    localSeo: "local search visibility",
    speed: "page speed",
    trust: "trust signals on the site",
    copy: "the clarity of the copy",
  },
  executiveSummary: (lead, audit) => {
    const overall = audit.scores.overall;
    const phrase = STRINGS_EN.ratingPhrase(overall);
    const dims: [string, number][] = [
      [STRINGS_EN.dimensionLabels.mobile, audit.scores.mobile],
      [STRINGS_EN.dimensionLabels.conversion, audit.scores.conversion],
      [STRINGS_EN.dimensionLabels.localSeo, audit.scores.localSeo],
      [STRINGS_EN.dimensionLabels.speed, audit.scores.speed],
      [STRINGS_EN.dimensionLabels.trust, audit.scores.trust],
      [STRINGS_EN.dimensionLabels.copy, audit.scores.copyClarity],
    ];
    const weakest = dims.sort((a, b) => a[1] - b[1]).slice(0, 2);
    const callOut = weakest.map(([label]) => label).join(" and ");
    return [
      `After reviewing ${lead.businessName}'s website, ${phrase} (${overall}/100 overall, based on visible website signals).`,
      ``,
      `The clearest opportunities seem to be around ${callOut}.`,
      ``,
      `These observations are based on what's visible on the site — no internal analytics or private data. Each finding below comes with a short explanation of why it matters and a suggested fix.`,
    ].join("\n");
  },
  subjectVariants: (lead) => [
    `Quick note about ${lead.businessName}'s website`,
    `${lead.businessName} — a couple of observations worth sharing`,
    `Found a few things worth flagging on the ${lead.businessName} site`,
  ],
  outreachBody: (lead, audit, topUpgradeTitle) => {
    const obs1 = audit.topPriority[0];
    const obs2 = audit.topPriority[1];
    const observation1 = obs1
      ? obs1.clientFriendlyExplanation
      : "There seem to be a couple of areas where the site could be working harder for you.";
    const observation2 = obs2
      ? obs2.clientFriendlyExplanation
      : "Both look like the kind of thing that's fixable without rebuilding the site.";
    return [
      `Hi,`,
      ``,
      `I had a quick look at ${lead.businessName}'s website and a couple of things stood out.`,
      ``,
      `Two observations, based on what's visible on the site:`,
      ``,
      `1. ${observation1}`,
      ``,
      `2. ${observation2}`,
      ``,
      `Both look fixable. The strongest starting point on the site at the moment seems to be ${topUpgradeTitle.toLowerCase()}.`,
      ``,
      `Would it be useful if I sent over a short free audit with the full picture and a couple of specific suggestions? No obligation — just findings you can use.`,
      ``,
      `Best,`,
      `[Your Name]`,
      ``,
      STRINGS_EN.optOut,
    ].join("\n");
  },
  followUpBody: (lead) => [
    `Hi,`,
    ``,
    `Just a short follow-up on my earlier note about ${lead.businessName}'s website.`,
    ``,
    `If a short free audit would be useful, I'm happy to share it. If not, no worries — I'll leave it there.`,
    ``,
    `Best,`,
    `[Your Name]`,
    ``,
    STRINGS_EN.optOut,
  ].join("\n"),
  optOut: `If this isn't relevant, no worries — just reply "no thanks" and I won't contact you again.`,
  upgradeCopy: {
    mobile: {
      title: "Mobile optimisation",
      shortExplanation: "Rebuild the responsive layout, fix tap targets, and simplify mobile navigation.",
      expectedBenefit: "Most local searches happen on phones — fixing mobile could meaningfully improve enquiries.",
    },
    conversion: {
      title: "CTA + conversion restructuring",
      shortExplanation: "Add a clear primary CTA above the fold, simplify the contact path, and add a sticky mobile CTA.",
      expectedBenefit: "Visitors who currently bounce will have a defined next step — the highest-leverage UX fix.",
    },
    speed: {
      title: "Speed optimisation",
      shortExplanation: "Compress images (WebP/AVIF), defer non-critical scripts, enable caching, switch to faster hosting if needed.",
      expectedBenefit: "Page speed affects both bounce rate and Google ranking. Each second matters.",
    },
    trust: {
      title: "Trust signal redesign",
      shortExplanation: "Embed Google reviews, surface customer testimonials, ensure address + phone + Google Business profile are prominent.",
      expectedBenefit: "Reviews are the strongest persuasion lever for local services — could meaningfully shift the conversion rate.",
    },
    localSeo: {
      title: "Local SEO sprint",
      shortExplanation: "Fix title tags, add city/region landing pages, complete Google Business Profile, add LocalBusiness schema markup.",
      expectedBenefit: "Local SEO is the single biggest lever for visibility on '[service] in [city]' searches.",
    },
    booking: {
      title: "Booking flow implementation",
      shortExplanation: "Add an online booking widget, auto-acknowledgement emails, and a quote request form.",
      expectedBenefit: "Captures bookings outside business hours and reduces back-and-forth admin.",
    },
    copy: {
      title: "Hero + copy refresh",
      shortExplanation: "Rewrite the hero so service + audience + value are clear within 5 seconds.",
      expectedBenefit: "Visitors who currently leave without understanding the offer will engage instead.",
    },
    design: {
      title: "Homepage redesign",
      shortExplanation: "Refresh visual design — modern typography, spacing, colour palette, and layout.",
      expectedBenefit: "Stronger first impression. Builds trust before visitors read a single word.",
    },
    analytics: {
      title: "Analytics setup",
      shortExplanation: "Install GA4 + Search Console + key event tracking on CTAs.",
      expectedBenefit: "Without analytics, every marketing decision is guesswork. This is the foundation everything else builds on.",
    },
  },
  fullProposalLabels: {
    title: (name) => `Website improvement proposal — ${name}`,
    executiveSummary: "Executive summary",
    priorityIssues: "Priority issues",
    recommendedUpgrades: "Recommended upgrades",
    why: "Why it matters",
    impact: "Potential impact",
    fix: "How to improve",
    benefit: "Expected benefit",
    work: "Estimated work",
    fitsIn: (name, price) => `fits within "${name}" (${price})`,
    footer: "Based on visible website signals only. Generated by Brickwise.",
    priorityHigh: "Priority 1",
    priorityMid: "Priority 2",
    priorityLow: "Priority 3",
    difficultyLabels: { easy: "easy", medium: "medium", hard: "hard" },
  },
};

const STRINGS_NL: LocaleStrings = {
  // Full clause that fits:
  //   "Op basis van zichtbare signalen ${phrase} (totaalscore N/100)."
  ratingPhrase: (score) => {
    if (score >= 80) return "lijkt de site er goed bij te staan";
    if (score >= 60) return "lijkt de site redelijk in orde, met enkele duidelijke kansen om beter te worden";
    if (score >= 40) return "lijkt er op meerdere zichtbare punten ruimte voor verbetering te liggen";
    return "lijkt er behoorlijk wat ruimte voor verbetering te liggen";
  },
  dimensionLabels: {
    mobile: "de mobiele gebruikservaring",
    conversion: "de manier waarop bezoekers worden omgezet naar aanvragen",
    localSeo: "de lokale zichtbaarheid in zoekresultaten",
    speed: "de laadsnelheid",
    trust: "de vertrouwenssignalen op de site",
    copy: "de helderheid van de teksten",
  },
  executiveSummary: (lead, audit) => {
    const overall = audit.scores.overall;
    const phrase = STRINGS_NL.ratingPhrase(overall);
    const dims: [string, number][] = [
      [STRINGS_NL.dimensionLabels.mobile, audit.scores.mobile],
      [STRINGS_NL.dimensionLabels.conversion, audit.scores.conversion],
      [STRINGS_NL.dimensionLabels.localSeo, audit.scores.localSeo],
      [STRINGS_NL.dimensionLabels.speed, audit.scores.speed],
      [STRINGS_NL.dimensionLabels.trust, audit.scores.trust],
      [STRINGS_NL.dimensionLabels.copy, audit.scores.copyClarity],
    ];
    const weakest = dims.sort((a, b) => a[1] - b[1]).slice(0, 2);
    const callOut = weakest.map(([label]) => label).join(" en ");
    return [
      `Ik heb kort gekeken naar de website van ${lead.businessName}. Op basis van zichtbare signalen ${phrase} (totaalscore ${overall}/100).`,
      ``,
      `De grootste kansen lijken te liggen bij ${callOut}.`,
      ``,
      `Deze observaties zijn gebaseerd op wat zichtbaar is op de website — geen interne analytics of privégegevens. Bij elk punt hieronder staat een korte uitleg waarom het ertoe doet en een mogelijke verbetering.`,
    ].join("\n");
  },
  subjectVariants: (lead) => [
    `Korte notitie over de website van ${lead.businessName}`,
    `${lead.businessName} — een paar observaties die ik wilde delen`,
    `Een paar dingen die opvielen op de website van ${lead.businessName}`,
  ],
  outreachBody: (lead, audit, topUpgradeTitle) => {
    const obs1 = audit.topPriority[0];
    const obs2 = audit.topPriority[1];
    const observation1 = obs1
      ? obs1.clientFriendlyExplanation
      : "Er lijken een paar punten te zijn waar de site nog harder voor je zou kunnen werken.";
    const observation2 = obs2
      ? obs2.clientFriendlyExplanation
      : "Beide lijken haalbaar om aan te pakken zonder dat de site herbouwd hoeft te worden.";
    return [
      `Hi,`,
      ``,
      `Ik heb kort gekeken naar de website van ${lead.businessName} en wilde graag een paar observaties met je delen.`,
      ``,
      `Twee dingen vielen op, op basis van zichtbare signalen op de website:`,
      ``,
      `1. ${observation1}`,
      ``,
      `2. ${observation2}`,
      ``,
      `Beide lijken oplosbaar. Het meest impactvolle startpunt op dit moment lijkt ${topUpgradeTitle.toLowerCase()} te zijn.`,
      ``,
      `Zou het nuttig zijn als ik een korte gratis audit toestuur met het volledige beeld en een paar concrete suggesties? Geen verplichting — alleen observaties die je kunt gebruiken.`,
      ``,
      `Met vriendelijke groet,`,
      `[Jouw naam]`,
      ``,
      STRINGS_NL.optOut,
    ].join("\n");
  },
  followUpBody: (lead) => [
    `Hi,`,
    ``,
    `Even een korte vervolg op mijn vorige bericht over de website van ${lead.businessName}.`,
    ``,
    `Mocht een korte gratis audit nuttig zijn, dan stuur ik die graag op. Zo niet, geen probleem — dan laat ik het hierbij.`,
    ``,
    `Met vriendelijke groet,`,
    `[Jouw naam]`,
    ``,
    STRINGS_NL.optOut,
  ].join("\n"),
  optOut: `Mocht dit niet relevant zijn, geen probleem — laat het me weten en ik neem geen verder contact op.`,
  upgradeCopy: {
    mobile: {
      title: "Mobiele optimalisatie",
      shortExplanation: "Verbeter de responsive layout, vergroot tap-targets en vereenvoudig de mobiele navigatie.",
      expectedBenefit: "De meeste lokale zoekopdrachten gebeuren op telefoons — verbeteringen op mobiel kunnen helpen om meer aanvragen uit websitebezoekers te halen.",
    },
    conversion: {
      title: "CTA- en conversieverbetering",
      shortExplanation: "Plaats een duidelijke primaire actie boven de vouw, vereenvoudig het contactproces en voeg een sticky CTA toe op mobiel.",
      expectedBenefit: "Bezoekers die nu afhaken krijgen een duidelijke vervolgstap — een van de aanpassingen met de meeste impact.",
    },
    speed: {
      title: "Snelheidsoptimalisatie",
      shortExplanation: "Comprimeer afbeeldingen (WebP/AVIF), stel niet-kritieke scripts uit, schakel caching in en kies indien nodig snellere hosting.",
      expectedBenefit: "Laadsnelheid beïnvloedt zowel het bouncepercentage als de positie in Google. Elke seconde maakt verschil.",
    },
    trust: {
      title: "Vertrouwen en bewijs versterken",
      shortExplanation: "Plaats Google-reviews, voeg klantverhalen toe en zorg dat adres, telefoon en Bedrijfsprofiel goed zichtbaar zijn.",
      expectedBenefit: "Reviews zijn vaak doorslaggevend voor lokale dienstverleners — kunnen de conversie merkbaar verhogen.",
    },
    localSeo: {
      title: "Lokale SEO-verbetering",
      shortExplanation: "Verbeter de title-tags, voeg stad- of regiopagina's toe, optimaliseer het Bedrijfsprofiel en voeg LocalBusiness-schema toe.",
      expectedBenefit: "Lokale SEO is de belangrijkste factor voor zichtbaarheid op '[dienst] in [stad]'-zoekopdrachten.",
    },
    booking: {
      title: "Boekings- en aanvraagflow",
      shortExplanation: "Voeg een online boekingswidget toe, met automatische bevestigingsmails en een offerteformulier.",
      expectedBenefit: "Vangt boekingen op buiten kantoortijden en bespaart tijd op handmatige planning en mailwisselingen.",
    },
    copy: {
      title: "Hero en copy vernieuwen",
      shortExplanation: "Herschrijf de hero zodat dienst, doelgroep en waarde binnen vijf seconden duidelijk zijn.",
      expectedBenefit: "Bezoekers die nu vertrekken zonder het aanbod te begrijpen, weten meteen waar ze zijn en wat ze kunnen verwachten.",
    },
    design: {
      title: "Homepage herontwerp",
      shortExplanation: "Ververs het visuele ontwerp — moderne typografie, ruimte, kleurpalet en layout.",
      expectedBenefit: "Sterkere eerste indruk. Bouwt vertrouwen op nog vóór bezoekers iets gelezen hebben.",
    },
    analytics: {
      title: "Analytics opzetten",
      shortExplanation: "Installeer GA4, Search Console en event-tracking op de belangrijkste CTA's.",
      expectedBenefit: "Zonder analytics is elke marketingkeuze een aanname. Dit is het fundament waarop de rest gebouwd wordt.",
    },
  },
  fullProposalLabels: {
    title: (name) => `Voorstel websiteverbetering — ${name}`,
    executiveSummary: "Samenvatting",
    priorityIssues: "Belangrijkste aandachtspunten",
    recommendedUpgrades: "Aanbevolen verbeteringen",
    why: "Waarom dit ertoe doet",
    impact: "Mogelijke impact",
    fix: "Hoe dit te verbeteren",
    benefit: "Verwacht resultaat",
    work: "Geschatte tijd",
    fitsIn: (name, price) => `past binnen "${name}" (${price})`,
    footer: "Op basis van zichtbare signalen op de website. Gegenereerd door Brickwise.",
    priorityHigh: "Prioriteit 1",
    priorityMid: "Prioriteit 2",
    priorityLow: "Prioriteit 3",
    difficultyLabels: { easy: "eenvoudig", medium: "gemiddeld", hard: "complex" },
  },
};

const STRINGS_BY_LOCALE: Record<Locale, LocaleStrings> = {
  en: STRINGS_EN,
  nl: STRINGS_NL,
};

// ── Builders ──────────────────────────────────────────────────────────────

function severityRank(s: IssueSeverity): number {
  return s === "critical" ? 4 : s === "high" ? 3 : s === "medium" ? 2 : 1;
}

function buildPriorityProblems(issues: AuditIssue[]): PriorityProblem[] {
  return issues.slice(0, 5).map((issue) => ({
    title: issue.title,
    severity: issue.severity,
    whyItMatters: issue.whyItMatters,
    potentialImpact: issue.likelyImpact,
    howToImprove: issue.suggestedFix,
  }));
}

const UPGRADE_PRIORITY: Record<UpgradeKey, 1 | 2 | 3> = {
  mobile: 1,
  conversion: 1,
  localSeo: 1,
  speed: 2,
  trust: 2,
  booking: 2,
  analytics: 2,
  copy: 3,
  design: 3,
};

const UPGRADE_DIFFICULTY: Record<UpgradeKey, "easy" | "medium" | "hard"> = {
  mobile: "medium",
  conversion: "easy",
  speed: "easy",
  trust: "easy",
  localSeo: "medium",
  booking: "medium",
  copy: "medium",
  design: "hard",
  analytics: "easy",
};

const UPGRADE_HOURS: Record<UpgradeKey, { min: number; max: number }> = {
  mobile: { min: 6, max: 16 },
  conversion: { min: 4, max: 10 },
  speed: { min: 3, max: 8 },
  trust: { min: 3, max: 8 },
  localSeo: { min: 8, max: 20 },
  booking: { min: 4, max: 12 },
  copy: { min: 4, max: 10 },
  design: { min: 16, max: 40 },
  analytics: { min: 1, max: 3 },
};

const UPGRADE_OFFER: Record<UpgradeKey, string> = {
  mobile: "growth",
  conversion: "growth",
  speed: "local_seo",
  trust: "growth",
  localSeo: "local_seo",
  booking: "automation",
  copy: "growth",
  design: "growth",
  analytics: "local_seo",
};

function selectUpgradeKeys(audit: RichAuditData): UpgradeKey[] {
  const out: UpgradeKey[] = [];
  if (audit.scores.mobile < 70) out.push("mobile");
  if (audit.scores.conversion < 70) out.push("conversion");
  if (audit.scores.localSeo < 70) out.push("localSeo");
  if (audit.scores.trust < 70) out.push("trust");
  if (audit.scores.bookingFriction < 70) out.push("booking");
  if (audit.scores.speed < 70) out.push("speed");
  if (audit.scores.copyClarity < 70) out.push("copy");
  if (audit.scores.designQuality < 70) out.push("design");
  if (out.length < 3 && audit.issues.some((i) => i.key === "hasAnalytics")) out.push("analytics");
  // Stable priority order, then top 5
  out.sort((a, b) => UPGRADE_PRIORITY[a] - UPGRADE_PRIORITY[b]);
  return out.slice(0, 5);
}

function buildRecommendedUpgrades(
  audit: RichAuditData,
  strings: LocaleStrings,
): RecommendedUpgrade[] {
  return selectUpgradeKeys(audit).map((key): RecommendedUpgrade => {
    const offerId = UPGRADE_OFFER[key];
    const offer = getOffer(offerId);
    const copy = strings.upgradeCopy[key];
    return {
      title: copy.title,
      shortExplanation: copy.shortExplanation,
      expectedBenefit: copy.expectedBenefit,
      difficulty: UPGRADE_DIFFICULTY[key],
      priority: UPGRADE_PRIORITY[key],
      estimatedHours: UPGRADE_HOURS[key],
      relatedOfferId: offerId,
      relatedOfferName: offer?.name,
      relatedOfferPrice: offer?.price,
    };
  });
}

function buildSubject(lead: Lead, strings: LocaleStrings): string {
  const variants = strings.subjectVariants(lead);
  const hash = lead.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return variants[hash % variants.length];
}

function buildFullProposalText(pkg: ProposalPackage, strings: LocaleStrings): string {
  const L = strings.fullProposalLabels;
  const lines: string[] = [];
  lines.push(`# ${L.title(pkg.lead.businessName)}`);
  lines.push(`${pkg.lead.category} · ${pkg.lead.city}`);
  lines.push("");
  lines.push(`## ${L.executiveSummary}`);
  lines.push("");
  lines.push(pkg.executiveSummary);
  lines.push("");
  lines.push(`## ${L.priorityIssues}`);
  lines.push("");
  pkg.priorityProblems.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.title}  [${p.severity.toUpperCase()}]`);
    lines.push(`**${L.why}:** ${p.whyItMatters}`);
    lines.push(`**${L.impact}:** ${p.potentialImpact}`);
    lines.push(`**${L.fix}:** ${p.howToImprove}`);
    lines.push("");
  });
  lines.push(`## ${L.recommendedUpgrades}`);
  lines.push("");
  pkg.recommendedUpgrades.forEach((u) => {
    const offer = u.relatedOfferName && u.relatedOfferPrice
      ? ` — ${L.fitsIn(u.relatedOfferName, u.relatedOfferPrice)}`
      : "";
    const prio = u.priority === 1 ? L.priorityHigh : u.priority === 2 ? L.priorityMid : L.priorityLow;
    lines.push(`### ${u.title}  [${prio} · ${L.difficultyLabels[u.difficulty]}]${offer}`);
    lines.push(u.shortExplanation);
    lines.push(`*${L.benefit}:* ${u.expectedBenefit}`);
    lines.push(`*${L.work}:* ${u.estimatedHours.min}–${u.estimatedHours.max}h`);
    lines.push("");
  });
  lines.push("---");
  lines.push("");
  lines.push(L.footer);
  return lines.join("\n");
}

// ── Main entrypoint ───────────────────────────────────────────────────────

export interface GeneratePackageOptions {
  locale?: Locale;
}

export function generateProposalPackage(
  lead: Lead,
  audit: RichAuditData | undefined,
  _score?: LeadScore,
  options: GeneratePackageOptions = {},
): ProposalPackage | null {
  if (!audit) return null;
  const locale: Locale = options.locale ?? "en";
  const strings = STRINGS_BY_LOCALE[locale];

  // Localise the issue list from the lead's checklist; fall back to whatever
  // is on the audit if the checklist isn't available (legacy rows).
  const issues = lead.auditChecklist
    ? buildLocalizedIssues(lead.auditChecklist, locale)
    : audit.issues;
  const localisedAudit: RichAuditData = {
    ...audit,
    issues,
    topPriority: issues.slice(0, 3),
  };

  const recommendedUpgrades = buildRecommendedUpgrades(localisedAudit, strings);
  const priorityProblems = buildPriorityProblems(issues);
  const executiveSummary = strings.executiveSummary(lead, localisedAudit);
  const subject = buildSubject(lead, strings);
  const topUpgradeTitle = recommendedUpgrades[0]?.title ?? strings.upgradeCopy.conversion.title;
  const outreachBody = strings.outreachBody(lead, localisedAudit, topUpgradeTitle);
  const followUpBody = strings.followUpBody(lead);

  const pkg: ProposalPackage = {
    locale,
    generatedAt: new Date().toISOString(),
    lead: { id: lead.id, businessName: lead.businessName, city: lead.city, category: lead.category },
    executiveSummary,
    priorityProblems,
    recommendedUpgrades,
    outreachEmail: { subject, body: outreachBody, recipient: lead.email },
    followUpEmail: {
      subject: locale === "nl" ? `Re: ${subject}` : `Re: ${subject}`,
      body: followUpBody,
      recipient: lead.email,
    },
    fullProposalText: "",
  };
  pkg.fullProposalText = buildFullProposalText(pkg, strings);
  return pkg;
}

export { OFFER_TEMPLATES };
