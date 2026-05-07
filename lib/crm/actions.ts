"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "./db/client";
import { leads as leadsTable, followUps as followUpsTable } from "./db/schema";
import {
  readLeads,
  findLead,
  createLead as createLeadStore,
  updateLead,
  deleteLead,
  bulkInsertLeads,
  logContact,
  completeFollowUp,
  addFollowUp,
  getTodayContactCount,
} from "./store";
import {
  computeAllScores,
  generateAuditSummary,
  computeTopProblems,
  computeTopImprovements,
  suggestOffer,
} from "./scoring";
import { generateProposal } from "./proposal";
import { parseCSV } from "./csv";
import { searchBusinesses, dedupeKey, type DiscoveredBusiness } from "./discovery";
import { findBusinesses, type DiscoveredBusinessV2, type DiscoveryResultV2 } from "./discovery/places";
import {
  importDiscoveredBusiness,
  type ImportDiscoveredResult,
} from "./discovery/import";
import { quickCheckWebsite, checkToPartialChecklist } from "./website-analyzer";
import { generateContent } from "./content/generator";
import { computeRichAudit } from "./audit";
import { computeLeadScore } from "./lead-scoring";
import {
  createContentIdea,
  updateContentStatus,
  deleteContentIdea as deleteContentIdeaStore,
  findContentIdea,
  readContentIdeas,
} from "./store";
import type {
  ContentPlatform,
  ContentStatus,
  ContentAngle,
  GenerateContentInput,
} from "./content/types";
import type {
  LeadCreateInput,
  LeadStatus,
  AuditChecklist,
  ContactType,
  BusinessCategory,
} from "./types";
import { EMPTY_AUDIT_CHECKLIST, MAX_DAILY_OUTREACH, MAX_PENDING_FOLLOW_UPS } from "./types";

// ── Lead CRUD ──────────────────────────────────────────────────────────────

export async function createLead(data: LeadCreateInput): Promise<{ id: string }> {
  const lead = await createLeadStore(data);
  revalidatePath("/crm");
  return { id: lead.id };
}

export async function updateLeadAction(
  id: string,
  patch: Partial<LeadCreateInput>,
): Promise<void> {
  await updateLead(id, patch);
  revalidatePath("/crm");
  revalidatePath(`/crm/leads/${id}`);
}

export async function deleteLeadAction(id: string): Promise<void> {
  await deleteLead(id);
  revalidatePath("/crm");
  redirect("/crm/leads");
}

export async function updateStatusAction(id: string, status: LeadStatus): Promise<void> {
  await updateLead(id, { status });
  // When a lead replies, clear pending follow-ups so we stop chasing them
  if (status === "replied" || status === "meeting_booked" || status === "won") {
    await db
      .update(followUpsTable)
      .set({ completed: true })
      .where(and(eq(followUpsTable.leadId, id), eq(followUpsTable.completed, false)));
    await db
      .update(leadsTable)
      .set({ nextFollowUpAt: null, updatedAt: new Date() })
      .where(eq(leadsTable.id, id));
  }
  revalidatePath("/crm");
  revalidatePath(`/crm/leads/${id}`);
}

export async function toggleDoNotContact(id: string, value: boolean): Promise<void> {
  const patch: Partial<LeadCreateInput> = { doNotContact: value };
  if (value) patch.status = "do_not_contact";
  await updateLead(id, patch);
  if (value) {
    // Cancel pending follow-ups on DNC
    await db
      .update(followUpsTable)
      .set({ completed: true })
      .where(and(eq(followUpsTable.leadId, id), eq(followUpsTable.completed, false)));
    await db
      .update(leadsTable)
      .set({ nextFollowUpAt: null, updatedAt: new Date() })
      .where(eq(leadsTable.id, id));
  }
  revalidatePath("/crm");
  revalidatePath(`/crm/leads/${id}`);
}

// ── Audit ──────────────────────────────────────────────────────────────────

