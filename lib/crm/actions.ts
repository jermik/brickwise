"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "./db/client";
import { leads as leadsTable } from "./db/schema";
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
import { computeAllScores, generateAuditSummary } from "./scoring";
import { generateProposal } from "./proposal";
import { parseCSV } from "./csv";
import type {
  LeadCreateInput,
  LeadStatus,
  AuditChecklist,
  ContactType,
} from "./types";
import { MAX_DAILY_OUTREACH } from "./types";

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
  revalidatePath("/crm");
  revalidatePath(`/crm/leads/${id}`);
}

export async function toggleDoNotContact(id: string, value: boolean): Promise<void> {
  const patch: Partial<LeadCreateInput> = { doNotContact: value };
  if (value) patch.status = "lost";
  await updateLead(id, patch);
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
  await updateLead(id, { ...scores, auditSummary: summary, auditChecklist: checklist });
  revalidatePath("/crm");
  revalidatePath(`/crm/leads/${id}`);
}

// ── Proposal ───────────────────────────────────────────────────────────────

export async function generateProposalAction(id: string): Promise<void> {
  const lead = await findLead(id);
  if (!lead) return;
  const proposal = generateProposal(lead);
  await updateLead(id, {
    proposalEmail: proposal.emailDraft,
    proposalLinkedIn: proposal.linkedInDraft,
    proposalCallScript: proposal.callScript,
    proposalBullets: proposal.bulletPoints,
    proposalOffer: proposal.suggestedOffer,
    estimatedValue: proposal.estimatedValue,
  });
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

  const { contact, followUp } = await logContact(leadId, type, message);

  // Auto-progress status
  const newStatus: LeadStatus =
    lead.status === "new" || lead.status === "researched" ? "contacted" : lead.status;

  await db
    .update(leadsTable)
    .set({
      lastContactedAt: new Date(contact.sentAt),
      nextFollowUpAt: new Date(followUp.dueAt),
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

// Re-export reads so pages can call them
export { readLeads, findLead };
