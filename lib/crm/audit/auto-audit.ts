// Auto-audit detector — MVP.
//
// Pure HTTP + regex inspection of a single page (the homepage). No JS
// execution, no headless browser, no third-party APIs, no Lighthouse.
// Goal: prefill ~70% of the audit checklist deterministically so the
// operator only has to ratify or correct.
//
// Constraints:
//   * 8 s fetch timeout
//   * 250 KB body cap
//   * single GET, single redirect chain
//   * never throws — every failure surfaces as a structured result
//
// Anything that genuinely needs a human eye (visual polish, Google
// Business Profile state, dashboard ergonomics, no-show reminders)
// is deliberately left untouched.

import type { AuditChecklistKey } from "../types";

const FETCH_TIMEOUT_MS = 8_000;
const MAX_BYTES = 250 * 1024;
const USER_AGENT = "BrickwiseAuditor/1.0 (+https://brickwise.pro)";
const FAST_LOAD_BUDGET_MS = 2_500; // homepage fetch under this = "loadsFast"
const SLOW_LOAD_BUDGET_MS = 5_000;

export type AutoAuditConfidence = "high" | "medium" | "low" | "unknown";

export interface AutoAuditFieldResult {
  /** What we'd suggest ticking the checkbox to. undefined = no opinion. */
  value?: boolean;
  confidence: AutoAuditConfidence;
  /** Short raw snippet from the page that drove the decision. */
  evidence?: string;
  /** One-line human-readable rationale. */
  note?: string;
}

export interface AutoAuditResult {
  ok: boolean;
  /** Top-level error if the homepage fetch itself failed. */
  error?: string;
  fetchedAt: string;
  finalUrl?: string;
  fetchMs?: number;
  /** Per-checklist-key detection. Keys we don't attempt are absent. */
  fields: Partial<Record<AuditChecklistKey, AutoAuditFieldResult>>;
  /** Tooling we identified on the page (booking, payments, analytics, ...). */
  detectedTools: {
    booking: string[];
    payments: string[];
    emailAutomation: string[];
    analytics: string[];
  };
}

export interface AutoAuditInput {
  websiteUri: string;
  /** City from the lead — used for local-SEO + city-page detection. */
  city?: string;
  /** Free-text niche / category — used for service-keyword detection. */
  niche?: string;
}

// ── Tool fingerprint catalogues ──────────────────────────────────────────

