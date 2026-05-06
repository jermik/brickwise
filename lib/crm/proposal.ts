import type { Lead } from "./types";

interface ProposalOutput {
  emailDraft: string;
  linkedInDraft: string;
  callScript: string;
  bulletPoints: string;
  suggestedOffer: string;
  estimatedValue: number;
}

function getIssues(lead: Lead): string[] {
  const issues: string[] = [];
  if (!lead.auditChecklist) return issues;
  const c = lead.auditChecklist;
  if (!c.isMobileFriendly) issues.push("the site isn't fully mobile-friendly");
  if (!c.hasLocalSEOTitle) issues.push("the page title doesn't mention your city or service");
  if (!c.hasMetaDescription) issues.push("there's no meta description helping you show up in Google");
  if (!c.hasClearCTA) issues.push("visitors have no clear next step to take");
  if (!c.hasContactForm) issues.push("there's no easy way for customers to get in touch online");
  if (!c.hasServicePages) issues.push("individual services don't have dedicated pages");
  if (!c.hasCityLandingPage) issues.push("there's no landing page targeting your local area");
  if (!c.hasBookingOpportunity) issues.push("there's no online booking to capture leads 24/7");
  return issues;
}

function getSuggestedOffer(lead: Lead): string {
  const wscore = lead.websiteScore ?? 0;
  const ascore = lead.automationScore ?? 0;
  if (wscore < 40) return "Starter Website";
  if (wscore < 70) return "Growth Website";
  if (ascore < 60) return "Automation Add-on";
  return "Growth Website + Automation Add-on";
}

function getEstimatedValue(lead: Lead): number {
  const offer = getSuggestedOffer(lead);
  const category = lead.category.toLowerCase();
  const premiumCategories = ["dentist", "real estate", "accountant", "physiotherapist"];
  const isPremium = premiumCategories.some((c) => category.includes(c));
  const multiplier = isPremium ? 1.4 : 1;
  if (offer.includes("Growth") && offer.includes("Automation")) return Math.round(6500 * multiplier);
  if (offer.includes("Growth")) return Math.round(4500 * multiplier);
  if (offer.includes("Automation")) return Math.round(1200 * multiplier);
  return Math.round(2000 * multiplier);
}

export function generateProposal(lead: Lead): ProposalOutput {
  const issues = getIssues(lead);
  const suggestedOffer = getSuggestedOffer(lead);
  const estimatedValue = getEstimatedValue(lead);
  const issue1 = issues[0] ?? "the website could convert more visitors";
  const issue2 = issues[1] ?? "local SEO could be improved";
  const city = lead.city;
  const name = lead.businessName;
  const cat = lead.category.toLowerCase();

  const emailDraft = `Subject: Quick website note for ${name}

Hi,

I was browsing ${cat} businesses in ${city} and came across ${name}. I noticed ${issue1}, and ${issue2} — both fairly quick fixes that can make a real difference for local search and new customer enquiries.

I put together a short free audit with a few specific suggestions. Would you like me to send it over?

No strings attached — happy to share what I found and let you decide if it's worth a conversation.

[Your Name]
[Your Agency]
[Your Email / Phone]

P.S. You can unsubscribe from my messages at any time by replying "no thanks".`;

  const linkedInDraft = `Hi [Name], I was looking at ${cat} businesses in ${city} and noticed ${name}'s website has a couple of quick wins — ${issue1.replace("the ", "")} and a local SEO gap. Happy to share a short free audit if useful. No pitch, just findings.`;

  const callScript = `Opening:
"Hi, could I speak with the owner or manager? Thanks. Hi, my name is [Your Name] — I work with local businesses in ${city} on their websites and online visibility. I was actually looking at your site earlier and spotted a couple of things that might be holding you back from getting more calls through Google. Do you have 90 seconds?"

If yes:
"I noticed ${issue1}, and ${issue2}. Both are fixable and can make a real difference for local rankings. I've put together a short free audit — no charge, no obligation. Could I email it over?"

If they ask what you sell:
"I help ${cat} businesses like yours get more enquiries from Google — through better websites, local SEO, and sometimes a bit of automation so you're not missing leads. But right now I just want to share the audit — you can decide from there."

Close:
"Great — what's the best email to send it to?"`;

  const bulletPoints = `• ${name} currently scores ${lead.websiteScore ?? "–"}/100 on website quality, ${lead.seoScore ?? "–"}/100 on local SEO
• Top issues: ${issues.slice(0, 3).join("; ") || "general improvements possible"}
• Recommended offer: ${suggestedOffer}
• Estimated project value: €${estimatedValue.toLocaleString()}
• Quick wins: ${issues.slice(0, 2).join(", ") || "conversion and SEO optimisation"}
• Potential outcome: more Google visibility, more local enquiries, 24/7 lead capture`;

  return {
    emailDraft,
    linkedInDraft,
    callScript,
    bulletPoints,
    suggestedOffer,
    estimatedValue,
  };
}
