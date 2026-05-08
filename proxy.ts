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

// SEO: when crawlers hit crm.brickwise.pro/robots.txt or /sitemap.xml, return
// a Disallow:* policy and an empty sitemap. The main domain
// (brickwise.pro) keeps its own robots/sitemap from app/robots.ts and
// app/sitemap.ts. Without this block, the CRM subdomain inherits the main
// site's robots, which would allow indexing of crm.brickwise.pro.
function crmRobotsResponse(): NextResponse {
  return new NextResponse("User-agent: *\nDisallow: /\n", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

function crmEmptySitemapResponse(): NextResponse {
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n`,
    {
      status: 200,
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
      },
    },
  );
}

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") ?? "";

  if (isCrmHost(host)) {
    const url = req.nextUrl;

    // SEO blocks: keep the CRM subdomain out of search indexes entirely.
    if (url.pathname === "/robots.txt") return crmRobotsResponse();
    if (url.pathname === "/sitemap.xml") return crmEmptySitemapResponse();

    // Special case: root of CRM subdomain.
    // Logged-out visitors see the public GrowthOS landing.
    // Logged-in users go straight to the CRM dashboard.
    if (url.pathname === "/") {
      const { userId } = await auth();
      const rewritten = url.clone();
      rewritten.pathname = userId ? "/crm" : "/growthos";
      const res = NextResponse.rewrite(rewritten);
      res.headers.set("x-robots-tag", "noindex, nofollow");
      return res;
    }

    if (shouldRewriteToCrm(url.pathname)) {
      const rewritten = url.clone();
      rewritten.pathname = `/crm${url.pathname}`;
      const res = NextResponse.rewrite(rewritten);
      res.headers.set("x-robots-tag", "noindex, nofollow");
      return res;
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
