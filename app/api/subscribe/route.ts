import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// Subscriber capture without a Resend audience.
//
// Each subscribe sends a notification email to RESEND_NOTIFY_ADDRESS. The
// owner sees subscriber email + source in their inbox, can reply directly
// (Reply-To is the subscriber). Resend's "Logs" panel becomes the persistent
// subscriber record — no audience needed.
//
// Env vars:
//   RESEND_API_KEY        — required
//   RESEND_NOTIFY_ADDRESS — required (your inbox)
//   RESEND_FROM_ADDRESS   — optional (defaults to onboarding@resend.dev,
//                           which can only deliver to the verified account
//                           holder's email; set this once brickwise.pro
//                           domain is verified in Resend)
export async function POST(req: NextRequest) {
  const { email, source } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyAddress = process.env.RESEND_NOTIFY_ADDRESS;
  if (!apiKey || !notifyAddress) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const cleanEmail = email.toLowerCase().trim();
  const cleanSource = (typeof source === "string" ? source : "unknown").slice(0, 50);
  const from = process.env.RESEND_FROM_ADDRESS || "Brickwise <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: notifyAddress,
    replyTo: cleanEmail,
    subject: `New Brickwise subscriber · ${cleanSource}`,
    text:
      `New Brickwise subscriber\n\n` +
      `Email: ${cleanEmail}\n` +
      `Source: ${cleanSource}\n` +
      `Time: ${new Date().toISOString()}\n`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }

  // GDPR hygiene: log source only, never the email
  if (cleanSource) console.log(`New subscriber via ${cleanSource}`);
  return NextResponse.json({ success: true });
}