export async function saveAuditAction(
  id: string,
  checklist: AuditChecklist,
): Promise<void> {
  const lead = await findLead(id);
  if (!lead) return;
  const scores = computeAllScores(checklist);
  const summary = generateAuditSummary(checklist, lead.businessName, lead.category);
  const topProblems = computeTopProblems(checklist);
  const topImprovements = computeTopImprovements(checklist);
  const suggestedOffer = suggestOffer(checklist);

  // Auto-promote status if still in early stages
  const nextStatus: LeadStatus | undefined =
    lead.status === "new" || lead.status === "researched" ? "audit_ready" : undefined;

  // Step 4 — rich multi-dimension audit data
  const richAudit = computeRichAudit(checklist);
  // Step 5 — deterministic lead-quality score (depends on the rich audit)
  const updatedLead = { ...lead, auditChecklist: checklist, richAudit };
  const leadScoreData = computeLeadScore(updatedLead, richAudit);

  await updateLead(id, {
    ...scores,
    auditSummary: summary,
    auditChecklist: checklist,
    topProblems,
    topImprovements,
    richAudit,
    leadScore: leadScoreData.score,
    leadScoreData,
    proposalOffer: lead.proposalOffer ?? suggestedOffer, // pre-fill if not manually set
    ...(nextStatus ? { status: nextStatus } : {}),
  });
  revalidatePath("/crm");
  revalidatePath(`/crm/leads/${id}`);
}

// ── Proposal ───────────────────────────────────────────────────────────────

export async function generateProposalAction(id: string): Promise<void> {
  const lead = await findLead(id);
  if (!lead) return;
  const proposal = generateProposal(lead);

  // Respect manual offer override if user set one
  const finalOffer = lead.proposalOffer ?? proposal.suggestedOffer;

  await updateLead(id, {
    proposalEmail: proposal.emailDraft,
    proposalFollowUpEmail: proposal.followUpEmailDraft,
    proposalLinkedIn: proposal.linkedInDraft,
    proposalCallScript: proposal.callScript,
    proposalBullets: proposal.bulletPoints,
    proposalOffer: finalOffer,
    estimatedValue: proposal.estimatedValue,
    topProblems: proposal.topProblems.length > 0 ? proposal.topProblems : lead.topProblems,
    topImprovements:
      proposal.topImprovements.length > 0 ? proposal.topImprovements : lead.topImprovements,
  });
  revalidatePath(`/crm/leads/${id}/proposal`);
  revalidatePath(`/crm/leads/${id}`);
}

export async function setManualOfferAction(id: string, offerId: string): Promise<void> {
  await updateLead(id, { proposalOffer: offerId || undefined });
  revalidatePath(`/crm/leads/${id}`);
  revalidatePath(`/crm/leads/${id}/proposal`);
}

// ── Contact log ────────────────────────────────────────────────────────────

export async function logContactAction(
  leadId: string,
  type: ContactType,
  message?: string,
): Promise<void> {
  const lead = await findLead(leadId);
  if (!lead) throw new Error("Lead not found.");

  if (lead.doNotContact || lead.unsubscribed) {
    throw new Error("This lead is marked do-not-contact. Action blocked.");
  }

  // Compliance: enforce daily limit
  const todayCount = await getTodayContactCount();
  if (todayCount >= MAX_DAILY_OUTREACH) {
    throw new Error(
      `Daily outreach limit of ${MAX_DAILY_OUTREACH} reached. Come back tomorrow.`,
    );
  }

  // Compliance: enforce max pending follow-ups (= max chase attempts)
  const pending = lead.followUps.filter((f) => !f.completed).length;
  const skipFollowUp = pending >= MAX_PENDING_FOLLOW_UPS;

  const { contact, followUp } = await logContact(leadId, type, message, skipFollowUp);

  // Auto-progress status
  let newStatus: LeadStatus = lead.status;
  if (lead.status === "new" || lead.status === "researched" || lead.status === "audit_ready") {
    newStatus = "contacted";
  }

  await db
    .update(leadsTable)
    .set({
      lastContactedAt: new Date(contact.sentAt),
      nextFollowUpAt: followUp ? new Date(followUp.dueAt) : lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt) : null,
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(leadsTable.id, leadId));

  revalidatePath("/crm");
  revalidatePath(`/crm/leads/${leadId}`);
}

// ── Follow-ups ─────────────────────────────────────────────────────────────

