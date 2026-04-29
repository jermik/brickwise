"use client";

import { useUser } from "@clerk/nextjs";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { LandingHero } from "@/components/landing/hero";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div
        className="flex h-full min-h-screen items-center justify-center"
        style={{ background: "#ECEAE3" }}
      />
    );
  }

  if (!isSignedIn) {
    return <LandingHero />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen" style={{ background: "#ECEAE3" }}>
      <div className="hidden lg:flex">
        <Sidebar />
      </div>
      <MobileNav />
      <main className="flex-1 overflow-auto flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
