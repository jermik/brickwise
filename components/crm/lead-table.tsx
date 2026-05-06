"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Lead, LeadFilters, LeadStatus } from "@/lib/crm/types";
import { BUSINESS_CATEGORIES, STATUS_CONFIG } from "@/lib/crm/types";
import { StatusBadge } from "./status-badge";
import { ScoreRing } from "./score-bar";

interface LeadTableProps {
  leads: Lead[];
}

const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, cfg]) => ({
  value: value as LeadStatus,
  label: cfg.label,
}));

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

export function LeadTable({ leads }: LeadTableProps) {
  const [filters, setFilters] = useState<LeadFilters>({});
  const [sortKey, setSortKey] = useState<"businessName" | "city" | "websiteScore" | "createdAt">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const cities = useMemo(() => [...new Set(leads.map((l) => l.city))].sort(), [leads]);

  const filtered = useMemo(() => {
    let out = [...leads];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      out = out.filter(
        (l) =>
          l.businessName.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q)
      );
    }
    if (filters.city) out = out.filter((l) => l.city === filters.city);
    if (filters.category) out = out.filter((l) => l.category === filters.category);
    if (filters.status) out = out.filter((l) => l.status === filters.status);

    out.sort((a, b) => {
      const va = (a as unknown as Record<string, unknown>)[sortKey] ?? "";
      const vb = (b as unknown as Record<string, unknown>)[sortKey] ?? "";
      const cmp = String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return out;
  }, [leads, filters, sortKey, sortDir]);

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const inputStyle = {
    background: "#131109",
    border: "1px solid #2A2420",
    color: "#F2EDE6",
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 12,
    outline: "none",
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          placeholder="Search businesses…"
          value={filters.search ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined }))}
          style={{ ...inputStyle, minWidth: 200 }}
        />
        <select
          value={filters.city ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value || undefined }))}
          style={inputStyle}
        >
          <option value="">All cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filters.category ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value || undefined }))}
          style={inputStyle}
        >
          <option value="">All categories</option>
          {BUSINESS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filters.status ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, status: (e.target.value || undefined) as LeadStatus | undefined }))}
          style={inputStyle}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {(filters.city || filters.category || filters.status || filters.search) && (
          <button
            onClick={() => setFilters({})}
            className="text-xs px-3 rounded transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.6)", border: "1px solid #2A2420" }}
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto font-mono text-xs self-center" style={{ color: "rgba(242,237,230,0.4)" }}>
          {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid #2A2420" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #2A2420", background: "#0D0B08" }}>
              {[
                { key: "businessName", label: "Business" },
                { key: null, label: "Category" },
                { key: "city", label: "City" },
                { key: null, label: "Status" },
                { key: "websiteScore", label: "Site" },
                { key: null, label: "SEO" },
                { key: null, label: "Last contact" },
                { key: null, label: "Follow-up" },
                { key: null, label: "" },
              ].map(({ key, label }) => (
                <th
                  key={label}
                  onClick={key ? () => toggleSort(key as typeof sortKey) : undefined}
                  className={`px-3 py-2.5 text-left font-mono text-[10px] tracking-widest uppercase select-none ${key ? "cursor-pointer hover:opacity-80" : ""}`}
                  style={{ color: "rgba(242,237,230,0.4)" }}
                >
                  {label}
                  {key && sortKey === key && (sortDir === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-10 text-center text-sm" style={{ color: "rgba(242,237,230,0.3)" }}>
                  No leads match your filters.
                </td>
              </tr>
            )}
            {filtered.map((lead, i) => (
              <tr
                key={lead.id}
                style={{
                  borderBottom: i < filtered.length - 1 ? "1px solid #1e1c18" : undefined,
                  background: lead.doNotContact ? "rgba(248,113,113,0.04)" : undefined,
                  opacity: lead.doNotContact ? 0.6 : 1,
                }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    {lead.doNotContact && (
                      <span title="Do not contact" className="text-xs" style={{ color: "#f87171" }}>✕</span>
                    )}
                    <Link
                      href={`/crm/leads/${lead.id}`}
                      className="font-medium hover:underline"
                      style={{ color: "#F2EDE6" }}
                    >
                      {lead.businessName}
                    </Link>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs" style={{ color: "rgba(242,237,230,0.55)" }}>{lead.category}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="font-mono text-xs" style={{ color: "rgba(242,237,230,0.7)" }}>{lead.city}</span>
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={lead.status} size="sm" />
                </td>
                <td className="px-3 py-3">
                  <ScoreRing value={lead.websiteScore} size={32} />
                </td>
                <td className="px-3 py-3">
                  <ScoreRing value={lead.seoScore} size={32} />
                </td>
                <td className="px-3 py-3">
                  <span className="font-mono text-xs" style={{ color: "rgba(242,237,230,0.5)" }}>
                    {formatDate(lead.lastContactedAt)}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className="font-mono text-xs"
                    style={{
                      color: lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < new Date()
                        ? "#f87171"
                        : "rgba(242,237,230,0.5)",
                    }}
                  >
                    {formatDate(lead.nextFollowUpAt)}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <Link
                    href={`/crm/leads/${lead.id}`}
                    className="text-xs px-2.5 py-1 rounded transition-colors"
                    style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
                  >
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
