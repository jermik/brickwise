"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/crm", label: "Dashboard", icon: "▦", exact: true },
  { href: "/crm/discovery", label: "Discovery", icon: "✦" },
  { href: "/crm/leads", label: "Leads", icon: "◈" },
  { href: "/crm/follow-ups", label: "Follow-ups", icon: "◷" },
  { href: "/crm/offers", label: "Offers", icon: "◎" },
  { href: "/crm/leads/import", label: "Import CSV", icon: "↑" },
];

export function CRMSidebar() {
  const path = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? path === href : path.startsWith(href);
  }

  return (
    <aside
      className="flex shrink-0 flex-col py-4 md:py-6 w-14 md:w-60"
      style={{ borderRight: "1px solid #2A2420", background: "#0A0907" }}
    >
      {/* Brand */}
      <div className="px-2 md:px-5 mb-4 md:mb-8">
        <Link href="/growthos" className="hidden md:flex items-center gap-2 group">
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
        <Link href="/growthos" className="md:hidden flex justify-center" title="GrowthOS">
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-md font-display text-base"
            style={{
              background: "rgba(245,158,11,0.12)",
              color: "#f59e0b",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            G
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-1.5 md:px-3">
        {NAV.map(({ href, label, icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className="flex items-center gap-3 rounded-md px-2 md:px-3 py-2.5 text-sm transition-colors justify-center md:justify-start"
              style={{
                background: active ? "rgba(245,158,11,0.1)" : "transparent",
                color: active ? "#f59e0b" : "rgba(242,237,230,0.6)",
                borderLeft: active ? "2px solid #f59e0b" : "2px solid transparent",
              }}
            >
              <span className="w-4 text-center font-mono text-base">{icon}</span>
              <span className="hidden md:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="hidden md:block px-5 pt-4 space-y-2" style={{ borderTop: "1px solid #2A2420" }}>
        <p className="text-[10px] leading-relaxed" style={{ color: "rgba(242,237,230,0.3)" }}>
          Max 10 outreach/day.
          <br />
          Always personalise. Never bulk send.
        </p>
        <Link href="/growthos" className="text-[10px] underline" style={{ color: "rgba(242,237,230,0.4)" }}>
          About GrowthOS →
        </Link>
      </div>
    </aside>
  );
}
