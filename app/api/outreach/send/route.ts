import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sendOutreachEmail } from "@/lib/crm/outreach/send";

// POST /api/outreach/send
// Body: { leadId, recipient, subject, body, locale: "en" | "nl" }
//
// Single-send manual outreach. Clerk-protected. NOT a campaign endpoint —
// this is one human-reviewed email per call. Rate-limited to 10/day total.

export const dynamic = "force-dynamic";

interface SendBody {
  leadId?: unknown;
  recipient?: unknown;
  subject?: unknown;
  body?: unknown;
  locale?: unknown;
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let payload: SendBody;
  try {
    payload = (await req.json()) as SendBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const leadId = asString(payload.leadId);
  const recipient = asString(payload.recipient);
  const subject = asString(payload.subject);
  const body = asString(payload.body);
  const locale = asString(payload.locale);

  if (!leadId || !recipient || !subject || !body || !locale) {
    return NextResponse.json(
      { ok: false, error: "Missing required field." },
      { status: 400 },
    );
  }
  if (locale !== "en" && locale !== "nl") {
    return NextResponse.json(
      { ok: false, error: "Invalid locale." },
      { status: 400 },
    );
  }

  const result = await sendOutreachEmail({
    leadId,
    recipient,
    subject,
    body,
    locale,
    sentByUserId: userId,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status ?? 500 },
    );
  }
  return NextResponse.json({
    ok: true,
    messageId: result.messageId,
    sentAt: result.sentAt,
    from: process.env.EMAIL_FROM,
  });
}
