"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useClerk } from "@clerk/nextjs";
import { PROPERTIES } from "@/lib/data/properties";
import { getBestPick } from "@/lib/recommendations";
import { BrickwiseMark } from "@/components/brand/brickwise-mark";

const topPick = getBestPick(PROPERTIES);

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" />
        <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" />
        <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" />
        <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    icon: (
      <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="5" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <path d="M4 5V4a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M1 8h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/analyzer",
    label: "Analyzer",
    icon: (
      <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/watchlist",
    label: "Watchlist",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 14S2 10.5 2 5.5a4 4 0 018 0 4 4 0 018 0C18 10.5 8 14 8 14z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <>
      {/* Top bar */}
      <div
        className="lg:hidden flex items-center justify-between px-5 h-[52px] flex-shrink-0 sticky top-0 z-30"
        style={{
          background: "#120F0A",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <BrickwiseMark size={24} variant="dark" />
          <span className="text-[14px] font-bold tracking-[-0.4px] text-white">
            Brickwise
          </span>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex flex-col gap-[5px] justify-center items-center w-8 h-8 rounded-[6px]"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <span className="block w-4 h-[1.5px]" style={{ background: "rgba(255,255,255,0.7)" }} />
          <span className="block w-4 h-[1.5px]" style={{ background: "rgba(255,255,255,0.7)" }} />
          <span className="block w-4 h-[1.5px]" style={{ background: "rgba(255,255,255,0.7)" }} />
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="lg:hidden fixed top-0 left-0 h-full z-50 flex flex-col w-[260px] transition-transform duration-200"
        style={{
          background: "#120F0A",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 py-[22px]"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Link href="/" className="flex items-center gap-2.5 no-underline" onClick={() => setOpen(false)}>
            <BrickwiseMark size={28} variant="dark" />
            <span className="text-[15px] font-bold tracking-[-0.4px] text-white">
              Brickwise
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="w-7 h-7 flex items-center justify-center rounded-[5px]"
            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="px-2.5 pt-3 flex-1">
          <div
            className="text-[12px] font-semibold px-2.5 pb-2.5 pt-1 uppercase tracking-[1.2px]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Menu
          </div>
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2.5 px-2.5 py-[9px] rounded-[7px] mb-0.5 text-[13px] no-underline"
                style={{
                  background: active ? "rgba(255,255,255,0.06)" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span style={{ opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          {/* Best pick */}
          {topPick && (
            <div
              className="mt-5 p-3.5 rounded-[8px]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="text-[12px] font-bold uppercase tracking-[0.8px] mb-1.5"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Best pick
              </div>
              <div
                className="text-[12px] font-semibold mb-0.5 truncate"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {topPick.name}
              </div>
              <div
                className="text-[11px] mb-2.5"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Score {topPick.overallScore} · Yield {topPick.expectedYield}%
              </div>
              <Link
                href={`/property/${topPick.id}`}
                onClick={() => setOpen(false)}
                className="block w-full text-center py-1.5 rounded-[5px] text-[11px] font-semibold no-underline"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                View →
              </Link>
            </div>
          )}
        </nav>

        {/* User footer */}
        <div
          className="px-4 py-3.5 flex items-center gap-2.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <UserButton
            appearance={{
              elements: { avatarBox: "w-7 h-7" },
            }}
          />
          <div className="flex-1">
            <div className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>
              Account
            </div>
            <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Early Access
            </div>
          </div>
          <button
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            aria-label="Sign out"
            className="flex items-center justify-center w-6 h-6 rounded-[5px] flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M5 1H2a1 1 0 00-1 1v8a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M8 9l3-3-3-3M11 6H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
