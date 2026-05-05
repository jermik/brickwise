import { track } from "@vercel/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Dual-fire: Vercel Analytics (always active) + gtag (active when GA is configured)
function fire(event: string, params: Record<string, unknown> = {}) {
  // Vercel Analytics
  try { track(event, params as Record<string, string | number>); } catch { /* silent */ }
  // Google Analytics / gtag
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try { window.gtag("event", event, params); } catch { /* silent */ }
  }
}

// ─── Page / Navigation ───────────────────────────────────────────────

export function trackPageView(url: string) {
  fire("page_view", { page_path: url });
}

// ─── Property Events ─────────────────────────────────────────────────

export function trackPropertyViewed(propertyId: string, platform: string, city: string) {
  fire("property_viewed", { property_id: propertyId, platform, city });
}

export function trackWatchlistAdded(propertyId: string, platform: string) {
  fire("watchlist_added", { property_id: propertyId, platform });
}

export function trackWatchlistRemoved(propertyId: string) {
  fire("watchlist_removed", { property_id: propertyId });
}

export function trackPortfolioUpdated(action: "added" | "removed" | "updated", propertyId: string) {
  fire("portfolio_updated", { action, property_id: propertyId });
}

// ─── Analyzer ────────────────────────────────────────────────────────

export function trackAnalyzerUsed(filters: Record<string, unknown>) {
  fire("analyzer_used", { filters: JSON.stringify(filters) });
}

export function trackAnalyzerFiltered(filterType: string, value: string) {
  fire("analyzer_filtered", { filter_type: filterType, value });
}

// ─── Content / SEO Pages ─────────────────────────────────────────────

export function trackComparisonViewed(slug: string) {
  fire("comparison_viewed", { slug });
}

export function trackCityPageViewed(city: string) {
  fire("city_page_viewed", { city });
}

export function trackRankingPageViewed(category: string) {
  fire("ranking_page_viewed", { category });
}

export function trackLearnPageViewed(slug: string) {
  fire("learn_page_viewed", { slug });
}

// ─── CTA / Conversion ────────────────────────────────────────────────

export function trackCtaClick(label: string, destination: string) {
  fire("cta_click", { label, destination });
}

export function trackEmailCapture(source: string) {
  fire("email_captured", { event_category: "lead", event_label: source });
}

export function trackSignupStarted(method: "email" | "google" | "github") {
  fire("signup_started", { method });
}

export function trackSignupCompleted(method: "email" | "google" | "github") {
  fire("signup_completed", { event_category: "conversion", method });
}

// ─── Errors ──────────────────────────────────────────────────────────

export function trackError(errorType: string, message: string, page?: string) {
  fire("frontend_error", {
    error_type: errorType,
    error_message: message.slice(0, 150),
    page: page ?? (typeof window !== "undefined" ? window.location.pathname : "unknown"),
  });
}

export function track404(url: string, referrer?: string) {
  fire("page_404", { url, referrer: referrer ?? "" });
}
