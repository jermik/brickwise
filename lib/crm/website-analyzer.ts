import type { AuditChecklist } from "./types";

// Lightweight, HTTP-only website analysis for newly discovered leads.
// Fetches the homepage once, runs regex-only checks against the HTML, and
// returns a partial AuditChecklist that the operator can refine later.
//
// Intentionally NOT a real audit — there's no JS execution, no headless
// browser, no Lighthouse. This just fills in the easy-to-detect items so
// the dashboard shows useful scores immediately after import.

const FETCH_TIMEOUT_MS = 7000;
const USER_AGENT = "GrowthOS-CRM/1.0 (+https://crm.brickwise.pro)";
const MAX_BODY_BYTES = 100_000; // cap memory + parse cost

export interface WebsiteCheck {
  reachable: boolean;
  https: boolean;
  hasTitle: boolean;
  hasMetaDescription: boolean;
  hasViewport: boolean;
  hasH1: boolean;
  hasCanonical: boolean;
  titleHasCity: boolean;
  bodyMentionsCity: boolean;
  hasContactLink: boolean;
  hasBookingHint: boolean;
}

function emptyCheck(url: string): WebsiteCheck {
  return {
    reachable: false,
    https: url.startsWith("https://"),
    hasTitle: false,
    hasMetaDescription: false,
    hasViewport: false,
    hasH1: false,
    hasCanonical: false,
    titleHasCity: false,
    bodyMentionsCity: false,
    hasContactLink: false,
    hasBookingHint: false,
  };
}

export async function quickCheckWebsite(
  url: string | undefined,
  city: string,
): Promise<WebsiteCheck | null> {
  if (!url) return null;
  const result = emptyCheck(url);

  let html = "";
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    const r = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,*/*",
      },
      redirect: "follow",
      signal: ctrl.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!r.ok) return result;
    result.reachable = true;

    // Read up to MAX_BODY_BYTES of the body
    const reader = r.body?.getReader();
    if (!reader) {
      html = await r.text();
    } else {
      const dec = new TextDecoder();
      let total = 0;
      const chunks: string[] = [];
      while (total < MAX_BODY_BYTES) {
        const { value, done } = await reader.read();
        if (done) break;
        total += value.length;
        chunks.push(dec.decode(value, { stream: true }));
      }
      html = chunks.join("");
      try { await reader.cancel(); } catch { /* ignore */ }
    }
  } catch {
    return result;
  }

  if (!html) return result;
  const lower = html.toLowerCase();
  const cityLower = city.toLowerCase();

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    result.hasTitle = true;
    const titleText = titleMatch[1].toLowerCase();
    result.titleHasCity = cityLower.length > 1 && titleText.includes(cityLower);
  }
  result.hasMetaDescription =
    /<meta[^>]+name=["']description["'][^>]*>/i.test(html);
  result.hasViewport = /<meta[^>]+name=["']viewport["'][^>]*>/i.test(html);
  result.hasH1 = /<h1[^>]*>/i.test(html);
  result.hasCanonical = /<link[^>]+rel=["']canonical["'][^>]*>/i.test(html);
  result.hasContactLink = /href=["'][^"']*(contact|kontakt|contacto)/i.test(html);
  result.hasBookingHint =
    /book(ing)?|reserve|appointment|schedule|calendly|setmore|bookin/i.test(lower);
  result.bodyMentionsCity =
    cityLower.length > 1 && lower.includes(cityLower);

  return result;
}

// Translate the HTTP-derived check into the subset of AuditChecklist items
// we can confidently determine. Items requiring human judgement (modern
// design, trust signals, conversion friction, etc.) are NOT auto-set.
export function checkToPartialChecklist(
  check: WebsiteCheck,
): Partial<AuditChecklist> {
  return {
    isMobileFriendly: check.hasViewport,
    hasMetaDescription: check.hasMetaDescription,
    hasLocalSEOTitle: check.titleHasCity,
    hasH1: check.hasH1,
    hasCityLandingPage: check.bodyMentionsCity,
    hasContactForm: check.hasContactLink,
    hasBookingAutomation: check.hasBookingHint,
  };
}
