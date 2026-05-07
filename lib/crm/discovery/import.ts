// Import a single discovered business into the leads table.
//
// Responsibilities:
//   1. Dedupe (normalised domain OR same business-name + city)
//   2. Optional best-effort website enrichment (socials / email / cms hint)
//   3. Persist with discovery metadata (source, query, niche, city)
//
// Returns a structured result so the UI can show a clear "Imported", "Skipped
// (duplicate)", or "Error" state.

import { eq, ilike, and } from "drizzle-orm";
import { db } from "../db/client";
import { leads as leadsTable } from "../db/schema";
import type { LeadCreateInput } from "../types";
import { createLead } from "../store";
import { enrichFromWebsite } from "./enrich";
import { domainOf } from "./places";
import type { DiscoveredBusinessV2 } from "./places";

export interface ImportDiscoveredOptions {
  /** Niche the user typed in the search form. */
  niche: string;
  /** City the user typed in the search form. */
  city: string;
  /** The full text query (e.g. "dentists in rotterdam"). */
  query: string;
  /** Run a best-effort homepage fetch to populate socials / email / cms. */
  enrich?: boolean;
}

export type ImportResultKind = "created" | "duplicate" | "error";

export interface ImportDiscoveredResult {
  kind: ImportResultKind;
  /** Lead ID when kind === "created" or kind === "duplicate". */
  leadId?: string;
  /** Reason when kind === "duplicate" or "error". */
  message?: string;
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ")
    .trim();
}

function deriveCity(business: DiscoveredBusinessV2, fallback: string): string {
  // Pull the last 2 segments of formattedAddress as a sensible default.
  const fa = business.formattedAddress;
  if (fa) {
    const parts = fa.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) return parts[parts.length - 2];
    if (parts.length === 1) return parts[0];
  }
  return fallback;
}

async function findExistingLead(
  domain: string | null,
  businessName: string,
  city: string,
): Promise<string | null> {
  // Try domain match first (strongest signal).
  if (domain) {
    const rows = await db.query.leads.findMany({
      columns: { id: true, website: true },
    });
    for (const r of rows) {
      const d = domainOf(r.website ?? undefined);
      if (d && d === domain) return r.id;
    }
  }
  // Fallback: same name + same city (case-insensitive).
  const rows = await db
    .select({ id: leadsTable.id })
    .from(leadsTable)
    .where(
      and(
        ilike(leadsTable.businessName, businessName),
        ilike(leadsTable.city, city),
      ),
    )
    .limit(1);
  return rows[0]?.id ?? null;
}

export async function importDiscoveredBusiness(
  business: DiscoveredBusinessV2,
  options: ImportDiscoveredOptions,
): Promise<ImportDiscoveredResult> {
  const niche = options.niche.trim();
  const fallbackCity = options.city.trim();
  const businessName = business.businessName.trim();
  if (!businessName) {
    return { kind: "error", message: "Business name is missing." };
  }

  const city = deriveCity(business, fallbackCity);
  const domain = domainOf(business.websiteUri);

  console.log("[discovery.import] start", {
    externalId: business.externalId,
    businessName,
    domain,
    enrich: !!options.enrich,
  });

  // Dedupe
  const existingId = await findExistingLead(domain, businessName, city);
  if (existingId) {
    console.log("[discovery.import] duplicate", { existingId, businessName });
    return {
      kind: "duplicate",
      leadId: existingId,
      message: "This lead already exists.",
    };
  }

  // Optional enrichment
  let enrichEmail: string | undefined;
  let enrichSocials: string[] | undefined;
  let cmsHint: string | undefined;
  if (options.enrich && business.websiteUri) {
    try {
      const e = await enrichFromWebsite(business.websiteUri);
      enrichEmail = e.email;
      enrichSocials = e.socials.length > 0 ? e.socials : undefined;
      cmsHint = e.cmsHint;
    } catch (err) {
      console.error("[discovery.import] enrich.failed", {
        error: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  // Build notes line summarising any signal we could not store structurally.
  const noteParts: string[] = [];
  if (business.formattedAddress) noteParts.push(`Address: ${business.formattedAddress}`);
  if (business.shortDescription) noteParts.push(business.shortDescription);
  if (cmsHint) noteParts.push(`Platform hint: ${cmsHint}`);
  const notes = noteParts.length > 0 ? noteParts.join("\n") : undefined;

  const websiteNormalised = business.websiteUri
    ? business.websiteUri.startsWith("http")
      ? business.websiteUri
      : `https://${business.websiteUri}`
    : undefined;

  const input: LeadCreateInput = {
    businessName,
    category: niche ? titleCase(niche) : "Other",
    city,
    province: "",
    website: websiteNormalised,
    email: enrichEmail,
    phone: business.phone,
    googleMapsUrl: business.googleMapsUri,
    googleRating: business.rating,
    socials: enrichSocials,
    notes,
    status: "new",
    consentStatus: "none",
    doNotContact: false,
    unsubscribed: false,
    source: "google_places",
    discoveryQuery: options.query,
    discoveryCity: fallbackCity,
    discoveryNiche: niche,
  };

  try {
    const created = await createLead(input);
    console.log("[discovery.import] created", { leadId: created.id, businessName });
    return { kind: "created", leadId: created.id };
  } catch (err) {
    console.error("[discovery.import] create.failed", {
      error: err instanceof Error ? err.message : "unknown",
    });
    return {
      kind: "error",
      message: err instanceof Error ? err.message : "Could not save the lead.",
    };
  }
}
