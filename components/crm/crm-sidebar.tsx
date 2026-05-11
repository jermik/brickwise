"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LockCrmButton } from "@/components/crm/lock-button";

const NAV = [
  { href: "/crm", label: "Dashboard", icon: "▦", exact: true },
  { href: "/crm/discovery", label: "Discovery", icon: "✦" },
  { href: "/crm/leads", label: "Leads", icon: "◈" },
  { href: "/crm/follow-ups", label: "Follow-ups", icon: "◷" },
  { href: "/crm/offers", label: "Offers", icon: "◎" },
  { href: "/crm/content", label: "Content", icon: "▶" },
  { href: "/crm/leads/import", label: "Import CSV", icon: "↑" },
];

export function CRMSidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  // Auto-close the mobile drawer when navigating.
  useEffect(() => {
    setOpen(false);
  }, [path]);

  // Lock body scroll while the drawer is open on mobile.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const original = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : original;
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  function isActive(href: string, exact?: boolean) {
    return exact ? path === href : path.startsWith(href);
  }

  return (
    <>
      {/* Mobile hamburger — fixed, only visible below md */}
      <button
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden fixed top-3 left-3 z-50 inline-flex items-center justify-center w-11 h-11 rounded-lg"
        style={{
          background: "rgba(10,9,7,0.85)",
          border: "1px solid #2A2420",
          color: "#F2EDE6",
          backdropFilter: "blur(10px)",
        }}
      >
        <span className="sr-only">Menu</span>
        {open ? (
          // Close icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        ) : (
          // Hamburger icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7"  x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        )}
      </button>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-30"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`flex flex-col py-4 md:py-6 fixed md:static inset-y-0 left-0 z-40 w-64 md:w-60 transform transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:shrink-0`}
        style={{ borderRight: "1px solid #2A2420", background: "#0A0907" }}
      >
        {/* Brand */}
        <div className="px-5 mb-6 md:mb-8 pl-16 md:pl-5">
          <Link href="/growthos" className="flex items-center gap-2 group">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-md font-display text-base"
              style={{
                background: "rgba(245,158,11,0.12)",
                color: "#f59e0b",
                border: "1px solid rgba(245,158,11,0.25)",
              }}
            >
              G
            </span>
            <span className="font-display text-lg tracking-tight" style={{ color: "#F2EDE6" }}>
              GrowthOS
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 overflow-y-auto">
          {NAV.map(({ href, label, icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors"
                style={{
                  background: active ? "rgba(245,158,11,0.1)" : "transparent",
                  color: active ? "#f59e0b" : "rgba(242,237,230,0.6)",
                  borderLeft: active ? "2px solid #f59e0b" : "2px solid transparent",
                }}
              >
                <span className="w-4 text-center font-mono text-base">{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer — visible on both, smaller on mobile */}
        <div
          className="px-5 pt-4 mt-4 space-y-2"
          style={{ borderTop: "1px solid #2A2420" }}
        >
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(242,237,230,0.3)" }}>
            Max 10 outreach/day.
            <br />
            Always personalise. Never bulk send.
          </p>
          <Link href="/growthos" className="text-[12px] underline" style={{ color: "rgba(242,237,230,0.4)" }}>
            About GrowthOS →
          </Link>
          <div className="pt-2">
            <LockCrmButton />
          </div>
        </div>
      </aside>
    </>
  );
}
