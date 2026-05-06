export type LeadStatus =
  | "new"
  | "researched"
  | "audit_ready"
  | "contacted"
  | "replied"
  | "meeting_booked"
  | "proposal_sent"
  | "won"
  | "lost"
  | "do_not_contact";

export type ConsentStatus = "none" | "opted_in" | "unsubscribed";
export type ContactType = "email" | "call" | "linkedin" | "visit" | "other";

// ── Audit checklist ───────────────────────────────────────────────────────
//
// Four dimensions, ~30 manual checks. Each is a yes/no the operator ticks
// while reviewing the prospect's website. Scores derive from these.

export interface AuditChecklist {
  // Website basics (10)
  hasModernDesign: boolean;
  isMobileFriendly: boolean;
  loadsFast: boolean;
  hasClearCTA: boolean;
  hasContactForm: boolean;
  hasPhoneVisible: boolean;
  hasGoogleMapsLink: boolean;
  hasTrustSignals: boolean;
  hasServicePages: boolean;
  hasCityLandingPage: boolean;

  // SEO (9)
  hasLocalSEOTitle: boolean;
  hasMetaDescription: boolean;
  hasH1: boolean;
  hasHeadingStructure: boolean;
  hasLocalKeywords: boolean;
  hasInternalLinks: boolean;
  isIndexable: boolean;
  hasSchemaMarkup: boolean;
  hasGoogleBusinessProfile: boolean;

  // Conversion (6)
  hasClearOffer: boolean;
  lowContactFriction: boolean;
  lowBookingFriction: boolean;
  hasAboveFoldCTA: boolean;
  hasMobileCTA: boolean;
  hasLeadCapture: boolean;

  // Automation opportunity (7) — these are *opportunities*, ticked = present
  hasBookingAutomation: boolean;
  hasQuoteAutomation: boolean;
  hasInvoiceAutomation: boolean;
  hasReminderEmails: boolean;
  hasFollowUpAutomation: boolean;
  hasAnalytics: boolean;
  hasInternalDashboard: boolean;
}

export type AuditChecklistKey = keyof AuditChecklist;

export interface ContactRecord {
  id: string;
  leadId: string;
  type: ContactType;
  message?: string;
  sentAt: string;
}

export interface FollowUpRecord {
  id: string;
  leadId: string;
  dueAt: string;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  businessName: string;
  category: string;
  city: string;
  province: string;
  website?: string;
  email?: string;
  contactPageUrl?: string;
  phone?: string;
  googleMapsUrl?: string;
  notes?: string;
  status: LeadStatus;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  consentStatus: ConsentStatus;
  doNotContact: boolean;
  unsubscribed: boolean;

  websiteScore?: number;
  seoScore?: number;
  conversionScore?: number;
  automationScore?: number;
  auditSummary?: string;
  auditChecklist?: AuditChecklist;
  topProblems?: string[];
  topImprovements?: string[];

  proposalEmail?: string;
  proposalFollowUpEmail?: string;
  proposalLinkedIn?: string;
  proposalCallScript?: string;
  proposalBullets?: string;
  proposalOffer?: string;
  estimatedValue?: number;

  createdAt: string;
  updatedAt: string;

  contacts: ContactRecord[];
  followUps: FollowUpRecord[];
}

export type LeadCreateInput = Omit<Lead, "id" | "createdAt" | "updatedAt" | "contacts" | "followUps">;
export type LeadUpdateInput = Partial<LeadCreateInput>;

export interface LeadFilters {
  city?: string;
  province?: string;
  category?: string;
  status?: LeadStatus;
  search?: string;
  includeDNC?: boolean;
  followUpDueOnly?: boolean;
  minScore?: number;
  maxScore?: number;
}

