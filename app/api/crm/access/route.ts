import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  CRM_COOKIE_NAME,
  buildCrmAccessCookieAttributes,
  createCrmAccessToken,
  isCrmAccessCodeValid,
} from "@/lib/crm-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { code: string } → sets crm_access_granted cookie if code matches.
export async function POST(req: Request) {
  // Require Clerk auth FIRST. Access-code gate is layered on top of Clerk.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }
  const code = (body as { code?: string } | null)?.code;
  if (typeof code !== "string" || code.length === 0) {
    return NextResponse.json({ ok: false, error: "missing_code" }, { status: 400 });
  }

  if (!isCrmAccessCodeValid(code)) {
    // Intentionally do not log the submitted value
    return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 401 });
  }

  const token = await createCrmAccessToken();
  if (!token) {
    // Server misconfiguration (CRM_COOKIE_SECRET missing/short)
    return NextResponse.json(
      { ok: false, error: "server_not_configured" },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.headers.set(
    "set-cookie",
    `${CRM_COOKIE_NAME}=${token}; ${buildCrmAccessCookieAttributes()}`,
  );
  return res;
}
