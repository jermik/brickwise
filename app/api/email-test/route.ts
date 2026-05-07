import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/email/send";

// POST /api/email-test  { "to": "you@example.com" }
//
// Auth-gated so this is not a public spam vector. Clerk session required.
// Returns the Resend message id on success, the underlying error on failure.

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { to?: unknown };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const to = typeof payload.to === "string" ? payload.to.trim() : "";
  if (!to || !to.includes("@")) {
    return NextResponse.json({ error: "Provide a valid 'to' email" }, { status: 400 });
  }

  const sentAtIso = new Date().toISOString();
  const result = await sendEmail({
    to,
    subject: "GrowthOS — email delivery test",
    text:
      `This is a transactional delivery test from GrowthOS.\n\n` +
      `Sent at ${sentAtIso}\n\n` +
      `If you received this, the Resend integration is healthy:\n` +
      `  - API key valid\n  - Sender domain verified\n  - SPF / DKIM passing\n  - Inbox (not spam) routing OK\n\n` +
      `Reply to this message to confirm two-way delivery.`,
    html:
      `<p>This is a transactional delivery test from <strong>GrowthOS</strong>.</p>` +
      `<p>Sent at <code>${sentAtIso}</code></p>` +
      `<p>If you received this, the Resend integration is healthy:</p>` +
      `<ul><li>API key valid</li><li>Sender domain verified</li><li>SPF / DKIM passing</li><li>Inbox (not spam) routing OK</li></ul>` +
      `<p>Reply to this message to confirm two-way delivery.</p>`,
    tags: [
      { name: "type", value: "delivery_test" },
      { name: "user_id", value: userId },
    ],
  });

  if (!result.success) {
    console.error("[api/email-test] failed", { to, error: result.error });
    return NextResponse.json({ success: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ success: true, messageId: result.messageId, sentAtIso });
}
