import type { BusinessCategory } from "./types";
import { CATEGORY_OSM_TAGS } from "./discovery-categories";

// ─────────────────────────────────────────────────────────────────────────────
// GrowthOS lead discovery
// Uses OpenStreetMap (Nominatim for geocoding + Overpass for tag-based search).
// No API keys required. Compliant with both services' Acceptable Use Policies
// when used for moderate, attributed, on-demand queries.
//
// Sources:
//   https://operations.osmfoundation.org/policies/nominatim/
//   https://operations.osmfoundation.org/policies/overpass/
// ─────────────────────────────────────────────────────────────────────────────

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const OVERPASS = "https://overpass-api.de/api/interpreter";
const USER_AGENT =
  process.env.NOMINATIM_USER_AGENT ??
  "GrowthOS-CRM/1.0 (+https://crm.brickwise.pro)";
const OVERPASS_TIMEOUT_S = 25;
const MAX_RESULTS = 60;

export interface DiscoveredBusiness {
  externalId: string;
  businessName: string;
  category: BusinessCategory;
  city: string;
  province: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  googleMapsUrl?: string;
  lat?: number;
  lon?: number;
  alreadyImported?: boolean;
}

interface NominatimHit {
  boundingbox: [string, string, string, string]; // [south, north, west, east]
  display_name: string;
}

async function geocodeCity(
  city: string,
  country: string,
): Promise<{ bbox: [number, number, number, number]; display: string } | null> {
  const q = `${city}, ${country}`;
  const url = `${NOMINATIM}?q=${encodeURIComponent(q)}&format=json&limit=1`;
  const r = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    cache: "no-store",
  });
  if (!r.ok) return null;
  const data = (await r.json()) as NominatimHit[];
  if (data.length === 0) return null;
  const [south, north, west, east] = data[0].boundingbox.map(Number);
  return { bbox: [south, west, north, east], display: data[0].display_name };
}

interface OverpassElement {
  type: string;
  id: number;
  tags?: Record<string, string>;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
}

function buildOverpassQuery(
  tags: string[],
  bbox: [number, number, number, number],
): string {
  const [south, west, north, east] = bbox;
  const bboxStr = `${south},${west},${north},${east}`;
  const filters = tags
    .map((tag) => {
      const [k, v] = tag.split("=");
      const sel = `["${k}"="${v}"]`;
      return `node${sel}(${bboxStr});way${sel}(${bboxStr});`;
    })
    .join("");
  return `[out:json][timeout:${OVERPASS_TIMEOUT_S}];(${filters});out tags center ${MAX_RESULTS};`;
}

function normaliseUrl(u: string | undefined): string | undefined {
  if (!u) return undefined;
  const trimmed = u.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function parseElement(
  el: OverpassElement,
  category: BusinessCategory,
  city: string,
): DiscoveredBusiness | null {
  const tags = el.tags ?? {};
  const name = (tags["name"] || tags["operator"] || "").trim();
  if (!name) return null;

  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;

  const addressParts = [
    [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" "),
    tags["addr:postcode"],
    tags["addr:city"],
  ].filter(Boolean);
  const address = addressParts.join(", ") || undefined;

  const googleMapsUrl =
    typeof lat === "number" && typeof lon === "number"
      ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
      : undefined;

  return {
    externalId: `${el.type}/${el.id}`,
    businessName: name,
    category,
    city: tags["addr:city"] || city,
    province: tags["addr:state"] || tags["addr:province"] || "",
    website: normaliseUrl(tags["website"] || tags["contact:website"]),
    phone: tags["phone"] || tags["contact:phone"] || undefined,
    email: tags["email"] || tags["contact:email"] || undefined,
    address,
    googleMapsUrl,
    lat,
    lon,
  };
}

export async function searchBusinesses(
  city: string,
  country: string,
  category: BusinessCategory,
): Promise<{ results: DiscoveredBusiness[]; geocoded: string | null }> {
  const tags = CATEGORY_OSM_TAGS[category];
  if (!tags || tags.length === 0) {
    return { results: [], geocoded: null };
  }

  const geo = await geocodeCity(city, country);
  if (!geo) return { results: [], geocoded: null };

  const query = buildOverpassQuery(tags, geo.bbox);

  const r = await fetch(OVERPASS, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
    },
    body: `data=${encodeURIComponent(query)}`,
    cache: "no-store",
  });
  if (!r.ok) {
    return { results: [], geocoded: geo.display };
  }
  const data = (await r.json()) as { elements?: OverpassElement[] };
  const elements = data.elements ?? [];

  const seen = new Set<string>();
  const results: DiscoveredBusiness[] = [];
  for (const el of elements) {
    const parsed = parseElement(el, category, city);
    if (!parsed) continue;
    const key = `${parsed.businessName.toLowerCase()}|${parsed.city.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(parsed);
  }

  return { results, geocoded: geo.display };
}

export function dedupeKey(b: { businessName: string; city: string; website?: string }): {
  websiteKey: string | null;
  nameKey: string;
} {
  const websiteKey = b.website
    ? b.website.toLowerCase().replace(/\/+$/, "").replace(/^https?:\/\//, "")
    : null;
  const nameKey = `${b.businessName.toLowerCase()}|${b.city.toLowerCase()}`;
  return { websiteKey, nameKey };
}