export const BUSINESS_CATEGORIES = [
  "Restaurant",
  "Gym",
  "Barber / Hair Salon",
  "Dentist",
  "Real Estate Agent",
  "Cleaner",
  "Roofer",
  "Beauty Salon",
  "Car Detailer",
  "Accountant",
  "Plumber",
  "Electrician",
  "Landscaper",
  "Photographer",
  "Physiotherapist",
  "Vet",
  "Other",
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; bg: string; group: "early" | "active" | "won" | "closed"; next?: LeadStatus }
> = {
  new: { label: "New", color: "#9ca3af", bg: "rgba(156,163,175,0.12)", group: "early", next: "researched" },
  researched: { label: "Researched", color: "#60a5fa", bg: "rgba(96,165,250,0.12)", group: "early", next: "audit_ready" },
  audit_ready: { label: "Audit Ready", color: "#22d3ee", bg: "rgba(34,211,238,0.12)", group: "early", next: "contacted" },
  contacted: { label: "Contacted", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", group: "active", next: "replied" },
  replied: { label: "Replied", color: "#a78bfa", bg: "rgba(167,139,250,0.12)", group: "active", next: "meeting_booked" },
  meeting_booked: { label: "Meeting Booked", color: "#34d399", bg: "rgba(52,211,153,0.12)", group: "active", next: "proposal_sent" },
  proposal_sent: { label: "Proposal Sent", color: "#fb923c", bg: "rgba(251,146,60,0.14)", group: "active", next: "won" },
  won: { label: "Won", color: "#10b981", bg: "rgba(16,185,129,0.16)", group: "won" },
  lost: { label: "Lost", color: "#f87171", bg: "rgba(248,113,113,0.12)", group: "closed" },
  do_not_contact: { label: "Do Not Contact", color: "#dc2626", bg: "rgba(220,38,38,0.14)", group: "closed" },
};

// ── Audit field metadata ──────────────────────────────────────────────────
//
// Each check has a label (for UI), category (for grouping/scoring), an
// "impact" weight (used to rank top-3 problems/improvements), and a
// human-readable problem & recommendation string.

export type AuditDimension = "website" | "seo" | "conversion" | "automation";

export interface AuditFieldMeta {
  key: AuditChecklistKey;
  label: string;
  dimension: AuditDimension;
  impact: 1 | 2 | 3; // 3 = highest impact
  problem: string;
  improvement: string;
}

export const AUDIT_FIELDS: AuditFieldMeta[] = [
  // Website basics
  { key: "hasModernDesign", label: "Modern, polished design", dimension: "website", impact: 2, problem: "the site looks dated, which can hurt trust on first impression", improvement: "refresh the visual design with cleaner typography, spacing, and modern layout" },
  { key: "isMobileFriendly", label: "Mobile friendly", dimension: "website", impact: 3, problem: "the site is not fully mobile-friendly — most local searches happen on phones", improvement: "make the site responsive so phones get a clean, readable layout" },
  { key: "loadsFast", label: "Loads quickly", dimension: "website", impact: 2, problem: "the site is slow to load — visitors and Google both bounce", improvement: "compress images, defer non-critical scripts, and improve Core Web Vitals" },
  { key: "hasClearCTA", label: "Clear call-to-action", dimension: "website", impact: 3, problem: "there is no clear next step for visitors to take", improvement: "add a prominent, single primary action like Book Now or Get a Quote" },
  { key: "hasContactForm", label: "Contact form present", dimension: "website", impact: 2, problem: "there is no easy way to contact the business online", improvement: "add a short contact form with name, email, and message" },
  { key: "hasPhoneVisible", label: "Phone visible above the fold", dimension: "website", impact: 2, problem: "phone number is hard to find — local visitors often want to call", improvement: "show phone number prominently in the header, ideally as a tap-to-call link on mobile" },
  { key: "hasGoogleMapsLink", label: "Google Maps / address link", dimension: "website", impact: 1, problem: "no map or address link, so customers cannot find or trust the location", improvement: "embed a Google Map or link to the Google Business Profile" },
  { key: "hasTrustSignals", label: "Reviews / testimonials / trust signals", dimension: "website", impact: 2, problem: "no reviews, testimonials, or trust signals visible", improvement: "add a few real customer reviews or a Google review badge" },
  { key: "hasServicePages", label: "Dedicated service pages", dimension: "website", impact: 2, problem: "individual services do not have their own pages, which limits SEO", improvement: "create one focused page per main service" },
  { key: "hasCityLandingPage", label: "City / region landing page", dimension: "website", impact: 2, problem: "no page targeting the local city/region for SEO", improvement: "add a [service] in [city] landing page targeting the area" },

  // SEO
  { key: "hasLocalSEOTitle", label: "Title tag mentions city + service", dimension: "seo", impact: 3, problem: "the page title does not mention the city or service, so it will not rank locally", improvement: "rewrite the page title to follow Service in City — Business Name" },
  { key: "hasMetaDescription", label: "Meta description set", dimension: "seo", impact: 2, problem: "no meta description, so Google writes its own (often poorly)", improvement: "write a 150-character meta description with the main service and city" },
  { key: "hasH1", label: "H1 heading on every page", dimension: "seo", impact: 2, problem: "missing or duplicate H1 tags hurt search ranking", improvement: "set one clear H1 per page describing what the page is about" },
  { key: "hasHeadingStructure", label: "Logical H1 → H2 → H3 hierarchy", dimension: "seo", impact: 1, problem: "headings are inconsistent, which makes content harder for search engines to parse", improvement: "use H2s for sections and H3s for sub-sections in a sensible order" },
  { key: "hasLocalKeywords", label: "Local keywords in copy", dimension: "seo", impact: 2, problem: "the copy does not mention the local area, so it competes with national results", improvement: "weave the city, region, and neighborhood names naturally into the body copy" },
  { key: "hasInternalLinks", label: "Internal links between pages", dimension: "seo", impact: 1, problem: "few or no internal links between pages limits crawlability and time on site", improvement: "link related service pages and city pages to each other" },
  { key: "isIndexable", label: "Indexable by Google", dimension: "seo", impact: 3, problem: "the site appears blocked from search engines (robots / noindex)", improvement: "remove noindex directives and submit the sitemap to Google Search Console" },
  { key: "hasSchemaMarkup", label: "Schema markup (LocalBusiness)", dimension: "seo", impact: 1, problem: "no LocalBusiness schema, missing rich result opportunities", improvement: "add LocalBusiness JSON-LD with hours, address, phone, and reviews" },
  { key: "hasGoogleBusinessProfile", label: "Google Business Profile claimed + populated", dimension: "seo", impact: 3, problem: "Google Business Profile not claimed or under-populated — biggest local SEO miss", improvement: "claim and complete the Google Business Profile with photos, services, hours, and review prompts" },

  // Conversion
  { key: "hasClearOffer", label: "Offer is clear within 5 seconds", dimension: "conversion", impact: 3, problem: "it is not clear within 5 seconds what the business does or sells", improvement: "rewrite the hero section so the service and audience are obvious immediately" },
  { key: "lowContactFriction", label: "Low contact friction", dimension: "conversion", impact: 2, problem: "contacting the business takes too many steps or fields", improvement: "shorten the contact form and add a one-click phone CTA" },
  { key: "lowBookingFriction", label: "Low booking friction", dimension: "conversion", impact: 2, problem: "booking requires emailing or calling rather than self-service", improvement: "add an online booking widget for the most common service" },
  { key: "hasAboveFoldCTA", label: "CTA visible above the fold", dimension: "conversion", impact: 2, problem: "the primary CTA is hidden below the fold", improvement: "move the main CTA to the top of the hero section" },
  { key: "hasMobileCTA", label: "Sticky / tap-to-call CTA on mobile", dimension: "conversion", impact: 2, problem: "no sticky mobile CTA — most mobile users will not scroll to find it", improvement: "add a sticky tap-to-call or Book Now button at the bottom of mobile screens" },
  { key: "hasLeadCapture", label: "Lead capture (email / quote)", dimension: "conversion", impact: 2, problem: "visitors who are not ready to buy have no way to leave their details", improvement: "add a soft lead-capture form like a free quote or simple newsletter" },

  // Automation opportunity (ticked = already in place; absence = opportunity)
  { key: "hasBookingAutomation", label: "Online booking system", dimension: "automation", impact: 3, problem: "no online booking — every appointment requires manual back-and-forth", improvement: "set up a booking widget so customers self-serve outside business hours" },
  { key: "hasQuoteAutomation", label: "Online quote request flow", dimension: "automation", impact: 2, problem: "no quote request flow — leads go cold while waiting for a manual reply", improvement: "build a simple quote-request form with auto-acknowledgement email" },
  { key: "hasInvoiceAutomation", label: "Invoice / payment automation", dimension: "automation", impact: 2, problem: "invoicing is manual, which delays payment and adds admin", improvement: "connect a tool like Stripe or Xero so invoices send automatically" },
  { key: "hasReminderEmails", label: "Appointment reminder emails / SMS", dimension: "automation", impact: 1, problem: "no automated reminders, which means more no-shows", improvement: "add automated SMS or email reminders 24h before appointments" },
  { key: "hasFollowUpAutomation", label: "Lead follow-up automation", dimension: "automation", impact: 2, problem: "leads receive no automatic follow-up if they go quiet", improvement: "add a simple two-step email sequence for leads who do not reply" },
  { key: "hasAnalytics", label: "Analytics installed (GA4 / Plausible)", dimension: "automation", impact: 1, problem: "no analytics, so there is no visibility into what is working", improvement: "install GA4 or Plausible plus Google Search Console" },
  { key: "hasInternalDashboard", label: "Internal dashboard for the team", dimension: "automation", impact: 1, problem: "the team has no simple shared dashboard for bookings or leads", improvement: "build a small internal dashboard surfacing today's bookings and recent leads" },
];

export const AUDIT_FIELDS_BY_DIMENSION: Record<AuditDimension, AuditFieldMeta[]> = {
  website: AUDIT_FIELDS.filter((f) => f.dimension === "website"),
  seo: AUDIT_FIELDS.filter((f) => f.dimension === "seo"),
  conversion: AUDIT_FIELDS.filter((f) => f.dimension === "conversion"),
  automation: AUDIT_FIELDS.filter((f) => f.dimension === "automation"),
};

export const DIMENSION_LABELS: Record<AuditDimension, string> = {
  website: "Website basics",
  seo: "Local SEO",
  conversion: "Conversion",
  automation: "Automation opportunity",
};

export const DIMENSION_COLORS: Record<AuditDimension, string> = {
  website: "#f59e0b",
  seo: "#60a5fa",
  conversion: "#a78bfa",
  automation: "#34d399",
};

// Default empty checklist (all false)
export const EMPTY_AUDIT_CHECKLIST: AuditChecklist = AUDIT_FIELDS.reduce(
  (acc, f) => ({ ...acc, [f.key]: false }),
  {} as AuditChecklist,
);

export const MAX_DAILY_OUTREACH = 10;
export const MAX_PENDING_FOLLOW_UPS = 2;

// ── Offer templates ────────────────────────────────────────────────────────

export type OfferId = "starter" | "growth" | "automation" | "local_seo" | "growth_plus_automation";

export interface OfferTemplate {
  id: OfferId;
  name: string;
  tagline: string;
  price: string;
  features: string[];
  color: string;
  goodFitFor: string;
}

export const OFFER_TEMPLATES: OfferTemplate[] = [
  {
    id: "starter",
    name: "Starter Website",
    tagline: "Professional presence, fast results",
    price: "€1,500 – €2,500",
    features: [
      "1–5 page website",
      "Mobile optimised",
      "Contact form",
      "Basic local SEO",
      "Google Analytics setup",
      "Google Maps integration",
    ],
    color: "#60a5fa",
    goodFitFor: "small local businesses with no site or a very dated one",
  },
  {
    id: "growth",
    name: "Growth Website",
    tagline: "Built to rank, built to convert",
    price: "€3,000 – €6,000",
    features: [
      "Everything in Starter",
      "Service pages with optimised copy",
      "City / region landing pages",
      "Conversion-focused hero + CTAs",
      "Lead tracking + analytics events",
      "Google Business Profile checklist",
    ],
    color: "#f59e0b",
    goodFitFor: "businesses that need more leads from local search",
  },
  {
    id: "automation",
    name: "Automation Add-on",
    tagline: "Save hours every week",
    price: "€500 – €2,000",
    features: [
      "Online booking system",
      "Quote request automation",
      "Email / SMS notifications",
      "Simple internal dashboard",
      "Invoice / payment workflow",
      "Optional custom internal tool",
    ],
    color: "#34d399",
    goodFitFor: "businesses losing time to manual booking, quoting, or invoicing",
  },
  {
    id: "local_seo",
    name: "Local SEO Sprint",
    tagline: "Rank locally without rebuilding the site",
    price: "€600 – €1,800",
    features: [
      "Metadata + title tag fixes",
      "Local landing pages (1–3 cities)",
      "Google Business Profile optimisation",
      "LocalBusiness schema markup",
      "Speed + Core Web Vitals improvements",
      "Conversion + CTA tune-up",
    ],
    color: "#22d3ee",
    goodFitFor: "businesses with an OK site but invisible in local search",
  },
  {
    id: "growth_plus_automation",
    name: "Growth + Automation",
    tagline: "More leads, less admin",
    price: "€4,500 – €8,500",
    features: [
      "Everything in Growth Website",
      "Everything in Automation Add-on",
      "End-to-end lead-to-customer flow",
      "Best for ambitious local operators",
    ],
    color: "#fb923c",
    goodFitFor: "businesses ready to invest in both visibility and operations",
  },
];

export function getOffer(id: string | undefined | null): OfferTemplate | undefined {
  if (!id) return undefined;
  return OFFER_TEMPLATES.find((o) => o.id === id);
}
