import { auth } from "@clerk/nextjs/server";
import { CRMSidebar } from "@/components/crm/crm-sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GrowthOS — Outreach Dashboard",
  robots: { index: false, follow: false },
};

// Every CRM page reads auth + DB on each request. Never prerender.
export const dynamic = "force-dynamic";

export default async function CRMLayout({ children }: { children: React.ReactNode }) {
  // Auth-gate every CRM route. `redirectToSignIn()` preserves the originating
  // URL (including the crm.brickwise.pro subdomain), so after sign-in the user
  // lands back where they were instead of dropping to a generic /dashboard.
  // This works because `clerkMiddleware` is active (see proxy.ts).
  const { userId, redirectToSignIn } = await auth();
  if (!userId) redirectToSignIn();

  return (
    <div className="flex min-h-screen" style={{ background: "#0A0907" }}>
      <CRMSidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