export async function completeFollowUpAction(
  leadId: string,
  followUpId: string,
): Promise<void> {
  await completeFollowUp(leadId, followUpId);
  revalidatePath("/crm");
  revalidatePath("/crm/follow-ups");
  revalidatePath(`/crm/leads/${leadId}`);
}

export async function scheduleFollowUpAction(
  leadId: string,
  dueAt: string,
  notes?: string,
): Promise<void> {
  await addFollowUp(leadId, dueAt, notes);
  revalidatePath("/crm");
  revalidatePath("/crm/follow-ups");
  revalidatePath(`/crm/leads/${leadId}`);
}

// ── CSV import ─────────────────────────────────────────────────────────────

export async function importCSVAction(
  csvContent: string,
): Promise<{ imported: number; errors: string[] }> {
  const { leads, errors } = parseCSV(csvContent);
  if (leads.length === 0) return { imported: 0, errors };
  const imported = await bulkInsertLeads(leads);
  revalidatePath("/crm");
  return { imported, errors };
}

// ── Unsubscribe ────────────────────────────────────────────────────────────

export async function unsubscribeLeadAction(id: string): Promise<void> {
  await updateLead(id, { unsubscribed: true, consentStatus: "unsubscribed" });
  revalidatePath("/crm");
  revalidatePath(`/crm/leads/${id}`);
}

// ── Lead discovery (Nominatim + Overpass) ─────────────────────────────────

// Simple sliding-window rate limit, in-memory. For a single-tenant CRM this
// is plenty. Resets on cold start (which is fine — discovery is human-paced).
const RATE_BUCKETS: Map<string, number[]> = new Map();
const DISCOVERY_RATE_LIMIT = 10;
const DISCOVERY_WINDOW_MS = 60_000;

function rateOk(key: string): boolean {
  const now = Date.now();
  const arr = (RATE_BUCKETS.get(key) ?? []).filter(
    (t) => now - t < DISCOVERY_WINDOW_MS,
  );
  if (arr.length >= DISCOVERY_RATE_LIMIT) return false;
  arr.push(now);
  RATE_BUCKETS.set(key, arr);
  return true;
}

export interface DiscoveryResult {
  businesses: DiscoveredBusiness[];
  geocoded: string | null;
  error?: string;
}

export async function discoverLeadsAction(
  country: string,
  city: string,
  category: BusinessCategory,
): Promise<DiscoveryResult> {
  if (!country || !city || !category) {
    return { businesses: [], geocoded: null, error: "Country, city, and category are required." };
  }
  const rateKey = `discover:${country}:${city.toLowerCase()}`;
  if (!rateOk(rateKey)) {
    return {
      businesses: [],
      geocoded: null,
      error: `Rate limit reached (${DISCOVERY_RATE_LIMIT}/min). Wait a minute before searching ${city} again.`,
    };
  }

  try {
    const { results, geocoded } = await searchBusinesses(city, country, category);

    // Mark already-imported businesses so the UI can flag them.
    const existing = await readLeads();
    const websiteSet = new Set<string>();
    const nameSet = new Set<string>();
    for (const l of existing) {
      const k = dedupeKey({ businessName: l.businessName, city: l.city, website: l.website });
      if (k.websiteKey) websiteSet.add(k.websiteKey);
      nameSet.add(k.nameKey);
    }
    const enriched = results.map((b) => {
      const k = dedupeKey(b);
      const already = (k.websiteKey && websiteSet.has(k.websiteKey)) || nameSet.has(k.nameKey);
      return { ...b, alreadyImported: already };
    });

    return { businesses: enriched, geocoded };
  } catch (e) {
    return {
      businesses: [],
      geocoded: null,
      error: e instanceof Error ? e.message : "Discovery failed.",
    };
  }
}

export interface ImportResult {
  imported: number;
  skipped: number;
  analyzed: number;
  errors: string[];
}

