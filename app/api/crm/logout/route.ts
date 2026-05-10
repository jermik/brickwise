import { NextResponse } from "next/server";
import { buildCrmAccessClearCookie } from "@/lib/crm-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST → clears the crm_access_granted cookie.
// Does not require Clerk auth — clearing should always succeed even if Clerk session expired.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("set-cookie", buildCrmAccessClearCookie());
  return res;
}
