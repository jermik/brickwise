import type { Lead, OfferId } from "./types";
import { getOffer } from "./types";
import {
  computeTopProblems,
  computeTopImprovements,
  suggestOffer,
  computeAllScores,
} from "./scoring";
import { sanitizeCopyOutput } from "./copy/sanitize";
import { buildSignoff, DEFAULT_SENDER } from "./sender";

export interface ProposalOutput {
  emailDraft: string;
  followUpEmailDraft: string;
  linkedInDraft: string;
  callScript: string;
  bulletPoints: string;
  topProblems: string[];
  topImprovements: string[];
  suggestedOffer: OfferId;
  estimatedValue: number;
}

const PREMIUM_CATEGORIES = ["dentist", "real estate", "accountant", "physiotherapist", "lawyer", "vet"];

function valueForOffer(offerId: OfferId, category: string): number {
  const isPremium = PREMIUM_CATEGORIES.some((c) => category.toLowerCase().includes(c));
  const m = isPremium ? 1.4 : 1;
  switch (offerId) {
    case "starter":
      return Math.round(2000 * m);
    case "local_seo":
      return Math.round(1200 * m);
    case "automation":
      return Math.round(1300 * m);
    case "growth":
      return Math.round(4500 * m);
    case "growth_plus_automation":
      return Math.round(6500 * m);
    default:
      return Math.round(2500 * m);
  }
}

const OPT_OUT_LINE = `If this is not relevant, no worries, just reply "no thanks" and I will not contact you again.`;

export function generateProposal(lead: Lead): ProposalOutput {
  const checklist = lead.auditChecklist;
  const problems = checklist ? computeTopProblems(checklist) : [];
  const improvements = checklist ? computeTopImprovements(checklist) : [];
  const offerId = checklist ? suggestOffer(checklist) : "growth";
  const offer = getOffer(offerId);
  const estimatedValue = valueForOffer(offerId, lead.category);
  const scores = checklist ? computeAllScores(checklist) : null;

  const issue1 = problems[0] ?? "the website could be working harder for the business";
  const issue2 = problems[1] ?? "local SEO has room to improve";

  const city = lead.city;
  const name = lead.businessName;
  const cat = lead.category.toLowerCase();

  // ── Initial outreach email ────────────────────────────────────────────────

  const emailDraft = `Subject: Quick website note for ${name}

Hi,

I was looking at ${cat} businesses in ${city} and came across ${name}. I noticed ${issue1}, and ${issue2}, both are likely opportunities, and based on the website review there are a few specific things that could help.

I put together a short free audit with a couple of concrete suggestions. Would you like me to send it over? No obligation, happy to share what I found and let you decide if it is worth a conversation.

${buildSignoff("en")}

${OPT_OUT_LINE}`;

  // ── Follow-up email (sent ~3 days after initial) ──────────────────────────

  const followUpEmailDraft = `Subject: Following up, ${name} website note

Hi,

I sent you a short note a few days back about ${name}'s website. Wanted to gently follow up in case my email didn't reach the right person.

The free audit I mentioned still stands, it's a couple of paragraphs covering the two or three things that could help most. No pitch, no commitment.

Happy to share, or close the loop if not relevant.

${buildSignoff("en")}

${OPT_OUT_LINE}`;

  // ── LinkedIn / DM message ─────────────────────────────────────────────────

  const linkedInDraft = `Hi [Name], I was looking at ${cat} businesses in ${city} and noticed ${name}'s website has a couple of likely quick wins, specifically around ${issue1.replace(/^the /, "")}. Happy to share a short free audit if useful. No pitch, just findings.`;

  // ── Phone call script ─────────────────────────────────────────────────────

  const callScript = `Opening:
"Hi, could I speak with the owner or manager? Thanks. Hi, my name is ${DEFAULT_SENDER.name}, I work with local businesses in ${city} on their websites and online visibility. I was looking at your site earlier and spotted a couple of things that might be holding you back from getting more enquiries through Google. Do you have 90 seconds?"

If yes:
"I noticed ${issue1}, and ${issue2}. Both look fixable and could help with local visibility. I've put together a short free audit, no charge, no obligation. Could I email it over?"

If they ask what you sell:
"I help ${cat} businesses get more enquiries from Google, through better websites, local SEO, and sometimes a bit of automation so leads don't slip through. Right now I just want to share the audit so you can decide from there."

Close:
"Great, what's the best email to send it to?"

If no:
"Totally fine, I won't bother you again. Have a good day."`;

  // ── Bullet points (for proposal docs / decks) ─────────────────────────────

  const bulletPoints = [
    scores
      ? `• ${name} scores: website ${scores.websiteScore}/100, SEO ${scores.seoScore}/100, conversion ${scores.conversionScore}/100, automation ${scores.automationScore}/100`
      : `• ${name}, audit pending`,
    `• Top problems: ${problems.length > 0 ? problems.slice(0, 3).join("; ") : "general improvements possible"}`,
    `• Top improvements: ${improvements.length > 0 ? improvements.slice(0, 3).join("; ") : "TBD after audit"}`,
    `• Recommended offer: ${offer?.name ?? "Growth Website"}`,
    `• Estimated project value: €${estimatedValue.toLocaleString()}`,
    `• Likely outcome: more local search visibility, more enquiries, less manual admin`,
  ].join("\n");

  return {
    emailDraft: sanitizeCopyOutput(emailDraft),
    followUpEmailDraft: sanitizeCopyOutput(followUpEmailDraft),
    linkedInDraft: sanitizeCopyOutput(linkedInDraft),
    callScript: sanitizeCopyOutput(callScript),
    bulletPoints: sanitizeCopyOutput(bulletPoints),
    topProblems: problems.map(sanitizeCopyOutput),
    topImprovements: improvements.map(sanitizeCopyOutput),
    suggestedOffer: offerId,
    estimatedValue,
  };
}
