// Single-send outreach helper. NOT a campaign system, NOT bulk send,
// NOT scheduled — just one human-reviewed email at a time.
//
// Flow:
//   1. Validate (recipient / subject / body / locale)
//   2. Rate-limit (10/day total, counted across the whole table)
//   3. sendEmail() via existing Resend wrapper (lib/email/send.ts)
//   4. Persist to outreach_sends regardless of success (audit trail)
//   5. Update lead.lastContactedAt on success
//
// Logs are prefixed [outreach.send] for vercel logs grep.

import { count, eq, gte } from "drizzle-orm";
import { db } from "../db/client";
import { leads as leadsTable, outreachSends } from "../db/schema";
import { sendEmail } from "@/lib/email/send";
import { sanitizeCopyOutput } from "../copy/sanitize";

export interface SendOutreachInput {
  leadId: string;
  recipient: string;
  subject: string;
  body: string;
  locale: "en" | "nl";
  sentByUserId: string;
}

export interface SendOutreachResult {
  ok: boolean;
  messageId?: string;
  sentAt?: string;
  error?: string;
  /** Suggested HTTP status — only meaningful on failure. */
  status?: number;
}

const MAX_PER_DAY = 10;
const MIN_BODY_CHARS = 50;
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export async function sendOutreachEmail(
  input: SendOutreachInput,
): Promise<SendOutreachResult> {
  const recipient = (input.recipient ?? "").trim();
  const subject = sanitizeCopyOutput((input.subject ?? "").trim());
  const body = sanitizeCopyOutput((input.body ?? "").trim());

  // ── Validation ────────────────────────────────────────────────────────
  if (!input.leadId) {
    return { ok: false, error: "leadId is required.", status: 400 };
  }
  if (!recipient || !EMAIL_RX.test(recipient)) {
    return { ok: false, error: "Valid recipient email required.", status: 400 };
  }
  if (!subject) {
    return { ok: false, error: "Subject is required.", status: 400 };
  }
  if (body.length < MIN_BODY_CHARS) {
    return {
      ok: false,
      error: `Body must be at least ${MIN_BODY_CHARS} characters.`,
      status: 400,
    };
  }
  if (input.locale !== "en" && input.locale !== "nl") {
    return { ok: false, error: "Invalid locale.", status: 400 };
  }

  // ── Rate limit (10 / 24h, total) ──────────────────────────────────────
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent = await db
    .select({ n: count() })
    .from(outreachSends)
    .where(gte(outreachSends.sentAt, dayAgo));
  const sentInLast24h = Number(recent[0]?.n ?? 0);
  if (sentInLast24h >= MAX_PER_DAY) {
    console.log("[outreach.send] rate.limited", {
      leadId: input.leadId,
      sentInLast24h,
      MAX_PER_DAY,
    });
    return {
      ok: false,
      error: `Daily outreach limit of ${MAX_PER_DAY} reached. Try again tomorrow.`,
      status: 429,
    };
  }

  console.log("[outreach.send] start", {
    leadId: input.leadId,
    recipient,
    subjectPreview: subject.slice(0, 60),
    locale: input.locale,
    sentByUserId: input.sentByUserId,
  });

  // ── Send (plain text only — no HTML) ──────────────────────────────────
  const sendResult = await sendEmail({
    to: recipient,
    subject,
    text: body,
    tags: [
      { name: "type", value: "outreach" },
      { name: "locale", value: input.locale },
      { name: "lead_id", value: input.leadId },
    ],
  });

  const sentAt = new Date();
  const id = uid();

  if (!sendResult.success) {
    console.error("[outreach.send] failed", {
      leadId: input.leadId,
      error: sendResult.error,
    });
    // Persist the failed attempt for the audit trail.
    try {
      await db.insert(outreachSends).values({
        id,
        leadId: input.leadId,
        recipient,
        subject,
        body,
        locale: input.locale,
        sentAt,
        status: "failed",
        errorMessage: sendResult.error ?? "Unknown error",
        sentByUserId: input.sentByUserId,
      });
    } catch (e) {
      console.error("[outreach.send] audit.persist.failed", {
        leadId: input.leadId,
        error: e instanceof Error ? e.message : "unknown",
      });
    }
    return {
      ok: false,
      error: sendResult.error ?? "Send failed.",
      status: 502,
    };
  }

  // ── Persist success + bump lead.lastContactedAt ────────────────────────
  try {
    await db.insert(outreachSends).values({
      id,
      leadId: input.leadId,
      recipient,
      subject,
      body,
      locale: input.locale,
      sentAt,
      status: "sent",
      messageId: sendResult.messageId,
      sentByUserId: input.sentByUserId,
    });
    await db
      .update(leadsTable)
      .set({ lastContactedAt: sentAt, updatedAt: sentAt })
      .where(eq(leadsTable.id, input.leadId));
  } catch (e) {
    // Audit-trail / lead-update failures should NOT mask a successful send.
    console.error("[outreach.send] audit.persist.failed", {
      leadId: input.leadId,
      error: e instanceof Error ? e.message : "unknown",
    });
  }

  console.log("[outreach.send] sent", {
    leadId: input.leadId,
    recipient,
    messageId: sendResult.messageId,
  });

  return {
    ok: true,
    messageId: sendResult.messageId,
    sentAt: sentAt.toISOString(),
  };
}
