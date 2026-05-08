"use server";

import { db } from "../crm/db/client";
import { growthosWaitlist } from "../crm/db/schema";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface JoinWaitlistInput {
  email: string;
  niche?: string;
  country?: string;
  source?: string;
}

export interface JoinWaitlistResult {
  ok: boolean;
  error?: string;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

/**
 * Persist a /growthos waitlist signup. Pure DB write — no email send,
 * no third-party calls. Mirrors the existing CRM action style.
 */
export async function joinWaitlistAction(
  input: JoinWaitlistInput,
): Promise<JoinWaitlistResult> {
  const email = (input.email ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RX.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  const niche = (input.niche ?? "").trim().slice(0, 80) || null;
  const country = (input.country ?? "").trim().slice(0, 80) || null;
  const source = (input.source ?? "").trim().slice(0, 40) || "direct";

  try {
    await db.insert(growthosWaitlist).values({
      id: uid(),
      email,
      niche,
      country,
      source,
    });
    console.log("[growthos.waitlist] joined", { email, niche, country, source });
    return { ok: true };
  } catch (e) {
    console.error("[growthos.waitlist] insert.failed", {
      email,
      error: e instanceof Error ? e.message : "unknown",
    });
    return { ok: false, error: "Could not save your signup. Try again." };
  }
}