export async function importDiscoveredAction(
  businesses: DiscoveredBusiness[],
  options: { autoAnalyze?: boolean } = {},
): Promise<ImportResult> {
  const errors: string[] = [];
  if (businesses.length === 0) {
    return { imported: 0, skipped: 0, analyzed: 0, errors: ["Select at least one business."] };
  }

  // Build dedupe sets from existing leads + within this batch.
  const existing = await readLeads();
  const websiteSet = new Set<string>();
  const nameSet = new Set<string>();
  for (const l of existing) {
    const k = dedupeKey({ businessName: l.businessName, city: l.city, website: l.website });
    if (k.websiteKey) websiteSet.add(k.websiteKey);
    nameSet.add(k.nameKey);
  }

  const toInsert: { input: LeadCreateInput; sourceWebsite?: string; sourceCity: string }[] = [];
  let skipped = 0;

  for (const b of businesses) {
    const k = dedupeKey(b);
    if ((k.websiteKey && websiteSet.has(k.websiteKey)) || nameSet.has(k.nameKey)) {
      skipped++;
      continue;
    }
    if (k.websiteKey) websiteSet.add(k.websiteKey);
    nameSet.add(k.nameKey);

    toInsert.push({
      sourceWebsite: b.website,
      sourceCity: b.city,
      input: {
        businessName: b.businessName,
        category: b.category,
        city: b.city,
        province: b.province,
        website: b.website,
        phone: b.phone,
        email: b.email,
        googleMapsUrl: b.googleMapsUrl,
        notes: b.address ? `Address: ${b.address}` : undefined,
        status: "new",
        consentStatus: "none",
        doNotContact: false,
        unsubscribed: false,
      },
    });
  }

  if (toInsert.length === 0) {
    return { imported: 0, skipped, analyzed: 0, errors };
  }

  const imported = await bulkInsertLeads(toInsert.map((t) => t.input));

  // Optional auto-analyze: run lightweight HTTP checks on each imported lead
  // with a website. Concurrency capped to 3 to be polite to remote sites.
  let analyzed = 0;
  if (options.autoAnalyze) {
    const insertedLeads = (await readLeads()).slice(0, imported * 3); // generous slice
    const newlyImported = insertedLeads.filter((l) =>
      toInsert.some(
        (t) =>
          t.input.businessName === l.businessName &&
          t.input.city === l.city &&
          (t.input.website ?? null) === (l.website ?? null),
      ),
    );

    const concurrency = 3;
    for (let i = 0; i < newlyImported.length; i += concurrency) {
      const batch = newlyImported.slice(i, i + concurrency);
      const results = await Promise.allSettled(
        batch.map(async (lead) => {
          if (!lead.website) return false;
          const check = await quickCheckWebsite(lead.website, lead.city);
          if (!check) return false;
          const partial = checkToPartialChecklist(check);
          const merged: AuditChecklist = {
            ...EMPTY_AUDIT_CHECKLIST,
            ...(lead.auditChecklist ?? {}),
            ...partial,
          };
          await saveAuditAction(lead.id, merged);
          return true;
        }),
      );
      analyzed += results.filter((r) => r.status === "fulfilled" && r.value).length;
    }
  }

  revalidatePath("/crm");
  revalidatePath("/crm/leads");
  return { imported, skipped, analyzed, errors };
}

export async function quickAnalyzeLeadAction(leadId: string): Promise<{ ok: boolean; error?: string }> {
  const lead = await findLead(leadId);
  if (!lead) return { ok: false, error: "Lead not found." };
  if (!lead.website) return { ok: false, error: "Lead has no website to analyse." };
  const check = await quickCheckWebsite(lead.website, lead.city);
  if (!check) return { ok: false, error: "Could not reach the website." };
  const partial = checkToPartialChecklist(check);
  const merged: AuditChecklist = {
    ...EMPTY_AUDIT_CHECKLIST,
    ...(lead.auditChecklist ?? {}),
    ...partial,
  };
  await saveAuditAction(leadId, merged);
  return { ok: true };
}

// ── Content engine ────────────────────────────────────────────────────────

export async function generateContentAction(
  input: GenerateContentInput,
): Promise<{ id: string } | { error: string }> {
  if (!input.platform || !input.audience || !input.niche || !input.city || !input.angle) {
    return { error: "All fields are required." };
  }
  const pkg = generateContent(input);
  const idea = await createContentIdea({
    pkg,
    platform: input.platform,
    audience: input.audience,
    niche: input.niche,
    city: input.city,
    angle: input.angle,
  });
  revalidatePath("/crm/content");
  return { id: idea.id };
}

