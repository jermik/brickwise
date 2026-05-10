import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { CRM_COOKIE_NAME, verifyCrmAccessToken } from "@/lib/crm-access";
import { BrickwiseMark } from "@/components/brand/brickwise-mark";
import { AccessForm } from "./access-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CRM Access | Brickwise",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function CrmAccessPage({ searchParams }: PageProps) {
  // Must be signed in via Clerk first
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/crm/access");
  }

  // If already unlocked, bounce straight to CRM
  const cookieStore = await cookies();
  const existing = cookieStore.get(CRM_COOKIE_NAME)?.value;
  const valid = await verifyCrmAccessToken(existing);
  if (valid) {
    redirect("/crm");
  }

  const { next } = await searchParams;
  const redirectTo = sanitizeRedirect(next);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0E0E16 0%, #05050B 100%)" }}
    >
      <div
        className="w-full max-w-[400px] rounded-[16px] p-7"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-6">
          <BrickwiseMark size={36} variant="dark" />
          <div className="flex flex-col">
            <span className="text-[15px] font-bold tracking-[-0.4px]" style={{ color: "#FFFFFF" }}>
              Brickwise CRM
            </span>
            <span className="text-[10.5px] font-medium uppercase tracking-[0.7px]" style={{ color: "rgba(96,165,250,0.85)" }}>
              Internal · Access required
            </span>
          </div>
        </div>

        <h1 className="text-[22px] font-bold tracking-[-0.5px] mb-2" style={{ color: "#FFFFFF", fontFamily: "var(--font-dm-serif)" }}>
          Enter access code
        </h1>
        <p className="text-[13px] leading-[1.55] mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>
          This area is restricted. Your account is signed in, but a second access code is required to continue.
        </p>

        <AccessForm redirectTo={redirectTo} />

        <p className="text-[10.5px] mt-6 leading-[1.6]" style={{ color: "rgba(255,255,255,0.3)" }}>
          Access requests are not logged with the submitted code. After 7 days of inactivity you&apos;ll be asked to re-enter the code.
        </p>
      </div>
    </div>
  );
}

// Whitelist where we can redirect post-unlock: must be a /crm or /growthos path on this app.
function sanitizeRedirect(next: string | undefined): string {
  if (!next) return "/crm";
  if (!next.startsWith("/")) return "/crm";
  if (next.startsWith("//")) return "/crm"; // protocol-relative
  if (next.startsWith("/crm") || next.startsWith("/growthos")) return next;
  return "/crm";
}
