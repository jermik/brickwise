export type LeadStatus =
  | "new"
  | "researched"
  | "contacted"
  | "replied"
  | "meeting_booked"
  | "won"
  | "lost";

export type ConsentStatus = "none" | "opted_in" | "unsubscribed";
export type ContactType = "email" | "call" | "linkedin" | "visit" | "other";

export interface AuditChecklist {
  hasModernDesign: boolean;
  isMobileFriendly: boolean;
  loadsFast: boolean;
  hasClearCTA: boolean;
  hasContactForm: boolean;
  hasGoogleMapsLink: boolean;
  hasLocalSEOTitle: boolean;
  hasMetaDescription: boolean;
  hasServicePages: boolean;
  hasCityLandingPage: boolean;
  hasAnalytics: boolean;
  hasBookingOpportunity: boolean;
}

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
  automationScore?: number;
  auditSummary?: string;
  auditChecklist?: AuditChecklist;

  proposalEmail?: string;
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
  { label: string; color: string; bg: string; next?: LeadStatus }
> = {
  new: { label: "New", color: "#9ca3af", bg: "rgba(156,163,175,0.12)", next: "researched" },
  researched: { label: "Researched", color: "#60a5fa", bg: "rgba(96,165,250,0.12)", next: "contacted" },
  contacted: { label: "Contacted", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", next: "replied" },
  replied: { label: "Replied", color: "#a78bfa", bg: "rgba(167,139,250,0.12)", next: "meeting_booked" },
  meeting_booked: { label: "Meeting Booked", color: "#34d399", bg: "rgba(52,211,153,0.12)", next: "won" },
  won: { label: "Won", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  lost: { label: "Lost", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

export const AUDIT_CHECKLIST_LABELS: Record<keyof AuditChecklist, string> = {
  hasModernDesign: "Modern design",
  isMobileFriendly: "Mobile friendly",
  loadsFast: "Loads fast",
  hasClearCTA: "Clear call-to-action",
  hasContactForm: "Contact form",
  hasGoogleMapsLink: "Google Maps link",
  hasLocalSEOTitle: "Local SEO title tag",
  hasMetaDescription: "Meta description",
  hasServicePages: "Service pages",
  hasCityLandingPage: "City/region landing page",
  hasAnalytics: "Analytics installed",
  hasBookingOpportunity: "Booking / automation opportunity",
};

export const AUDIT_SEO_FIELDS: (keyof AuditChecklist)[] = [
  "hasLocalSEOTitle",
  "hasMetaDescription",
  "hasServicePages",
  "hasCityLandingPage",
  "hasGoogleMapsLink",
];

export const AUDIT_AUTOMATION_FIELDS: (keyof AuditChecklist)[] = [
  "hasContactForm",
  "hasBookingOpportunity",
  "hasAnalytics",
];

export const MAX_DAILY_OUTREACH = 10;

export const OFFER_TEMPLATES = [
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
      "Domain & hosting advice",
    ],
    color: "#60a5fa",
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
      "Google Business Profile optimisation checklist",
      "Lead tracking setup",
      "Conversion rate improvements",
    ],
    color: "#f59e0b",
  },
  {
    id: "automation",
    name: "Automation Add-on",
    tagline: "Save hours every week",
    price: "€500 – €2,000",
    features: [
      "Online booking system",
      "Quote request forms",
      "Email notification automations",
      "Simple client-facing dashboard",
      "Custom internal tools",
      "Invoice workflow templates",
    ],
    color: "#34d399",
  },
] as const;
