import { eq, desc, gte, sql } from "drizzle-orm";
import { db } from "./db/client";
import {
  leads,
  contacts,
  followUps,
  contentIdeas,
  type LeadRow,
  type ContactRow,
  type FollowUpRow,
  type ContentIdeaRow,
} from "./db/schema";
import type {
  Lead,
  LeadCreateInput,
  ContactRecord,
  FollowUpRecord,
  ContactType,
} from "./types";
import type { ContentIdea, ContentPackage, ContentPlatform, ContentStatus } from "./content/types";
import { coerceRenderScene } from "./content/types";

// ── Mappers (DB row → public type) ─────────────────────────────────────────

function rowToContact(row: ContactRow): ContactRecord {
  return {
    id: row.id,
    leadId: row.leadId,
    type: row.type,
    message: row.message ?? undefined,
    sentAt: row.sentAt.toISOString(),
  };
}

function rowToFollowUp(row: FollowUpRow): FollowUpRecord {
  return {
    id: row.id,
    leadId: row.leadId,
    dueAt: row.dueAt.toISOString(),
    completed: row.completed,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

function rowToLead(
  row: LeadRow,
  contactList: ContactRecord[] = [],
  followUpList: FollowUpRecord[] = [],
): Lead {
  return {
    id: row.id,
    businessName: row.businessName,
    category: row.category,
    city: row.city,
    province: row.province,
    website: row.website ?? undefined,
    email: row.email ?? undefined,
    contactPageUrl: row.contactPageUrl ?? undefined,
    phone: row.phone ?? undefined,
    googleMapsUrl: row.googleMapsUrl ?? undefined,
    notes: row.notes ?? undefined,
    status: row.status,
    lastContactedAt: row.lastContactedAt?.toISOString(),
    nextFollowUpAt: row.nextFollowUpAt?.toISOString(),
    consentStatus: row.consentStatus,
    doNotContact: row.doNotContact,
    unsubscribed: row.unsubscribed,
    websiteScore: row.websiteScore ?? undefined,
    seoScore: row.seoScore ?? undefined,
    conversionScore: row.conversionScore ?? undefined,
    automationScore: row.automationScore ?? undefined,
    auditSummary: row.auditSummary ?? undefined,
    auditChecklist: row.auditChecklist ?? undefined,
    topProblems: row.topProblems ?? undefined,
    topImprovements: row.topImprovements ?? undefined,
    richAudit: row.richAudit ?? undefined,
    leadScore: row.leadScore ?? undefined,
    leadScoreData: row.leadScoreData ?? undefined,
    proposalEmail: row.proposalEmail ?? undefined,
    proposalFollowUpEmail: row.proposalFollowUpEmail ?? undefined,
    proposalLinkedIn: row.proposalLinkedIn ?? undefined,
    proposalCallScript: row.proposalCallScript ?? undefined,
    proposalBullets: row.proposalBullets ?? undefined,
    proposalOffer: row.proposalOffer ?? undefined,
    estimatedValue: row.estimatedValue ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    contacts: contactList,
    followUps: followUpList,
  };
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

function isoToDate(iso: string | undefined | null): Date | null {
  if (!iso) return null;
  return new Date(iso);
}

// ── Reads ──────────────────────────────────────────────────────────────────

export async function readLeads(): Promise<Lead[]> {
  const rows = await db.query.leads.findMany({
    with: { contacts: true, followUps: true },
    orderBy: [desc(leads.updatedAt)],
  });
  return rows.map((r) =>
    rowToLead(r, r.contacts.map(rowToContact), r.followUps.map(rowToFollowUp)),
  );
}

export async function findLead(id: string): Promise<Lead | undefined> {
  const row = await db.query.leads.findFirst({
    where: eq(leads.id, id),
    with: { contacts: true, followUps: true },
  });
  if (!row) return undefined;
  return rowToLead(row, row.contacts.map(rowToContact), row.followUps.map(rowToFollowUp));
}

// ── Writes ─────────────────────────────────────────────────────────────────

export async function createLead(input: LeadCreateInput): Promise<Lead> {
  const id = uid();
  const now = new Date();
  const [row] = await db
    .insert(leads)
    .values({
      id,
      businessName: input.businessName,
      category: input.category,
      city: input.city,
      province: input.province,
      website: input.website ?? null,
      email: input.email ?? null,
      contactPageUrl: input.contactPageUrl ?? null,
      phone: input.phone ?? null,
      googleMapsUrl: input.googleMapsUrl ?? null,
      notes: input.notes ?? null,
      status: input.status,
      lastContactedAt: isoToDate(input.lastContactedAt),
      nextFollowUpAt: isoToDate(input.nextFollowUpAt),
      consentStatus: input.consentStatus,
      doNotContact: input.doNotContact,
      unsubscribed: input.unsubscribed,
      auditChecklist: input.auditChecklist ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return rowToLead(row);
}

export async function bulkInsertLeads(inputs: LeadCreateInput[]): Promise<number> {
  if (inputs.length === 0) return 0;
  const now = new Date();
  const rows = inputs.map((input) => ({
    id: uid(),
    businessName: input.businessName,
    category: input.category,
    city: input.city,
    province: input.province,
    website: input.website ?? null,
    email: input.email ?? null,
    contactPageUrl: input.contactPageUrl ?? null,
    phone: input.phone ?? null,
    googleMapsUrl: input.googleMapsUrl ?? null,
    notes: input.notes ?? null,
    status: input.status,
    consentStatus: input.consentStatus,
    doNotContact: input.doNotContact,
    unsubscribed: input.unsubscribed,
    createdAt: now,
    updatedAt: now,
  }));
  const inserted = await db.insert(leads).values(rows).returning({ id: leads.id });
  return inserted.length;
}

export async function updateLead(
  id: string,
  patch: Partial<LeadCreateInput>,
): Promise<Lead | null> {
  const setValues: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  // Map only the fields that are present
  const directFields: (keyof LeadCreateInput)[] = [
    "businessName", "category", "city", "province", "website", "email",
    "contactPageUrl", "phone", "googleMapsUrl", "notes", "status",
    "consentStatus", "doNotContact", "unsubscribed",
    "websiteScore", "seoScore", "conversionScore", "automationScore", "auditSummary",
    "proposalEmail", "proposalFollowUpEmail", "proposalLinkedIn", "proposalCallScript",
    "proposalBullets", "proposalOffer", "estimatedValue",
  ];
  for (const k of directFields) {
    if (patch[k] !== undefined) setValues[k] = patch[k];
  }
  if (patch.auditChecklist !== undefined) setValues.auditChecklist = patch.auditChecklist;
  if (patch.topProblems !== undefined) setValues.topProblems = patch.topProblems;
  if (patch.topImprovements !== undefined) setValues.topImprovements = patch.topImprovements;
  if (patch.richAudit !== undefined) setValues.richAudit = patch.richAudit;
  if (patch.leadScore !== undefined) setValues.leadScore = patch.leadScore;
  if (patch.leadScoreData !== undefined) setValues.leadScoreData = patch.leadScoreData;
  if (patch.lastContactedAt !== undefined) {
    setValues.lastContactedAt = isoToDate(patch.lastContactedAt);
  }
  if (patch.nextFollowUpAt !== undefined) {
    setValues.nextFollowUpAt = isoToDate(patch.nextFollowUpAt);
  }

  const [row] = await db.update(leads).set(setValues).where(eq(leads.id, id)).returning();
  if (!row) return null;
  return rowToLead(row);
}

export async function deleteLead(id: string): Promise<boolean> {
  const deleted = await db.delete(leads).where(eq(leads.id, id)).returning({ id: leads.id });
  return deleted.length > 0;
}

// ── Contacts ───────────────────────────────────────────────────────────────

export async function getTodayContactCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contacts)
    .where(gte(contacts.sentAt, today));
  return result[0]?.count ?? 0;
}

export async function logContact(
  leadId: string,
  type: ContactType,
  message: string | undefined,
  skipFollowUp = false,
): Promise<{ contact: ContactRecord; followUp: FollowUpRecord | null }> {
  const sentAt = new Date();

  const [contactRow] = await db
    .insert(contacts)
    .values({ id: uid(), leadId, type, message: message ?? null, sentAt })
    .returning();

  if (skipFollowUp) {
    return { contact: rowToContact(contactRow), followUp: null };
  }

  const followUpDate = new Date();
  followUpDate.setDate(followUpDate.getDate() + 3);
  const [followUpRow] = await db
    .insert(followUps)
    .values({ id: uid(), leadId, dueAt: followUpDate, completed: false })
    .returning();

  return {
    contact: rowToContact(contactRow),
    followUp: rowToFollowUp(followUpRow),
  };
}

// ── Follow-ups ─────────────────────────────────────────────────────────────

export async function completeFollowUp(
  leadId: string,
  followUpId: string,
): Promise<void> {
  await db
    .update(followUps)
    .set({ completed: true })
    .where(eq(followUps.id, followUpId));

  // Update the lead's nextFollowUpAt to the next pending one
  const remaining = await db
    .select()
    .from(followUps)
    .where(eq(followUps.leadId, leadId))
    .orderBy(followUps.dueAt);
  const nextPending = remaining.find((f) => !f.completed);
  await db
    .update(leads)
    .set({
      nextFollowUpAt: nextPending?.dueAt ?? null,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, leadId));
}

export async function addFollowUp(
  leadId: string,
  dueAtIso: string,
  notes: string | undefined,
): Promise<FollowUpRecord> {
  const dueAt = new Date(dueAtIso);
  const [row] = await db
    .insert(followUps)
    .values({ id: uid(), leadId, dueAt, completed: false, notes: notes ?? null })
    .returning();
  await db
    .update(leads)
    .set({ nextFollowUpAt: dueAt, updatedAt: new Date() })
    .where(eq(leads.id, leadId));
  return rowToFollowUp(row);
}

// ── Content ideas ─────────────────────────────────────────────────────────

function rowToContentIdea(row: ContentIdeaRow): ContentIdea {
  return {
    id: row.id,
    title: row.title,
    platform: row.platform,
    audience: row.audience,
    niche: row.niche,
    city: row.city,
    angle: row.angle,
    hook: row.hook,
    // Coerce on read so legacy rows (pre-render-schema) become valid
    // RenderScene[] without a DB migration. New rows pass through unchanged
    // because their fields are already populated.
    scriptScenes: row.scriptScenes.map((s, i) => coerceRenderScene(s, i + 1)),
    voiceover: row.voiceover ?? "",
    subtitlesSrt: row.subtitlesSrt ?? "",
    captionsPlain: row.captionsPlain ?? "",
    caption: row.caption,
    hashtags: row.hashtags,
    cta: row.cta,
    thumbnailText: row.thumbnailText ?? "",
    pinnedComment: row.pinnedComment ?? "",
    durationSeconds: row.durationSeconds,
    retentionNotes: row.retentionNotes ?? "",
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function readContentIdeas(): Promise<ContentIdea[]> {
  const rows = await db.select().from(contentIdeas).orderBy(desc(contentIdeas.updatedAt));
  return rows.map(rowToContentIdea);
}

export async function findContentIdea(id: string): Promise<ContentIdea | undefined> {
  const rows = await db.select().from(contentIdeas).where(eq(contentIdeas.id, id)).limit(1);
  if (rows.length === 0) return undefined;
  return rowToContentIdea(rows[0]);
}

export async function createContentIdea(args: {
  pkg: ContentPackage;
  platform: ContentPlatform;
  audience: string;
  niche: string;
  city: string;
  angle: string;
}): Promise<ContentIdea> {
  const id = uid();
  const now = new Date();
  const [row] = await db
    .insert(contentIdeas)
    .values({
      id,
      title: args.pkg.title,
      platform: args.platform,
      audience: args.audience,
      niche: args.niche,
      city: args.city,
      angle: args.angle,
      hook: args.pkg.hook,
      scriptScenes: args.pkg.scriptScenes,
      voiceover: args.pkg.voiceover,
      subtitlesSrt: args.pkg.subtitlesSrt,
      captionsPlain: args.pkg.captionsPlain,
      caption: args.pkg.caption,
      hashtags: args.pkg.hashtags,
      cta: args.pkg.cta,
      thumbnailText: args.pkg.thumbnailText,
      pinnedComment: args.pkg.pinnedComment,
      durationSeconds: args.pkg.durationSeconds,
      retentionNotes: args.pkg.retentionNotes,
      status: "idea",
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return rowToContentIdea(row);
}

export async function updateContentStatus(
  id: string,
  status: ContentStatus,
): Promise<void> {
  await db
    .update(contentIdeas)
    .set({ status, updatedAt: new Date() })
    .where(eq(contentIdeas.id, id));
}

export async function deleteContentIdea(id: string): Promise<boolean> {
  const deleted = await db
    .delete(contentIdeas)
    .where(eq(contentIdeas.id, id))
    .returning({ id: contentIdeas.id });
  return deleted.length > 0;
}