const BOOKING_TOOLS: Array<{ id: string; rx: RegExp }> = [
  { id: "Calendly", rx: /calendly\.com/i },
  { id: "Setmore", rx: /setmore\.com/i },
  { id: "SimplyBook", rx: /simplybook\.(?:me|it)/i },
  { id: "Fresha", rx: /fresha\.com/i },
  { id: "Treatwell", rx: /treatwell\.(?:nl|com|fr|de|at|be|es|it|co\.uk)/i },
  { id: "Mindbody", rx: /mindbodyonline|mindbody\.io/i },
  { id: "Acuity", rx: /acuityscheduling\.com/i },
  { id: "Square Appointments", rx: /squareup\.com\/(?:appointments|book)/i },
  { id: "Salonized", rx: /salonized\.com/i },
  { id: "Booksy", rx: /booksy\.com/i },
  { id: "TIMIFY", rx: /timify\.com/i },
  { id: "Picktime", rx: /picktime\.com/i },
  { id: "OnlineAfspraken", rx: /onlineafspraken\.nl/i },
  { id: "Bookly", rx: /class=["'][^"']*bookly|bookly-form|bookly\.app/i },
  { id: "Amelia", rx: /class=["'][^"']*amelia|amelia-app|wpamelia/i },
];

const PAYMENT_TOOLS: Array<{ id: string; rx: RegExp }> = [
  { id: "Stripe", rx: /(?:js|checkout)\.stripe\.com|stripe\.com\/v3/i },
  { id: "Mollie", rx: /mollie\.com\/payment|mollie\.dev/i },
  { id: "PayPal", rx: /paypal\.com\/(?:sdk|checkoutnow|webapps\/hermes)|paypalobjects\.com/i },
  { id: "Adyen", rx: /checkoutshopper-live\.adyen\.com|adyen\.com\/hpp/i },
  { id: "Klarna", rx: /klarna\.com\/sdk/i },
  { id: "GoCardless", rx: /gocardless\.com/i },
];

const EMAIL_TOOLS: Array<{ id: string; rx: RegExp }> = [
  { id: "Mailchimp", rx: /list-manage\.com|chimpstatic\.com|mailchi\.mp/i },
  { id: "HubSpot", rx: /hsforms\.(?:com|net)|js\.hs-scripts\.com|hubspot\.com\/embed/i },
  { id: "Klaviyo", rx: /a\.klaviyo\.com|static\.klaviyo\.com/i },
  { id: "ActiveCampaign", rx: /activehosted\.com|activecampaign\.com\/site/i },
  { id: "Brevo / Sendinblue", rx: /sibforms\.com|sendinblue\.com|brevo\.com/i },
  { id: "ConvertKit", rx: /convertkit\.com|app\.convertkit\.com/i },
  { id: "MailerLite", rx: /static\.mailerlite\.com|assets\.mailerlite\.com/i },
];

const ANALYTICS_TOOLS: Array<{ id: string; rx: RegExp }> = [
  { id: "Google Analytics 4", rx: /googletagmanager\.com\/gtag\/js|gtag\(|G-[A-Z0-9]{4,}/i },
  { id: "Google Tag Manager", rx: /GTM-[A-Z0-9]{4,}|googletagmanager\.com\/gtm\.js/i },
  { id: "Meta Pixel", rx: /connect\.facebook\.net\/[a-z_]+\/fbevents\.js|fbq\(['"]init['"]/i },
  { id: "Plausible", rx: /plausible\.io\/js\//i },
  { id: "Fathom", rx: /cdn\.usefathom\.com/i },
  { id: "Hotjar", rx: /static\.hotjar\.com|hotjar\.com\/c\//i },
  { id: "Microsoft Clarity", rx: /clarity\.ms\/tag/i },
];

const CTA_PHRASES = [
  // English
  "book now", "book online", "book a", "schedule", "make an appointment",
  "get a quote", "request a quote", "get started", "free consultation",
  "free audit", "contact us", "call now", "call today", "get in touch",
  "request a callback", "send a message", "send us a message", "start now",
  "try free", "free trial",
  // Dutch
  "boek nu", "boek online", "afspraak maken", "maak een afspraak",
  "maak afspraak", "plan een afspraak", "plan afspraak", "online boeken",
  "afspraak inplannen", "boek een afspraak",
  "vraag offerte", "offerte aanvragen", "vrijblijvend offerte",
  "neem contact op", "contact opnemen", "neem direct contact op",
  "stuur een bericht", "stuur ons een bericht",
  "bel ons", "bel direct", "bel vandaag", "bel nu",
  "gratis adviesgesprek", "gratis intake", "gratis kennismaking",
  "gratis advies", "vraag aan", "doe een aanvraag",
  "reserveer", "reserveren", "reserveer nu",
];

// Embedded form-builder fingerprints. Many small-business sites no longer
// ship a raw <form> tag — the form lives inside a 3rd-party widget. If we
// see one of these we know there's a working form even without an inline
// <form>.
const FORM_PROVIDERS: Array<{ id: string; rx: RegExp }> = [
  { id: "HubSpot Forms", rx: /hsforms\.(?:com|net)|js\.hsforms\.net|hbspt\.forms\.create/i },
  { id: "Typeform", rx: /typeform\.com|embed\.typeform\.com/i },
  { id: "Jotform", rx: /jotform\.com|form\.jotform\.com/i },
  { id: "Tally", rx: /tally\.so/i },
  { id: "Paperform", rx: /paperform\.co/i },
  { id: "Formspree", rx: /formspree\.io/i },
  { id: "Getform", rx: /getform\.io/i },
  { id: "Contact Form 7", rx: /class=["'][^"']*\bwpcf7\b|wpcf7-form/i },
  { id: "Gravity Forms", rx: /class=["'][^"']*\bgform_wrapper\b|gravityforms/i },
  { id: "WPForms", rx: /class=["'][^"']*\bwpforms-form\b/i },
  { id: "Fluent Forms", rx: /class=["'][^"']*\bfluentform\b|ff-default/i },
  { id: "Netlify Forms", rx: /data-netlify=["']true["']|netlify-honeypot/i },
  { id: "Mautic", rx: /mautic\.com\/form/i },
];

// Review / trust widgets we can fingerprint from HTML.
const TRUST_WIDGETS: Array<{ id: string; rx: RegExp }> = [
  { id: "Trustpilot", rx: /trustpilot\.com|widget\.trustpilot/i },
  { id: "Klantenvertellen", rx: /klantenvertellen\.(?:nl|com)/i },
  { id: "KIYOH", rx: /kiyoh\.(?:com|nl)/i },
  { id: "Feedback Company", rx: /feedbackcompany\.com/i },
  { id: "ZorgkaartNederland", rx: /zorgkaartnederland\.nl/i },
  { id: "Trustindex", rx: /cdn\.trustindex\.io|widget\.trustindex/i },
  { id: "Yotpo", rx: /staticw2\.yotpo\.com/i },
  { id: "Reviews.io", rx: /widget\.reviews\.(?:io|co\.uk)/i },
];

/**
 * Niche → list of words that should count as "the service" in the title.
 * Lowercase. Order doesn't matter; we only check `title.includes(...)` for
 * any of the synonyms, so EN ↔ NL coverage and singular/plural handling is
 * baked in here.
 */
const SERVICE_SYNONYMS: Record<string, string[]> = {
  dentists: ["dentist", "tandarts", "tandheelkunde", "dental"],
  "dental clinics": ["dental", "tandheelkunde", "tandarts"],
  doctors: ["doctor", "huisarts", "arts"],
  physiotherapists: ["physiotherapist", "fysio", "fysiotherapeut", "fysiotherapie"],
  chiropractors: ["chiropractor", "chiropractie"],
  opticians: ["optician", "opticien", "opticien", "optiek"],
  "hair salons": ["hair", "salon", "kapper", "kapsalon", "haarsalon"],
  barbers: ["barber", "barbershop", "kapper", "kapsalon"],
  "beauty salons": ["beauty", "schoonheidssalon", "schoonheid"],
  "nail salons": ["nail", "nagelsalon", "nagelstudio"],
  "tattoo studios": ["tattoo", "tatoeage", "tatoeëerder"],
  spas: ["spa", "wellness", "kuuroord"],
  gyms: ["gym", "fitness", "sportschool"],
  "yoga studios": ["yoga"],
  "pilates studios": ["pilates"],
  "personal trainers": ["personal trainer", "personaltrainer"],
  lawyers: ["lawyer", "law", "advocaat", "advocaten", "juridisch"],
  accountants: ["accountant", "boekhouder", "boekhouding", "fiscalist"],
  "real estate agents": ["real estate", "realtor", "makelaar", "makelaardij"],
  restaurants: ["restaurant", "eetcafé", "eet", "diner", "dining"],
  cafes: ["café", "cafe", "koffie"],
  "coffee shops": ["coffee", "koffiebar", "koffiehuis"],
  bakeries: ["bakery", "bakkerij"],
  florists: ["florist", "bloemist", "bloemenwinkel"],
  veterinarians: ["veterinarian", "vet", "dierenarts", "dierenkliniek"],
  "pet groomers": ["groomer", "trimsalon", "trimmer"],
  photographers: ["photographer", "fotograaf"],
  videographers: ["videographer", "videograaf"],
  "wedding planners": ["wedding planner", "trouwplanner", "trouw"],
  "driving schools": ["driving school", "rijschool", "rij-instructeur"],
  tutors: ["tutor", "bijles", "bijlesleraar"],
  "music teachers": ["music teacher", "muziekleraar", "muziekschool"],
  plumbers: ["plumber", "loodgieter"],
  electricians: ["electrician", "elektricien", "elektriciën"],
  roofers: ["roofer", "dakdekker"],
  carpenters: ["carpenter", "timmerman"],
  painters: ["painter", "schilder"],
  "auto repair shops": ["auto repair", "autoreparatie", "autobedrijf", "garage"],
  "car detailers": ["car detailer", "auto detailer", "detailing"],
  "cleaning services": ["cleaning", "schoonmaak", "schoonmaakbedrijf"],
  "moving companies": ["moving", "verhuisbedrijf", "verhuizers"],
  hotels: ["hotel"],
  "bed and breakfasts": ["bed and breakfast", "bnb", "b&b"],
  pubs: ["pub", "kroeg"],
  bars: ["bar"],
};

/** Resolve niche to its service synonym list. Falls back to the niche itself. */
function serviceWordsFor(niche: string | undefined): string[] {
  const n = (niche ?? "").toLowerCase().trim();
  if (!n) return [];
  if (SERVICE_SYNONYMS[n]) return SERVICE_SYNONYMS[n];
  // try singular form ("dentist" -> dentists key)
  const plural = `${n}s`;
  if (SERVICE_SYNONYMS[plural]) return SERVICE_SYNONYMS[plural];
  // fall back to the niche itself + a singular guess
  const singular = n.endsWith("s") ? n.slice(0, -1) : n;
  return Array.from(new Set([n, singular]));
}

// ── Fetch ────────────────────────────────────────────────────────────────

interface FetchOutcome {
  ok: boolean;
  status?: number;
  finalUrl?: string;
  html?: string;
  fetchMs: number;
  error?: string;
}

async function fetchHomepage(rawUrl: string): Promise<FetchOutcome> {
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  const started = Date.now();
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,*/*;q=0.5",
      },
      redirect: "follow",
      cache: "no-store",
      signal: ctrl.signal,
    });
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        finalUrl: res.url,
        fetchMs: Date.now() - started,
        error: `Server returned HTTP ${res.status}.`,
      };
    }
    const reader = res.body?.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    if (reader) {
      while (total < MAX_BYTES) {
        // eslint-disable-next-line no-await-in-loop
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;
        chunks.push(value);
        total += value.byteLength;
        if (total >= MAX_BYTES) break;
      }
      try {
        await reader.cancel();
      } catch {
        /* ignore */
      }
    }
    const buf = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      buf.set(c, offset);
      offset += c.byteLength;
    }
    const html = new TextDecoder("utf-8", { fatal: false }).decode(buf);
    return {
      ok: true,
      status: res.status,
      finalUrl: res.url,
      html,
      fetchMs: Date.now() - started,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    const aborted = msg.toLowerCase().includes("abort");
    return {
      ok: false,
      fetchMs: Date.now() - started,
      error: aborted ? `Website did not respond within ${FETCH_TIMEOUT_MS / 1000}s.` : `Fetch failed: ${msg}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

// ── HTML parsing helpers ─────────────────────────────────────────────────

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function snippet(s: string, max = 140): string {
  const cleaned = s.replace(/\s+/g, " ").trim();
  return cleaned.length > max ? `${cleaned.slice(0, max - 1)}…` : cleaned;
}

interface ParsedHtml {
  raw: string;
  lower: string;
  finalUrl: string;
  baseHost: string;
  title: string | null;
  metaDescription: string | null;
  hasViewport: boolean;
  noindex: boolean;
  scriptSrcs: string[];
  linkHrefs: string[];
  navHrefs: string[];
  jsonLd: string[];
  hasH1: boolean;
  hasH2: boolean;
  hasH3: boolean;
  bodyText: string;
  bodyLower: string;
  earlyHtmlLower: string; // first ~3KB of raw HTML for "above fold" approximation
  forms: string[];
}

function parseHtml(rawHtml: string, finalUrl: string): ParsedHtml {
  const html = rawHtml;
  const lower = html.toLowerCase();
  let baseHost = "";
  try {
    baseHost = new URL(finalUrl).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    /* ignore */
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDescMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i,
  );
  const viewport = /<meta[^>]+name=["']viewport["'][^>]*>/i.test(html);
  const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i);
  const noindex = robotsMatch ? /noindex/i.test(robotsMatch[1]) : false;

  const scriptSrcs: string[] = [];
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
    scriptSrcs.push(m[1]);
  }

  const linkHrefs: string[] = [];
  for (const m of html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi)) {
    linkHrefs.push(m[1]);
  }

  const navHrefs: string[] = [];
  for (const navBlock of html.matchAll(/<nav[\s\S]*?<\/nav>/gi)) {
    for (const m of navBlock[0].matchAll(/href=["']([^"']+)["']/gi)) {
      navHrefs.push(m[1]);
    }
  }

  const jsonLd: string[] = [];
  for (const m of html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    jsonLd.push(m[1]);
  }

  const hasH1 = /<h1[\s>]/i.test(html);
  const hasH2 = /<h2[\s>]/i.test(html);
  const hasH3 = /<h3[\s>]/i.test(html);

  const forms: string[] = [];
  for (const m of html.matchAll(/<form[\s\S]*?<\/form>/gi)) {
    forms.push(m[0]);
  }

  const bodyText = stripTags(html);
  const earlyHtmlLower = lower.slice(0, 3_500);

  return {
    raw: html,
    lower,
    finalUrl,
    baseHost,
    title: titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : null,
    metaDescription: metaDescMatch ? metaDescMatch[1].trim() : null,
    hasViewport: viewport,
    noindex,
    scriptSrcs,
    linkHrefs,
    navHrefs,
    jsonLd,
    hasH1,
    hasH2,
    hasH3,
    bodyText,
    bodyLower: bodyText.toLowerCase(),
    earlyHtmlLower,
    forms,
  };
}

function detectTools<T extends { id: string; rx: RegExp }>(
  catalog: T[],
  haystack: string,
): string[] {
  const found = new Set<string>();
  for (const { id, rx } of catalog) {
    if (rx.test(haystack)) found.add(id);
  }
  return [...found];
}

// ── Field detectors ──────────────────────────────────────────────────────

type Detector = (
  p: ParsedHtml,
  ctx: AutoAuditInput,
  fetchMs: number,
) => AutoAuditFieldResult | null;

function detectMobileFriendly(p: ParsedHtml): AutoAuditFieldResult | null {
  if (p.hasViewport) {
    return {
      value: true,
      confidence: "high",
      evidence: '<meta name="viewport" …>',
      note: "Viewport meta tag present.",
    };
  }
  return {
    value: false,
    confidence: "medium",
    note: "No viewport meta tag — likely not mobile-optimised.",
  };
}

function detectLoadsFast(_p: ParsedHtml, _c: AutoAuditInput, fetchMs: number): AutoAuditFieldResult {
  if (fetchMs <= FAST_LOAD_BUDGET_MS) {
    return {
      value: true,
      confidence: "medium",
      note: `Homepage HTML returned in ${fetchMs} ms (≤ ${FAST_LOAD_BUDGET_MS} ms).`,
    };
  }
  if (fetchMs >= SLOW_LOAD_BUDGET_MS) {
    return {
      value: false,
      confidence: "medium",
      note: `Homepage HTML took ${fetchMs} ms — slow signal.`,
    };
  }
  return {
    confidence: "low",
    note: `Homepage HTML returned in ${fetchMs} ms — borderline. Verify with PageSpeed.`,
  };
}

function findCtaPhrase(haystack: string): string | null {
  for (const phrase of CTA_PHRASES) {
    if (haystack.includes(phrase)) return phrase;
  }
  return null;
}

/** Scan visible <a> and <button> labels for a CTA phrase. Returns up to N hits. */
function findCtaButtons(rawHtml: string, max = 3): string[] {
  const hits = new Set<string>();
  const blockRx = /<(?:a|button)[^>]*>([\s\S]*?)<\/(?:a|button)>/gi;
  for (const m of rawHtml.matchAll(blockRx)) {
    const inner = stripTags(m[1]).toLowerCase();
    if (!inner || inner.length > 80) continue;
    const phrase = findCtaPhrase(inner);
    if (phrase) {
      hits.add(phrase);
      if (hits.size >= max) break;
    }
  }
  return [...hits];
}

function detectClearCTA(p: ParsedHtml): AutoAuditFieldResult {
  const buttonHits = findCtaButtons(p.raw);
  if (buttonHits.length > 0) {
    return {
      value: true,
      confidence: "high",
      evidence: buttonHits.join(", "),
      note: `CTA-style label on ${buttonHits.length === 1 ? "a button/link" : `${buttonHits.length} buttons/links`}.`,
    };
  }
  const found = findCtaPhrase(p.bodyLower);
  if (found) {
    return {
      value: true,
      confidence: "medium",
      evidence: found,
      note: `CTA-style phrase found ("${found}").`,
    };
  }
  return {
    value: false,
    confidence: "low",
    note: "No common CTA phrasing detected. Confirm visually.",
  };
}

function detectContactForm(
  p: ParsedHtml,
  formProviders: string[],
): AutoAuditFieldResult {
  // 1. Embedded form-builder widgets count as a form even with no <form> tag.
  if (formProviders.length > 0) {
    return {
      value: true,
      confidence: "high",
      evidence: formProviders.join(", "),
      note: "Embedded form provider detected on the page.",
    };
  }
  // 2. Inline <form> with contact-style fields.
  for (const f of p.forms) {
    const lf = f.toLowerCase();
    if (
      /name=["'](?:email|e-?mail|message|name|naam|bericht|telefoon|phone|opmerking|onderwerp)["']/i.test(f) ||
      /(contact|kontakt|contacto|formulier|aanvraag|offerte)/i.test(lf)
    ) {
      return {
        value: true,
        confidence: "high",
        evidence: snippet(f),
        note: "Inline form with contact-style fields.",
      };
    }
  }
  if (p.forms.length > 0) {
    return {
      value: true,
      confidence: "low",
      note: "<form> present but unclear if contact-related.",
    };
  }
  // 3. Inputs without a <form> wrapper (some sites JS-mount the form).
  if (
    /<input[^>]+name=["'](?:email|e-?mail|naam|telefoon|phone|message|bericht)["']/i.test(p.raw) ||
    /<input[^>]+type=["']email["']/i.test(p.raw)
  ) {
    return {
      value: true,
      confidence: "medium",
      note: "Contact-style input fields present (no <form> wrapper).",
    };
  }
  // 4. Contact-page link is a soft positive: visitors can reach a form,
  //    just not from the homepage. Mark "true" with low confidence so the
  //    operator can confirm.
  const contactLink = p.linkHrefs.find((h) =>
    /(?:^|\/|#)(contact(?:ez|s)?|kontakt|contacto|formulier|get-in-touch)(?:\/|$|[?#])/i.test(h),
  );
  if (contactLink) {
    return {
      value: true,
      confidence: "low",
      evidence: contactLink,
      note: "Contact page linked, but no form on the homepage.",
    };
  }
  return { value: false, confidence: "high", note: "No form, inputs, or contact-page link." };
}

function detectPhoneVisible(p: ParsedHtml): AutoAuditFieldResult {
  const tel = p.linkHrefs.find((h) => /^tel:/i.test(h));
  if (tel) {
    return {
      value: true,
      confidence: "high",
      evidence: tel,
      note: "Tap-to-call link present.",
    };
  }
  // Loose: phone-like pattern in early HTML
  const phoneRx = /(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)\d{3}[\s.-]?\d{3,4}/;
  const earlyText = stripTags(p.raw.slice(0, 6_000));
  const m = earlyText.match(phoneRx);
  if (m) {
    return {
      value: true,
      confidence: "medium",
      evidence: m[0],
      note: "Phone number visible near the top of the page.",
    };
  }
  return { value: false, confidence: "medium", note: "No phone link or early phone number." };
}

/** Postal-code patterns per locale. Order matters — most specific first. */
const POSTAL_PATTERNS: Array<{ id: string; rx: RegExp }> = [
  { id: "NL", rx: /\b\d{4}\s?[A-Z]{2}\b/ },
  { id: "UK", rx: /\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/ },
  { id: "DE", rx: /\b\d{5}\s+[A-Z][a-zA-Zäöüß-]+\b/ },
];

function detectGoogleMapsLink(p: ParsedHtml): AutoAuditFieldResult {
  // 1. Outbound Maps link (deeplink, share link, embed redirect).
  const linkHas = p.linkHrefs.some((h) =>
    /google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(h),
  );
  if (linkHas) {
    return { value: true, confidence: "high", note: "Google Maps link found." };
  }
  // 2. Embedded Maps iframe.
  if (
    /<iframe[^>]+src=["'][^"']*google\.[a-z.]+\/maps\/embed/i.test(p.raw) ||
    /<iframe[^>]+src=["'][^"']*maps\.googleapis\.com\/maps/i.test(p.raw)
  ) {
    return {
      value: true,
      confidence: "high",
      evidence: "<iframe …google.com/maps/embed…>",
      note: "Embedded Google Maps iframe.",
    };
  }
  // 3. Postal code in body — strong locale-specific address signal.
  for (const { id, rx } of POSTAL_PATTERNS) {
    const m = p.bodyText.match(rx);
    if (m) {
      return {
        value: true,
        confidence: "medium",
        evidence: `${id} postal code: ${m[0]}`,
        note: "Address visible (postal code), but no Maps link.",
      };
    }
  }
  // 4. Street pattern as a final fallback.
  const streetRx = /\b\d{1,4}\s+[A-Za-zÀ-ž'’.-]+(?:straat|laan|weg|street|avenue|road|plein|boulevard|park|kade|hof|singel|gracht|dijk)\b/i;
  const sm = p.bodyText.match(streetRx);
  if (sm) {
    return {
      value: true,
      confidence: "low",
      evidence: sm[0],
      note: "Street address detected, but no Maps link.",
    };
  }
  return { value: false, confidence: "medium", note: "No Maps link or visible address." };
}

function detectTrustSignals(
  p: ParsedHtml,
  trustWidgets: string[],
): AutoAuditFieldResult {
  const evidence: string[] = [];
  let highConf = false;

  if (trustWidgets.length > 0) {
    evidence.push(`widget · ${trustWidgets.join(", ")}`);
    highConf = true;
  }
  if (
    p.jsonLd.some((j) =>
      /"@type"\s*:\s*"(?:Review|AggregateRating)"/.test(j),
    )
  ) {
    evidence.push("review schema");
    highConf = true;
  }
  if (
    /\b(?:reviews?|testimonials?|recensies?|getuigenissen?|klantervaringen?|klantbeoordeling(?:en)?|klantreviews?|tevreden(?:e)? klant(?:en)?|aanbeveling(?:en)?|ervaringen|beoordeling(?:en)?)\b/i.test(
      p.bodyLower,
    )
  ) {
    evidence.push("trust keyword");
  }
  // Visible rating snippet: "4,8 / 5", "4.8/5", "9.5/10", or 4-5 star glyphs.
  const ratingMatch =
    p.bodyText.match(/\b(?:[1-9](?:[.,]\d)?|10)\s*\/\s*(?:5|10)\b/) ??
    p.bodyText.match(/★{4,5}|⭐{4,5}/);
  if (ratingMatch) {
    evidence.push(`rating · ${ratingMatch[0]}`);
    highConf = true;
  } else if (/\b(?:stars?|sterren)\b/i.test(p.bodyLower)) {
    evidence.push("star mention");
  }
  if (evidence.length === 0) {
    return { value: false, confidence: "medium", note: "No review or testimonial signals." };
  }
  return {
    value: true,
    confidence: highConf ? "high" : "medium",
    evidence: evidence.join(" · "),
    note: "Reviews / testimonials referenced on the page.",
  };
}

function detectServicePages(p: ParsedHtml): AutoAuditFieldResult {
  const candidates = p.linkHrefs.filter((h) =>
    /(?:^|\/)(services?|diensten|treatments?|behandelingen|behandeling|therapy|therapie|aanbod|menu|offerings)(?:\/|$)/i.test(h),
  );
  if (candidates.length >= 2) {
    return {
      value: true,
      confidence: "high",
      evidence: candidates.slice(0, 3).join(" · "),
      note: `${candidates.length} service-style links.`,
    };
  }
  if (candidates.length === 1) {
    return {
      value: true,
      confidence: "medium",
      evidence: candidates[0],
      note: "One service-style link found.",
    };
  }
  return {
    value: false,
    confidence: "low",
    note: "No dedicated service-page links detected in nav or body.",
  };
}

function detectCityLandingPage(p: ParsedHtml, ctx: AutoAuditInput): AutoAuditFieldResult | null {
  const city = (ctx.city ?? "").toLowerCase().trim();
  if (city.length < 2) return null;
  const titleHas = p.title?.toLowerCase().includes(city) ?? false;
  const h1Match = p.raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Text = h1Match ? stripTags(h1Match[1]).toLowerCase() : "";
  const h1Has = h1Text.includes(city);
  const bodyHas = (p.bodyLower.match(new RegExp(`\\b${city}\\b`, "g")) ?? []).length;
  if (titleHas || h1Has || bodyHas >= 3) {
    return {
      value: true,
      confidence: titleHas || h1Has ? "high" : "medium",
      evidence: titleHas
        ? `Title mentions ${ctx.city}`
        : h1Has
          ? `H1 mentions ${ctx.city}`
          : `${bodyHas}× in body`,
      note: "City referenced on the homepage.",
    };
  }
  return {
    value: false,
    confidence: "medium",
    note: `Homepage doesn't mention ${ctx.city}.`,
  };
}

function detectLocalSEOTitle(p: ParsedHtml, ctx: AutoAuditInput): AutoAuditFieldResult | null {
  if (!p.title) {
    return { value: false, confidence: "high", note: "No <title> tag." };
  }
  const title = p.title.toLowerCase();
  const city = (ctx.city ?? "").toLowerCase().trim();
  const serviceWords = serviceWordsFor(ctx.niche);
  const hasCity = city.length >= 2 && title.includes(city);
  const matchedWord = serviceWords.find((w) => w.length >= 3 && title.includes(w));
  if (hasCity && matchedWord) {
    return {
      value: true,
      confidence: "high",
      evidence: snippet(p.title, 100),
      note: `Title mentions city + service ("${matchedWord}").`,
    };
  }
  if (hasCity || matchedWord) {
    return {
      value: false,
      confidence: "medium",
      evidence: snippet(p.title, 100),
      note: hasCity
        ? "Title mentions city but not the service."
        : `Title mentions service ("${matchedWord}") but not the city.`,
    };
  }
  return {
    value: false,
    confidence: "high",
    evidence: snippet(p.title, 100),
    note: "Title mentions neither city nor service.",
  };
}

function detectMetaDescription(p: ParsedHtml): AutoAuditFieldResult {
  if (p.metaDescription && p.metaDescription.length > 0) {
    return {
      value: true,
      confidence: "high",
      evidence: snippet(p.metaDescription, 120),
      note: "Meta description present.",
    };
  }
  return { value: false, confidence: "high", note: "No meta description." };
}

function detectH1(p: ParsedHtml): AutoAuditFieldResult {
  return p.hasH1
    ? { value: true, confidence: "high", note: "<h1> found." }
    : { value: false, confidence: "high", note: "No <h1> on homepage." };
}

function detectHeadingStructure(p: ParsedHtml): AutoAuditFieldResult {
  if (p.hasH1 && p.hasH2) {
    return {
      value: true,
      confidence: "medium",
      note: `H1 + H2${p.hasH3 ? " + H3" : ""} present.`,
    };
  }
  return {
    value: false,
    confidence: "medium",
    note: "Heading hierarchy incomplete (missing H2 or H1).",
  };
}

function detectLocalKeywords(p: ParsedHtml, ctx: AutoAuditInput): AutoAuditFieldResult | null {
  const city = (ctx.city ?? "").toLowerCase().trim();
  if (city.length < 2) return null;
  const count = (p.bodyLower.match(new RegExp(`\\b${city}\\b`, "g")) ?? []).length;
  if (count >= 3) {
    return {
      value: true,
      confidence: "high",
      evidence: `${count}× "${ctx.city}"`,
      note: "City repeated in copy.",
    };
  }
  if (count === 1 || count === 2) {
    return {
      value: false,
      confidence: "medium",
      evidence: `${count}× "${ctx.city}"`,
      note: "City barely mentioned in body copy.",
    };
  }
  return {
    value: false,
    confidence: "high",
    note: `City "${ctx.city}" not mentioned in body copy.`,
  };
}

function detectInternalLinks(p: ParsedHtml): AutoAuditFieldResult {
  if (!p.baseHost) return { confidence: "unknown", note: "Couldn't resolve site host." };
  let count = 0;
  for (const href of p.linkHrefs) {
    if (!href) continue;
    if (/^(?:#|mailto:|tel:|javascript:)/i.test(href)) continue;
    if (/^https?:\/\//i.test(href)) {
      try {
        const h = new URL(href).hostname.toLowerCase().replace(/^www\./, "");
        if (h === p.baseHost) count++;
      } catch {
        /* ignore */
      }
    } else {
      // relative
      count++;
    }
  }
  if (count >= 5) {
    return { value: true, confidence: "high", note: `${count} internal links on the homepage.` };
  }
  return {
    value: false,
    confidence: "medium",
    note: `Only ${count} internal links — limited internal linking.`,
  };
}

function detectIndexable(p: ParsedHtml): AutoAuditFieldResult {
  if (p.noindex) {
    return {
      value: false,
      confidence: "high",
      evidence: "<meta name=\"robots\" content=\"noindex\">",
      note: "Homepage carries a noindex directive.",
    };
  }
  return { value: true, confidence: "high", note: "No noindex meta tag." };
}

function detectSchemaMarkup(p: ParsedHtml): AutoAuditFieldResult {
  if (p.jsonLd.length === 0) {
    return { value: false, confidence: "high", note: "No JSON-LD schema blocks." };
  }
  for (const block of p.jsonLd) {
    if (
      /"@type"\s*:\s*"(?:LocalBusiness|MedicalBusiness|Restaurant|HealthAndBeautyBusiness|Dentist|HairSalon|BeautySalon|AutoRepair|Plumber|Electrician|HomeAndConstructionBusiness|ProfessionalService|HealthClub|FitnessCenter|RealEstateAgent|LegalService)"/.test(
        block,
      )
    ) {
      return {
        value: true,
        confidence: "high",
        note: "LocalBusiness-style JSON-LD found.",
      };
    }
  }
  return {
    value: false,
    confidence: "medium",
    note: "JSON-LD present but no LocalBusiness type.",
  };
}

function detectClearOffer(p: ParsedHtml, ctx: AutoAuditInput): AutoAuditFieldResult {
  const niche = (ctx.niche ?? "").toLowerCase().trim();
  const earlyText = stripTags(p.raw.slice(0, 4_000)).toLowerCase();
  const ctaInEarly = findCtaPhrase(p.earlyHtmlLower);
  const nicheInEarly = niche.length >= 3 && earlyText.includes(niche.replace(/s$/, ""));
  if (ctaInEarly && nicheInEarly) {
    return {
      value: true,
      confidence: "low",
      note: "Hero contains both a CTA phrase and the service niche. Confirm visually.",
    };
  }
  if (ctaInEarly) {
    return {
      value: true,
      confidence: "low",
      note: "Early CTA phrase but niche not obvious in hero. Confirm visually.",
    };
  }
  return {
    confidence: "low",
    note: "Couldn't tell from HTML alone — verify the hero pitch.",
  };
}

function detectLowContactFriction(
  p: ParsedHtml,
  fields: Partial<Record<AuditChecklistKey, AutoAuditFieldResult>>,
): AutoAuditFieldResult {
  const phone = fields.hasPhoneVisible?.value === true;
  const form = fields.hasContactForm?.value === true;
  const email = /mailto:[^"'>]+/i.test(p.raw);
  const channels = [phone, form, email].filter(Boolean).length;
  if (channels >= 2) {
    return {
      value: true,
      confidence: "medium",
      note: `Multiple contact paths (phone${phone ? " ✓" : ""}${form ? ", form" : ""}${email ? ", email" : ""}).`,
    };
  }
  if (channels === 1) {
    return {
      value: false,
      confidence: "medium",
      note: "Only one contact channel — friction likely.",
    };
  }
  return { value: false, confidence: "medium", note: "No obvious contact channels." };
}

/**
 * Phrases that signal a booking flow exists even without a known SaaS
 * provider — sites often link to /afspraak, /book, /online-boeken, etc.
 */
const BOOKING_KEYWORDS_RX =
  /\b(?:book(?:ing)?\s+now|book\s+online|book\s+(?:a|an|your)\s+appointment|schedule\s+(?:an?|your)?\s*appointment|online\s+book(?:ing|en)?|online\s+afspraak|maak\s+(?:een\s+)?afspraak|afspraak\s+(?:maken|inplannen)|plan\s+(?:een\s+)?afspraak|reserveer(?:\s+(?:nu|online))?|reserveren|boek\s+(?:nu|online|een\s+afspraak))\b/i;

function detectLowBookingFriction(
  bookingTools: string[],
  p: ParsedHtml,
): AutoAuditFieldResult {
  if (bookingTools.length > 0) {
    return {
      value: true,
      confidence: "high",
      evidence: bookingTools.join(", "),
      note: "Online booking tool detected.",
    };
  }
  // Keyword fallback — homepage advertises self-serve booking even though
  // we can't fingerprint the underlying SaaS.
  const km = p.bodyLower.match(BOOKING_KEYWORDS_RX);
  if (km) {
    return {
      value: true,
      confidence: "medium",
      evidence: km[0],
      note: "Self-serve booking phrasing on the page (no known SaaS detected).",
    };
  }
  // Booking-style link target.
  const bookingLink = p.linkHrefs.find((h) =>
    /(?:^|\/|#)(book|booking|appointment|afspraak|reserveer|reserveren|online-boeken|online-afspraak|book-now|maak-afspraak)(?:\/|$|[?#])/i.test(h),
  );
  if (bookingLink) {
    return {
      value: true,
      confidence: "low",
      evidence: bookingLink,
      note: "Booking-style link found, but no widget on the homepage.",
    };
  }
  return {
    value: false,
    confidence: "medium",
    note: "No booking widget, link, or booking phrasing detected.",
  };
}

function detectAboveFoldCTA(p: ParsedHtml): AutoAuditFieldResult {
  // Scan the first ~5 KB of raw HTML for a CTA in either body text OR a
  // button/link label. The early-HTML approximation tilts toward the hero
  // / above-the-fold area on most static and SSR'd sites.
  const earlySlice = p.raw.slice(0, 5_000);
  const buttonHits = findCtaButtons(earlySlice, 1);
  if (buttonHits.length > 0) {
    return {
      value: true,
      confidence: "high",
      evidence: buttonHits[0],
      note: "CTA button/link in the early HTML.",
    };
  }
  const phrase = findCtaPhrase(p.earlyHtmlLower);
  if (phrase) {
    return {
      value: true,
      confidence: "medium",
      evidence: phrase,
      note: "CTA-style phrase appears in early HTML.",
    };
  }
  return {
    value: false,
    confidence: "low",
    note: "No CTA phrase in the first ~5 KB of HTML — confirm visually.",
  };
}

function detectMobileCTA(p: ParsedHtml): AutoAuditFieldResult {
  const tel = p.linkHrefs.some((h) => /^tel:/i.test(h));
  const sticky = /(?:position:\s*(?:fixed|sticky)|class=["'][^"']*(?:sticky|fixed-bottom|tap-to-call|click-to-call|floating-cta)[^"']*)/i.test(
    p.raw,
  );
  if (tel && sticky) {
    return {
      value: true,
      confidence: "high",
      note: "tel: link + sticky/fixed positioning class detected.",
    };
  }
  if (tel) {
    return {
      value: true,
      confidence: "low",
      note: "tel: link present, but no obvious sticky CTA — confirm on mobile.",
    };
  }
  return { value: false, confidence: "medium", note: "No sticky / tap-to-call CTA." };
}

const LEAD_CAPTURE_RX =
  /\b(?:newsletter|nieuwsbrief|free\s+quote|gratis\s+offerte|estimate|aanvraag|free\s+audit|gratis\s+audit|download|ebook|whitepaper|gratis\s+advies|inschrijven|aanmelden|intake(?:gesprek)?|consult(?:atie)?|kennismaking|gratis\s+kennismaking|vrijblijvend(?:e)?(?:\s+offerte)?|proefles|free\s+trial|trial|demo\s+aanvragen|demo\s+request|blijf\s+op\s+de\s+hoogte|stay\s+in\s+touch)\b/i;

function detectLeadCapture(
  p: ParsedHtml,
  fields: Partial<Record<AuditChecklistKey, AutoAuditFieldResult>>,
): AutoAuditFieldResult {
  const hasContactForm = fields.hasContactForm?.value === true;
  const captureMatch = p.bodyLower.match(LEAD_CAPTURE_RX);
  if (captureMatch) {
    return {
      value: true,
      confidence: "high",
      evidence: captureMatch[0],
      note: "Soft lead-capture wording on the page.",
    };
  }
  if (hasContactForm) {
    return {
      value: true,
      confidence: "medium",
      note: "Contact form available — counts as soft lead capture.",
    };
  }
  return { value: false, confidence: "medium", note: "No soft lead capture detected." };
}

function detectQuoteAutomation(
  p: ParsedHtml,
  formProviders: string[],
): AutoAuditFieldResult {
  const quoteRx = /\b(?:request\s+a\s+quote|get\s+a\s+quote|free\s+quote|quote\s+request|offerte(?:\s+aanvragen|\s+aanvraag)?|prijsopgave|aanvraag\s+offerte|vrijblijvend(?:e)?\s+offerte|aanvragen|estimate)\b/i;
  const km = p.bodyLower.match(quoteRx);
  const hasForm = p.forms.length > 0 || formProviders.length > 0;
  if (km && hasForm) {
    return {
      value: true,
      confidence: "high",
      evidence: km[0],
      note: "Quote / estimate phrasing + form on page.",
    };
  }
  if (km) {
    return {
      value: false,
      confidence: "low",
      evidence: km[0],
      note: "Quote/estimate mentioned but no form found on the homepage.",
    };
  }
  return { value: false, confidence: "medium", note: "No quote / estimate flow detected." };
}

// ── Orchestration ────────────────────────────────────────────────────────

const NO_OPINION_KEYS: AuditChecklistKey[] = [
  "hasModernDesign",
  "hasGoogleBusinessProfile",
  "hasReminderEmails",
  "hasInternalDashboard",
];

export async function runAutoAudit(
  input: AutoAuditInput,
): Promise<AutoAuditResult> {
  const fetchedAt = new Date().toISOString();
  if (!input.websiteUri || !input.websiteUri.trim()) {
    return {
      ok: false,
      error: "This lead has no website to audit.",
      fetchedAt,
      fields: {},
      detectedTools: { booking: [], payments: [], emailAutomation: [], analytics: [] },
    };
  }

  const fetchOutcome = await fetchHomepage(input.websiteUri.trim());
  if (!fetchOutcome.ok || !fetchOutcome.html) {
    console.error("[auto-audit] fetch.failed", {
      websiteUri: input.websiteUri,
      status: fetchOutcome.status,
      error: fetchOutcome.error,
    });
    return {
      ok: false,
      error:
        fetchOutcome.error ?? "Could not load the website (no body returned).",
      fetchedAt,
      finalUrl: fetchOutcome.finalUrl,
      fetchMs: fetchOutcome.fetchMs,
      fields: {},
      detectedTools: { booking: [], payments: [], emailAutomation: [], analytics: [] },
    };
  }

  const parsed = parseHtml(fetchOutcome.html, fetchOutcome.finalUrl ?? input.websiteUri);
  const detectedTools = {
    booking: detectTools(BOOKING_TOOLS, parsed.raw),
    payments: detectTools(PAYMENT_TOOLS, parsed.raw),
    emailAutomation: detectTools(EMAIL_TOOLS, parsed.raw),
    analytics: detectTools(ANALYTICS_TOOLS, parsed.raw),
  };
  const formProviders = detectTools(FORM_PROVIDERS, parsed.raw);
  const trustWidgets = detectTools(TRUST_WIDGETS, parsed.raw);

  const fields: Partial<Record<AuditChecklistKey, AutoAuditFieldResult>> = {};

  // Order matters where one detector references another's output.
  const earlyDetectors: Array<[AuditChecklistKey, Detector]> = [
    ["isMobileFriendly", (p) => detectMobileFriendly(p)],
    ["loadsFast", (p, c, ms) => detectLoadsFast(p, c, ms)],
    ["hasClearCTA", (p) => detectClearCTA(p)],
    ["hasContactForm", (p) => detectContactForm(p, formProviders)],
    ["hasPhoneVisible", (p) => detectPhoneVisible(p)],
    ["hasGoogleMapsLink", (p) => detectGoogleMapsLink(p)],
    ["hasTrustSignals", (p) => detectTrustSignals(p, trustWidgets)],
    ["hasServicePages", (p) => detectServicePages(p)],
    ["hasCityLandingPage", detectCityLandingPage],
    ["hasLocalSEOTitle", detectLocalSEOTitle],
    ["hasMetaDescription", (p) => detectMetaDescription(p)],
    ["hasH1", (p) => detectH1(p)],
    ["hasHeadingStructure", (p) => detectHeadingStructure(p)],
    ["hasLocalKeywords", detectLocalKeywords],
    ["hasInternalLinks", (p) => detectInternalLinks(p)],
    ["isIndexable", (p) => detectIndexable(p)],
    ["hasSchemaMarkup", (p) => detectSchemaMarkup(p)],
    ["hasClearOffer", (p, c) => detectClearOffer(p, c)],
    ["hasAboveFoldCTA", (p) => detectAboveFoldCTA(p)],
    ["hasMobileCTA", (p) => detectMobileCTA(p)],
    ["hasQuoteAutomation", (p) => detectQuoteAutomation(p, formProviders)],
  ];

  for (const [key, fn] of earlyDetectors) {
    const r = fn(parsed, input, fetchOutcome.fetchMs);
    if (r) fields[key] = r;
  }

  // Detectors that depend on previously-set fields:
  fields.lowContactFriction = detectLowContactFriction(parsed, fields);
  fields.lowBookingFriction = detectLowBookingFriction(detectedTools.booking, parsed);
  fields.hasLeadCapture = detectLeadCapture(parsed, fields);

  // Tool-fingerprint backed booleans
  fields.hasBookingAutomation = detectedTools.booking.length > 0
    ? {
        value: true,
        confidence: "high",
        evidence: detectedTools.booking.join(", "),
        note: "Online booking platform detected.",
      }
    : {
        value: false,
        confidence: "medium",
        note: "No known booking platform fingerprint found.",
      };

  fields.hasInvoiceAutomation = detectedTools.payments.length > 0
    ? {
        value: true,
        confidence: "high",
        evidence: detectedTools.payments.join(", "),
        note: "Payment processor detected on the page.",
      }
    : {
        value: false,
        confidence: "low",
        note: "No payment processor on the homepage — invoicing setup unclear.",
      };

  fields.hasFollowUpAutomation = detectedTools.emailAutomation.length > 0
    ? {
        value: true,
        confidence: "high",
        evidence: detectedTools.emailAutomation.join(", "),
        note: "Email-automation provider detected.",
      }
    : {
        value: false,
        confidence: "medium",
        note: "No common email-automation provider detected.",
      };

  fields.hasAnalytics = detectedTools.analytics.length > 0
    ? {
        value: true,
        confidence: "high",
        evidence: detectedTools.analytics.join(", "),
        note: "Analytics provider detected.",
      }
    : {
        value: false,
        confidence: "high",
        note: "No analytics provider detected.",
      };

  // Mark the explicitly-manual ones so the UI can render an info row.
  for (const k of NO_OPINION_KEYS) {
    fields[k] = {
      confidence: "unknown",
      note: "Needs manual judgement — auto-audit can't tell from HTML.",
    };
  }

  console.log("[auto-audit] done", {
    websiteUri: input.websiteUri,
    fetchMs: fetchOutcome.fetchMs,
    decided: Object.values(fields).filter((f) => typeof f?.value === "boolean").length,
    booking: detectedTools.booking,
    analytics: detectedTools.analytics,
  });

  return {
    ok: true,
    fetchedAt,
    finalUrl: fetchOutcome.finalUrl,
    fetchMs: fetchOutcome.fetchMs,
    fields,
    detectedTools,
  };
}
