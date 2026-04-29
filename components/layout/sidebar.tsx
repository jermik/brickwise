"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import { PROPERTIES } from "@/lib/data/properties";
import { getBestPick } from "@/lib/recommendations";

const topPick = getBestPick(PROPERTIES);

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M10 10l3 3"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/watchlist",
    label: "Watchlist",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 12.5S1.5 9 1.5 4.5a3.5 3.5 0 017 0 3.5 3.5 0 017 0C15.5 9 7 12.5 7 12.5z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/announce",
    label: "Announce",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 5.5h1.5v3H2a1 1 0 01-1-1v-1a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M3.5 5.5L10 2v10L3.5 8.5V5.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M5.5 8.5l1 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const displayName = user
    ? [user.firstName, user.lastName ? user.lastName.charAt(0) + "." : ""]
        .filter(Boolean)
        .join(" ")
    : "Account";

  return (
    <aside
      className="w-[220px] flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{
        background: "#120F0A",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-[22px]"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-[6px] flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
              <rect x="0" y="8" width="13" height="3" rx="0.75" fill="rgba(255,255,255,0.85)" />
              <rect x="0" y="4" width="9"  height="3" rx="0.75" fill="rgba(255,255,255,0.85)" />
              <rect x="0" y="0" width="5"  height="3" rx="0.75" fill="rgba(255,255,255,0.85)" />
            </svg>
          </div>
          <span className="text-[15px] font-bold tracking-[-0.4px] text-white">
            Brickwise
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2.5 pt-3 flex-1">
        <div
          className="text-[10px] font-semibold px-2.5 pb-2.5 pt-1 uppercase tracking-[1.2px]"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Menu
        </div>
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="w-full flex items-center gap-2.5 px-2.5 py-[9px] rounded-[7px] mb-0.5 text-[13px] transition-all duration-150 no-underline"
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

        {/* Best pick widget */}
        {topPick && (
          <div
            className="mt-5 p-3.5 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="text-[10px] font-bold uppercase tracking-[0.8px] mb-1.5"
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
              className="block w-full text-center py-1.5 rounded-[5px] text-[11px] font-semibold no-underline transition-opacity hover:opacity-80"
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
            elements: {
              avatarBox: "w-7 h-7",
              userButtonPopoverCard:
                "rounded-[10px] border border-[#ebebeb] shadow-sm",
            },
          }}
        />
        <div className="min-w-0 flex-1">
          <div
            className="text-xs font-semibold truncate"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            {displayName}
          </div>
          <div
            className="text-[11px]"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
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
    </aside>
  );
}
