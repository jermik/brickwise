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
  // Dutch
  "boek nu", "boek online", "afspraak maken", "boek een afspraak",
  "vraag offerte", "offerte aanvragen", "neem contact op", "contact opnemen",
  "gratis adviesgesprek", "gratis intake",
];

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

function detectClearCTA(p: ParsedHtml): AutoAuditFieldResult {
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

function detectContactForm(p: ParsedHtml): AutoAuditFieldResult {
  if (p.forms.length === 0) {
    return { value: false, confidence: "high", note: "No <form> elements on the homepage." };
  }
  for (const f of p.forms) {
    const lf = f.toLowerCase();
    if (
      /name=["'](?:email|e-?mail|message|name|naam|bericht|telefoon|phone)["']/i.test(f) ||
      /(contact|kontakt|contacto|formulier)/i.test(lf)
    ) {
      return {
        value: true,
        confidence: "high",
        evidence: snippet(f),
        note: "Found a form with contact-style fields.",
      };
    }
  }
  return {
    value: true,
    confidence: "low",
    note: "Form present but unclear if contact-related.",
  };
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

function detectGoogleMapsLink(p: ParsedHtml): AutoAuditFieldResult {
  const has = p.linkHrefs.some((h) => /google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(h));
  if (has) {
    return { value: true, confidence: "high", note: "Google Maps link found." };
  }
  // Address pattern as fallback
  const addrRx = /\b\d{1,4}\s+[A-Za-zÀ-ž'’.-]+(?:straat|laan|weg|street|avenue|road|plein|boulevard)\b/i;
  const m = p.bodyText.match(addrRx);
  if (m) {
    return {
      value: true,
      confidence: "low",
      evidence: m[0],
      note: "Street address detected, but no Maps link.",
    };
  }
  return { value: false, confidence: "medium", note: "No Maps link or visible address." };
}

function detectTrustSignals(p: ParsedHtml): AutoAuditFieldResult {
  const evidence: string[] = [];
  if (/\breview(?:s)?\b|testimonial|getuigenis|klantervaring|trustpilot|google reviews|recensie/i.test(p.bodyLower)) {
    evidence.push("review keyword");
  }
  if (p.jsonLd.some((j) => /"@type"\s*:\s*"(?:Review|AggregateRating)"/.test(j))) {
    evidence.push("Review schema");
  }
  if (/star|★|⭐|rating/i.test(p.bodyLower)) {
    evidence.push("rating mention");
  }
  if (evidence.length > 0) {
    return {
      value: true,
      confidence: "medium",
      evidence: evidence.join(", "),
      note: "Reviews / testimonials referenced on the page.",
    };
  }
  return { value: false, confidence: "medium", note: "No review or testimonial signals." };
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
  const niche = (ctx.niche ?? "").toLowerCase().trim();
  // Simple service-keyword bag so the test passes for niches that aren't exact words in the title.
  const serviceWords = niche
    ? Array.from(new Set([niche, niche.replace(/s$/, "")]))
    : [];
  const hasCity = city.length >= 2 && title.includes(city);
  const hasService = serviceWords.some((w) => w.length >= 3 && title.includes(w));
  if (hasCity && hasService) {
    return {
      value: true,
      confidence: "high",
      evidence: snippet(p.title, 100),
      note: "Title mentions both city and service.",
    };
  }
  if (hasCity || hasService) {
    return {
      value: false,
      confidence: "medium",
      evidence: snippet(p.title, 100),
      note: hasCity
        ? "Title mentions city but not the service."
        : "Title mentions service but not the city.",
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

function detectLowBookingFriction(
  bookingTools: string[],
): AutoAuditFieldResult {
  if (bookingTools.length > 0) {
    return {
      value: true,
      confidence: "high",
      evidence: bookingTools.join(", "),
      note: "Online booking tool detected.",
    };
  }
  return {
    value: false,
    confidence: "medium",
    note: "No online booking tool detected.",
  };
}

function detectAboveFoldCTA(p: ParsedHtml): AutoAuditFieldResult {
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
    note: "No CTA phrase in the first ~3 KB of HTML — confirm visually.",
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

function detectLeadCapture(
  p: ParsedHtml,
  fields: Partial<Record<AuditChecklistKey, AutoAuditFieldResult>>,
): AutoAuditFieldResult {
  const hasContactForm = fields.hasContactForm?.value === true;
  const captureKeyword = /(newsletter|nieuwsbrief|free quote|gratis offerte|estimate|aanvraag|free audit|gratis audit|download|ebook|whitepaper|gratis advies|inschrijven)/i.test(
    p.bodyLower,
  );
  if (hasContactForm || captureKeyword) {
    return {
      value: true,
      confidence: "medium",
      evidence: captureKeyword ? "capture keyword in body" : "contact form present",
      note: "Soft lead capture available.",
    };
  }
  return { value: false, confidence: "medium", note: "No soft lead capture detected." };
}

function detectQuoteAutomation(p: ParsedHtml): AutoAuditFieldResult {
  const lower = p.lower;
  const quoteKeyword = /(quote|offerte|estimate|aanvraag|prijsopgave|aanvragen)/i.test(lower);
  const hasForm = p.forms.length > 0;
  if (quoteKeyword && hasForm) {
    return {
      value: true,
      confidence: "medium",
      note: "Quote / estimate keyword + form on page.",
    };
  }
  if (quoteKeyword) {
    return {
      value: false,
      confidence: "low",
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

  const fields: Partial<Record<AuditChecklistKey, AutoAuditFieldResult>> = {};

  // Order matters where one detector references another's output.
  const earlyDetectors: Array<[AuditChecklistKey, Detector]> = [
    ["isMobileFriendly", (p) => detectMobileFriendly(p)],
    ["loadsFast", (p, c, ms) => detectLoadsFast(p, c, ms)],
    ["hasClearCTA", (p) => detectClearCTA(p)],
    ["hasContactForm", (p) => detectContactForm(p)],
    ["hasPhoneVisible", (p) => detectPhoneVisible(p)],
    ["hasGoogleMapsLink", (p) => detectGoogleMapsLink(p)],
    ["hasTrustSignals", (p) => detectTrustSignals(p)],
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
    ["hasQuoteAutomation", (p) => detectQuoteAutomation(p)],
  ];

  for (const [key, fn] of earlyDetectors) {
    const r = fn(parsed, input, fetchOutcome.fetchMs);
    if (r) fields[key] = r;
  }

  // Detectors that depend on previously-set fields:
  fields.lowContactFriction = detectLowContactFriction(parsed, fields);
  fields.lowBookingFriction = detectLowBookingFriction(detectedTools.booking);
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