export async function updateContentStatusAction(
  id: string,
  status: ContentStatus,
): Promise<void> {
  await updateContentStatus(id, status);
  revalidatePath("/crm/content");
  revalidatePath(`/crm/content/${id}`);
}

export async function deleteContentIdeaAction(id: string): Promise<void> {
  await deleteContentIdeaStore(id);
  revalidatePath("/crm/content");
  redirect("/crm/content");
}

// ── Find Businesses (Google Places New) ──────────────────────────────────

const FIND_BUCKETS: Map<string, number[]> = new Map();
const FIND_RATE_LIMIT = 10; // searches / minute / niche+city
const FIND_WINDOW_MS = 60_000;

function findRateOk(key: string): boolean {
  const now = Date.now();
  const arr = (FIND_BUCKETS.get(key) ?? []).filter(
    (t) => now - t < FIND_WINDOW_MS,
  );
  if (arr.length >= FIND_RATE_LIMIT) return false;
  arr.push(now);
  FIND_BUCKETS.set(key, arr);
  return true;
}

export interface FindBusinessesInput {
  niche: string;
  city: string;
  country?: string;
  regionCode?: string;
  limit?: number;
}

export async function findBusinessesAction(
  input: FindBusinessesInput,
): Promise<DiscoveryResultV2> {
  const n = (input.niche ?? "").trim();
  const c = (input.city ?? "").trim();
  const country = (input.country ?? "").trim() || undefined;
  const regionCode = (input.regionCode ?? "").trim() || undefined;
  const limit = input.limit ?? 25;
  if (!n || !c) {
    return {
      ok: false,
      query: "",
      results: [],
      error: "Niche and city are required.",
    };
  }
  const key = `find:${n.toLowerCase()}:${c.toLowerCase()}:${(country ?? "").toLowerCase()}`;
  if (!findRateOk(key)) {
    return {
      ok: false,
      query: `${n} in ${c}${country ? `, ${country}` : ""}`,
      results: [],
      error: `Rate limit reached (${FIND_RATE_LIMIT}/min). Try again in a minute.`,
    };
  }
  const result = await findBusinesses({ niche: n, city: c, country, regionCode, limit });

  // Annotate already-imported flag so the card can show a soft state. We
  // match on normalised website domain or (name + city) to mirror import
  // dedupe rules.
  const existing = await readLeads();
  const existingDomains = new Set<string>();
  const existingNames = new Set<string>();
  for (const l of existing) {
    if (l.website) {
      try {
        const u = new URL(/^https?:\/\//i.test(l.website) ? l.website : `https://${l.website}`);
        existingDomains.add(u.hostname.toLowerCase().replace(/^www\./, ""));
      } catch {
        /* ignore */
      }
    }
    existingNames.add(`${l.businessName.toLowerCase()}|${l.city.toLowerCase()}`);
  }
  const annotated: DiscoveredBusinessV2[] = result.results.map((b) => {
    let domain = "";
    if (b.websiteUri) {
      try {
        domain = new URL(b.websiteUri).hostname.toLowerCase().replace(/^www\./, "");
      } catch {
        /* ignore */
      }
    }
    const nameKey = `${b.businessName.toLowerCase()}|${c.toLowerCase()}`;
    const alreadyImported =
      (domain.length > 0 && existingDomains.has(domain)) || existingNames.has(nameKey);
    return { ...b, alreadyImported };
  });
  return { ...result, results: annotated };
}

export interface ImportDiscoveredBusinessInput {
  business: DiscoveredBusinessV2;
  niche: string;
  city: string;
  query: string;
  enrich?: boolean;
}

export async function importDiscoveredBusinessAction(
  input: ImportDiscoveredBusinessInput,
): Promise<ImportDiscoveredResult> {
  const result = await importDiscoveredBusiness(input.business, {
    niche: input.niche,
    city: input.city,
    query: input.query,
    enrich: input.enrich ?? true,
  });
  if (result.kind === "created") {
    revalidatePath("/crm");
    revalidatePath("/crm/leads");
    revalidatePath("/crm/discovery");
  }
  return result;
}

// Re-export reads so pages can call them
export { readLeads, findLead, readContentIdeas, findContentIdea };
