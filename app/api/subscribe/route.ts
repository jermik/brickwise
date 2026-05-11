import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email, source } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId || !process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.contacts.create({
    email: email.toLowerCase().trim(),
    audienceId,
    unsubscribed: false,
  });

  if (error) {
    if (error.message?.toLowerCase().includes("already exists")) {
      return NextResponse.json({ success: true, already: true });
    }
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }

  // GDPR hygiene: don't log raw subscriber emails. Source is fine.
  if (source) console.log(`New subscriber via ${source}`);
  return NextResponse.json({ success: true });
}
