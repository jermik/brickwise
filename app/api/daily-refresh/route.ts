import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Called daily by Vercel Cron. Revalidates all ISR SEO pages so they
// get fresh timestamps, triggering more frequent Googlebot crawls.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Vercel Cron passes Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = Date.now();

  // Revalidate all ISR SEO pages
  revalidatePath("/", "page");
  revalidatePath("/compare/realt-vs-lofty", "page");
  revalidatePath("/learn/what-is-tokenized-real-estate", "page");
  revalidatePath("/market", "page");

  // Revalidate dynamic route families (revalidates all matching pages)
  revalidatePath("/city/[city]", "page");
  revalidatePath("/rankings/[category]", "page");
  revalidatePath("/property/[id]", "page");
  revalidatePath("/market/[date]", "page");

  const elapsed = Date.now() - start;

  console.log(`[daily-refresh] Revalidated all SEO pages in ${elapsed}ms`);

  return NextResponse.json({
    ok: true,
    revalidated: [
      "/",
      "/compare/realt-vs-lofty",
      "/learn/what-is-tokenized-real-estate",
      "/market",
      "/city/[city] (all)",
      "/rankings/[category] (all)",
      "/property/[id] (all)",
      "/market/[date] (all)",
    ],
    elapsed,
    timestamp: new Date().toISOString(),
  });
}
