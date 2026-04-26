"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div
        className="flex h-full min-h-screen items-center justify-center"
        style={{ background: "#f5f5f3" }}
      />
    );
  }

  if (!isSignedIn) {
    return (
      <div
        className="flex h-full min-h-screen items-center justify-center"
        style={{ background: "#f5f5f3" }}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen" style={{ background: "#f5f5f3" }}>
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
