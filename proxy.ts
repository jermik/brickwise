import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { CRM_COOKIE_NAME, verifyCrmAccessToken } from "@/lib/crm-access";

// ─────────────────────────────────────────────────────────────────────────────
// Subdomain routing + CRM access-code gate
// ─────────────────────────────────────────────────────────────────────────────
// CRM lives at /crm/* inside the main Next.js app. crm.brickwise.pro is
// rewritten to /crm/* via this proxy. All /crm/* and /growthos/* paths
// require BOTH Clerk auth AND a valid crm_access_granted cookie.
// The cookie is HMAC-signed (see lib/crm-access.ts) so it cannot be forged.
// ─────────────────────────────────────────────────────────────────────────────

const CRM_SUBDOMAIN_PREFIX = "crm.";

// Path prefixes that stay literal even on the CRM subdomain.
const PASSTHROUGH_PREFIXES = ["/sign-in", "/sign-up", "/api"];

function isCrmHost(host: string): boolean {
  return host.startsWith(CRM_SUBDOMAIN_PREFIX);
}

function shouldRewriteToCrm(pathname: string): boolean {
  if (pathname === "/crm" || pathname.startsWith("/crm/")) return false;
  for (const p of PASSTHROUGH_PREFIXES) {
    if (pathname === p || pathname.startsWith(p + "/")) return false;
  }
  return true;
}

// True if the request could land on a CRM/GrowthOS route after rewriting.
// Used to skip auth/cookie work for pure public routes.
function couldBeProtectedRoute(host: string, pathname: string): boolean {
  if (isCrmHost(host)) {
    if (pathname === "/") return true;
    if (pathname === "/crm" || pathname.startsWith("/crm/")) return true;
    if (pathname === "/growthos" || pathname.startsWith("/growthos/")) return true;
    if (shouldRewriteToCrm(pathname)) return true;
    return false;
  }
  return (
    pathname === "/crm" ||
    pathname.startsWith("/crm/") ||
    pathname === "/growthos" ||
    pathname.startsWith("/growthos/")
  );
}

// True if a target path requires the CRM access-code cookie.
// /crm/access and the related API endpoints are intentionally excluded so
// users can reach the unlock page and the unlock/logout APIs without it.
function isProtectedCrmPath(targetPath: string): boolean {
  if (targetPath === "/crm/access") return false;
  if (targetPath === "/api/crm/access" || targetPath === "/api/crm/logout") return false;
  if (targetPath === "/crm" || targetPath.startsWith("/crm/")) return true;
  if (targetPath === "/growthos" || targetPath.startsWith("/growthos/")) return true;
  return false;
}

// SEO: keep CRM subdomain out of search indexes.
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
  const url = req.nextUrl;
  const pathname = url.pathname;

  // SEO blocks for CRM subdomain — no auth needed
  if (isCrmHost(host)) {
    if (pathname === "/robots.txt") return crmRobotsResponse();
    if (pathname === "/sitemap.xml") return crmEmptySitemapResponse();
  }

  // Skip all gating work for pure public paths
  if (!couldBeProtectedRoute(host, pathname)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // Compute the effective path the app will serve after subdomain rewriting.
  let targetPath: string;
  if (isCrmHost(host)) {
    if (pathname === "/") {
      // Root of crm.* — signed-in users go to /crm, logged-out to the public
      // GrowthOS landing.
      targetPath = userId ? "/crm" : "/growthos";
    } else if (shouldRewriteToCrm(pathname)) {
      targetPath = `/crm${pathname}`;
    } else {
      targetPath = pathname; // direct /crm/X on crm subdomain
    }
  } else {
    targetPath = pathname;
  }

  // ── CRM access-code gate ───────────────────────────────────────────────
  if (isProtectedCrmPath(targetPath)) {
    if (!userId) {
      // No Clerk session → bounce to sign-in, preserve return path
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    const cookieValue = req.cookies.get(CRM_COOKIE_NAME)?.value;
    const valid = await verifyCrmAccessToken(cookieValue);
    if (!valid) {
      // Clerk-authed but missing/invalid access cookie → access page
      const accessUrl = new URL(req.url);
      // On crm.brickwise.pro, rewrite of /access → /crm/access handles it
      accessUrl.pathname = isCrmHost(host) ? "/access" : "/crm/access";
      accessUrl.search = `?next=${encodeURIComponent(targetPath)}`;
      return NextResponse.redirect(accessUrl);
    }
  }

  // ── Apply subdomain rewrites (after the gate has cleared) ──────────────
  if (isCrmHost(host)) {
    if (pathname === "/") {
      const rewritten = url.clone();
      rewritten.pathname = targetPath;
      const res = NextResponse.rewrite(rewritten);
      res.headers.set("x-robots-tag", "noindex, nofollow");
      return res;
    }
    if (shouldRewriteToCrm(pathname)) {
      const rewritten = url.clone();
      rewritten.pathname = `/crm${pathname}`;
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
