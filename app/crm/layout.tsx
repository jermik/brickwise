import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CRMSidebar } from "@/components/crm/crm-sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outreach CRM — Brickwise",
  robots: { index: false, follow: false },
};

export default async function CRMLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen" style={{ background: "#0A0907" }}>
      <CRMSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
