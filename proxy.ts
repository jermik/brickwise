import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Subdomain routing for the CRM
// ─────────────────────────────────────────────────────────────────────────────
// The CRM lives at /crm/* inside the same Next.js app as the main Brickwise
// site. To expose it cleanly at https://crm.brickwise.pro WITHOUT extracting
// it into a separate project, this proxy inspects the request host and
// rewrites the incoming path with a `/crm` prefix.
//
//   On brickwise.pro (main domain):
//     GET /             → /             (Brickwise home, unchanged)
//     GET /crm          → /crm          (CRM dashboard, unchanged — fallback)
//
//   On crm.brickwise.pro (CRM subdomain):
//     GET /             → /crm
//     GET /leads        → /crm/leads
//     GET /leads/abc    → /crm/leads/abc
//     GET /follow-ups   → /crm/follow-ups
//     GET /offers       → /crm/offers
//     GET /sign-in      → /sign-in      (passthrough — Clerk needs real path)
//     GET /sign-up      → /sign-up      (passthrough)
//     GET /api/*        → /api/*        (passthrough — server actions, etc.)
//     GET /_next/*      → already excluded by the matcher below
//
// Future extraction plan: when the CRM is moved to its own Next.js project,
// remove the entire `if (isCrmHost ...)` block below. The standalone CRM
// project can then drop the `/crm` URL prefix from its file structure.
//
// Clerk integration: `clerkMiddleware` keeps cross-subdomain session and
// cookie handling intact (cookies are scoped to .brickwise.pro by default).
// Auth gating itself happens in `app/crm/layout.tsx` via `auth()` — host
// rewrites do NOT bypass that layer.
// ─────────────────────────────────────────────────────────────────────────────

const CRM_SUBDOMAIN_PREFIX = "crm.";

// Path prefixes that must stay at their literal location even when the
// request arrives on the CRM subdomain. Sign-in / sign-up pages live at the
// app root, not under /crm, and API routes (server actions, Clerk callbacks)
// need their original path so Next can route them correctly.
const PASSTHROUGH_PREFIXES = ["/sign-in", "/sign-up", "/api"];

function isCrmHost(host: string): boolean {
  return host.startsWith(CRM_SUBDOMAIN_PREFIX);
}

function shouldRewriteToCrm(pathname: string): boolean {
  // Already under /crm — no rewrite needed.
  if (pathname === "/crm" || pathname.startsWith("/crm/")) return false;
  // Passthrough list (sign-in, api, etc.).
  for (const p of PASSTHROUGH_PREFIXES) {
    if (pathname === p || pathname.startsWith(p + "/")) return false;
  }
  return true;
}

export default clerkMiddleware((_auth, req) => {
  const host = req.headers.get("host") ?? "";

  if (isCrmHost(host)) {
    const url = req.nextUrl;
    if (shouldRewriteToCrm(url.pathname)) {
      const rewritten = url.clone();
      rewritten.pathname =
        url.pathname === "/" ? "/crm" : `/crm${url.pathname}`;
      return NextResponse.rewrite(rewritten);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
