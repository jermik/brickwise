import { Resend } from "resend";

// ─────────────────────────────────────────────────────────────────────────────
// Centralised transactional email sender.
//
// Wraps Resend with structured logging, sane sender defaults, and a single
// failure surface so callers don't each re-implement error handling.
//
// Required env: RESEND_API_KEY
// Optional env: EMAIL_FROM, EMAIL_REPLY_TO
//
// Logs (always JSON-shaped, prefixed `[email]` for easy `vercel logs` grep):
//   [email] sent          { to, subject, messageId, ms }
//   [email] send failed   { to, subject, error, name, ms }
//   [email] send threw    { to, subject, error, ms }
//   [email] missing key   { to, subject }
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_FROM = process.env.EMAIL_FROM ?? "GrowthOS <hello@brickwise.pro>";
const DEFAULT_REPLY_TO = process.env.EMAIL_REPLY_TO ?? "hello@brickwise.pro";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const startedAt = Date.now();
  const toLabel = Array.isArray(input.to) ? input.to.join(",") : input.to;

  if (!apiKey) {
    console.error("[email] missing key", { to: toLabel, subject: input.subject });
    return { success: false, error: "RESEND_API_KEY not set" };
  }
  if (!input.html && !input.text) {
    console.error("[email] no body", { to: toLabel, subject: input.subject });
    return { success: false, error: "html or text body required" };
  }

  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({
      from: input.from ?? DEFAULT_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html ?? "",
      text: input.text,
      replyTo: input.replyTo ?? DEFAULT_REPLY_TO,
      tags: input.tags,
    });

    const ms = Date.now() - startedAt;
    if (error) {
      console.error("[email] send failed", {
        to: toLabel,
        subject: input.subject,
        error: error.message,
        name: error.name,
        ms,
      });
      return { success: false, error: error.message };
    }
    console.log("[email] sent", {
      to: toLabel,
      subject: input.subject,
      messageId: data?.id,
      ms,
    });
    return { success: true, messageId: data?.id };
  } catch (e) {
    const ms = Date.now() - startedAt;
    const msg = e instanceof Error ? e.message : "unknown error";
    console.error("[email] send threw", {
      to: toLabel,
      subject: input.subject,
      error: msg,
      ms,
    });
    return { success: false, error: msg };
  }
}
