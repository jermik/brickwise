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
import type {
  LeadCreateInput,
  LeadStatus,
  AuditChecklist,
  ContactType,
} from "./types";
import { MAX_DAILY_OUTREACH, MAX_PENDING_FOLLOW_UPS } from "./types";

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

  await updateLead(id, {
    ...scores,
    auditSummary: summary,
    auditChecklist: checklist,
    topProblems,
    topImprovements,
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

// Re-export reads so pages can call them
export { readLeads, findLead };
