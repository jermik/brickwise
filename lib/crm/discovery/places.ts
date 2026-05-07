// Google Places API (New) text-search wrapper. Lightweight, deterministic
// per query, no caching, no scraping, no agent loops. Single POST per page,
// up to 3 pages for the 50-result option.
//
// Field mask is intentionally narrow to keep responses small and bills low.
// Docs: https://developers.google.com/maps/documentation/places/web-service/text-search

const PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.websiteUri",
  "places.internationalPhoneNumber",
  "places.nationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.primaryType",
  "places.types",
  "places.googleMapsUri",
  "places.location",
  "places.editorialSummary",
  "nextPageToken",
].join(",");

const MAX_PAGES = 3;
const MAX_PER_PAGE = 20; // Hard limit of the New Places API per page.

export interface DiscoveryQuery {
  niche: string;
  city: string;
  /** Optional country (free text or curated). Appended to the text query. */
  country?: string;
  /** ISO 3166-1 alpha-2 region code (e.g. "NL", "GR") for Places bias. */
  regionCode?: string;
  /** Soft cap on returned results. Mapped to 1, 2, or 3 page fetches. */
  limit?: number;
}

export interface DiscoveredBusinessV2 {
  /** Stable Google Places ID. */
  externalId: string;
  source: "google_places";
  businessName: string;
  /** Primary type (e.g. "dentist") if available. */
  primaryType?: string;
  /** Full type list as Google reports it. */
  types: string[];
  formattedAddress?: string;
  /** Free-text, returned by Google for some places. */
  shortDescription?: string;
  websiteUri?: string;
  phone?: string;
  rating?: number;
  ratingCount?: number;
  googleMapsUri?: string;
  lat?: number;
  lon?: number;
  /** Set by the action layer when the lead already exists in the CRM. */
  alreadyImported?: boolean;
}

export interface DiscoveryResultV2 {
  ok: boolean;
  query: string;
  results: DiscoveredBusinessV2[];
  error?: string;
}

interface PlacesResponse {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    websiteUri?: string;
    internationalPhoneNumber?: string;
    nationalPhoneNumber?: string;
    rating?: number;
    userRatingCount?: number;
    primaryType?: string;
    types?: string[];
    googleMapsUri?: string;
    location?: { latitude?: number; longitude?: number };
    editorialSummary?: { text?: string };
  }>;
  nextPageToken?: string;
  error?: { message?: string; status?: string };
}

function buildTextQuery(niche: string, city: string, country?: string): string {
  const n = niche.trim();
  const c = city.trim();
  const k = (country ?? "").trim();
  if (n && c) {
    return k ? `${n} in ${c}, ${k}` : `${n} in ${c}`;
  }
  return n || c || k;
}

function pageSizeForLimit(limit: number, pageIndex: number): number {
  // Distribute across up to 3 pages of MAX_PER_PAGE.
  const remaining = limit - pageIndex * MAX_PER_PAGE;
  if (remaining <= 0) return 0;
  return Math.min(MAX_PER_PAGE, remaining);
}

export async function findBusinesses(
  q: DiscoveryQuery,
): Promise<DiscoveryResultV2> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const textQuery = buildTextQuery(q.niche, q.city, q.country);
  if (!textQuery) {
    return { ok: false, query: textQuery, results: [], error: "Niche or city is required." };
  }
  if (!apiKey) {
    return {
      ok: false,
      query: textQuery,
      results: [],
      error: "GOOGLE_PLACES_API_KEY is not set on the server.",
    };
  }

  const limit = Math.max(1, Math.min(50, q.limit ?? 20));
  const pages = Math.min(MAX_PAGES, Math.ceil(limit / MAX_PER_PAGE));

  console.log("[discovery.places] start", { query: textQuery, limit, pages });

  const collected: DiscoveredBusinessV2[] = [];
  let pageToken: string | undefined;

  try {
    for (let i = 0; i < pages; i++) {
      const pageSize = pageSizeForLimit(limit, i);
      if (pageSize <= 0) break;

      const body: Record<string, unknown> = { textQuery, pageSize };
      if (q.regionCode) body.regionCode = q.regionCode.toLowerCase();
      if (pageToken) body.pageToken = pageToken;

      const res = await fetch(PLACES_TEXT_SEARCH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("[discovery.places] http.error", { status: res.status, body: text.slice(0, 400) });
        let friendly = `Places API returned ${res.status}.`;
        if (res.status === 401 || res.status === 403) {
          friendly =
            "Google rejected the request. Confirm GOOGLE_PLACES_API_KEY is set, the key has access to Places API (New), and the project has billing enabled.";
        } else if (res.status === 429) {
          friendly =
            "Google Places quota reached for now. Wait a minute and try again, or check your Cloud project quota.";
        } else if (res.status >= 500) {
          friendly = "Google Places is temporarily unavailable. Try again shortly.";
        }
        return {
          ok: collected.length > 0,
          query: textQuery,
          results: collected,
          error: friendly,
        };
      }

      const data = (await res.json()) as PlacesResponse;
      if (data.error?.message) {
        console.error("[discovery.places] api.error", { message: data.error.message });
        return {
          ok: collected.length > 0,
          query: textQuery,
          results: collected,
          error: data.error.message,
        };
      }

      for (const p of data.places ?? []) {
        if (!p.id) continue;
        collected.push({
          externalId: p.id,
          source: "google_places",
          businessName: p.displayName?.text ?? "(unnamed)",
          primaryType: p.primaryType,
          types: p.types ?? [],
          formattedAddress: p.formattedAddress,
          shortDescription: p.editorialSummary?.text,
          websiteUri: p.websiteUri,
          phone: p.internationalPhoneNumber ?? p.nationalPhoneNumber,
          rating: p.rating,
          ratingCount: p.userRatingCount,
          googleMapsUri: p.googleMapsUri,
          lat: p.location?.latitude,
          lon: p.location?.longitude,
        });
      }

      pageToken = data.nextPageToken;
      if (!pageToken) break;
    }
  } catch (e) {
    console.error("[discovery.places] fetch.failed", {
      error: e instanceof Error ? e.message : "unknown",
    });
    return {
      ok: collected.length > 0,
      query: textQuery,
      results: collected,
      error: e instanceof Error ? e.message : "Search failed.",
    };
  }

  console.log("[discovery.places] done", { query: textQuery, count: collected.length });
  return { ok: true, query: textQuery, results: collected };
}

/**
 * Normalise a website URL to its hostname (lowercase, no www, no trailing
 * slash). Used for dedupe.
 */
export function domainOf(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    return u.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}
