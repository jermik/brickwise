"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Lead, LeadFilters, LeadStatus } from "@/lib/crm/types";
import { BUSINESS_CATEGORIES, STATUS_CONFIG } from "@/lib/crm/types";
import { StatusBadge } from "./status-badge";
import { ScoreRing } from "./score-bar";

type SortKey =
  | "businessName"
  | "city"
  | "websiteScore"
  | "seoScore"
  | "automationScore"
  | "estimatedValue"
  | "nextFollowUpAt"
  | "updatedAt"
  | "createdAt";

const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, cfg]) => ({
  value: value as LeadStatus,
  label: cfg.label,
}));

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function compositeOpportunity(lead: Lead): number {
  const w = lead.websiteScore ?? 50;
  const s = lead.seoScore ?? 50;
  const a = lead.automationScore ?? 50;
  return Math.round((300 - w - s - a) / 3);
}

interface LeadTableProps {
  leads: Lead[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const [filters, setFilters] = useState<LeadFilters>({});
  const [includeDNC, setIncludeDNC] = useState(false);
  const [followUpDueOnly, setFollowUpDueOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const cities = useMemo(() => [...new Set(leads.map((l) => l.city))].sort(), [leads]);

  const filtered = useMemo(() => {
    let out = [...leads];

    // DNC default-exclude
    if (!includeDNC) {
      out = out.filter((l) => !l.doNotContact && !l.unsubscribed && l.status !== "do_not_contact");
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      out = out.filter(
        (l) =>
          l.businessName.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q),
      );
    }
    if (filters.city) out = out.filter((l) => l.city === filters.city);
    if (filters.category) out = out.filter((l) => l.category === filters.category);
    if (filters.status) out = out.filter((l) => l.status === filters.status);

    if (followUpDueOnly) {
      const now = new Date();
      out = out.filter(
        (l) => l.nextFollowUpAt && new Date(l.nextFollowUpAt) <= now,
      );
    }

    out.sort((a, b) => {
      let va: string | number = "";
      let vb: string | number = "";
      switch (sortKey) {
        case "businessName":
        case "city":
          va = a[sortKey] ?? "";
          vb = b[sortKey] ?? "";
          break;
        case "websiteScore":
        case "seoScore":
        case "automationScore":
        case "estimatedValue":
          va = a[sortKey] ?? -1;
          vb = b[sortKey] ?? -1;
          break;
        case "nextFollowUpAt":
          va = a.nextFollowUpAt ? new Date(a.nextFollowUpAt).getTime() : Number.MAX_SAFE_INTEGER;
          vb = b.nextFollowUpAt ? new Date(b.nextFollowUpAt).getTime() : Number.MAX_SAFE_INTEGER;
          break;
        case "updatedAt":
        case "createdAt":
          va = new Date(a[sortKey]).getTime();
          vb = new Date(b[sortKey]).getTime();
          break;
      }
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return out;
  }, [leads, filters, sortKey, sortDir, includeDNC, followUpDueOnly]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "businessName" || key === "city" ? "asc" : "desc");
    }
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

  const filtersActive =
    !!filters.city || !!filters.category || !!filters.status || !!filters.search || includeDNC || followUpDueOnly;

  return (
    <div className="space-y-4">
      {/* Filter row */}
      <div className="flex flex-wrap gap-2 items-center">
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
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filters.category ?? ""}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value || undefined }))}
          style={inputStyle}
        >
          <option value="">All categories</option>
          {BUSINESS_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filters.status ?? ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: (e.target.value || undefined) as LeadStatus | undefined }))
          }
          style={inputStyle}
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          style={inputStyle}
        >
          <option value="updatedAt">Sort: most recent</option>
          <option value="businessName">Sort: name (A–Z)</option>
          <option value="websiteScore">Sort: website score</option>
          <option value="seoScore">Sort: SEO score</option>
          <option value="automationScore">Sort: automation score</option>
          <option value="estimatedValue">Sort: estimated value</option>
          <option value="nextFollowUpAt">Sort: next follow-up</option>
        </select>
        <button
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="text-xs px-2 rounded"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.7)", border: "1px solid #2A2420" }}
          title={sortDir === "asc" ? "Ascending" : "Descending"}
        >
          {sortDir === "asc" ? "↑" : "↓"}
        </button>
        <label className="flex items-center gap-1.5 cursor-pointer text-[11px]" style={{ color: "rgba(242,237,230,0.55)" }}>
          <input type="checkbox" checked={followUpDueOnly} onChange={(e) => setFollowUpDueOnly(e.target.checked)} style={{ accentColor: "#f59e0b" }} />
          Due now
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer text-[11px]" style={{ color: "rgba(242,237,230,0.55)" }}>
          <input type="checkbox" checked={includeDNC} onChange={(e) => setIncludeDNC(e.target.checked)} style={{ accentColor: "#f87171" }} />
          Include DNC
        </label>
        {filtersActive && (
          <button
            onClick={() => {
              setFilters({});
              setIncludeDNC(false);
              setFollowUpDueOnly(false);
            }}
            className="text-xs px-3 rounded"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.6)", border: "1px solid #2A2420" }}
          >
            Clear
          </button>
        )}
        <span className="ml-auto font-mono text-xs self-center" style={{ color: "rgba(242,237,230,0.4)" }}>
          {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid #2A2420" }}>
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #2A2420", background: "#0D0B08" }}>
              {[
                { key: "businessName", label: "Business" },
                { key: null, label: "Category" },
                { key: "city", label: "City" },
                { key: null, label: "Status" },
                { key: "websiteScore", label: "Site" },
                { key: "seoScore", label: "SEO" },
                { key: "estimatedValue", label: "€ value" },
                { key: "nextFollowUpAt", label: "Follow-up" },
                { key: null, label: "" },
              ].map(({ key, label }) => (
                <th
                  key={label}
                  onClick={key ? () => toggleSort(key as SortKey) : undefined}
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
                  {leads.length === 0 ? "No leads yet — add one or import a CSV." : "No leads match your filters."}
                </td>
              </tr>
            )}
            {filtered.map((lead, i) => {
              const overdue = lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < new Date();
              return (
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
                      {lead.doNotContact && <span title="Do not contact" style={{ color: "#f87171" }}>✕</span>}
                      <Link href={`/crm/leads/${lead.id}`} className="font-medium hover:underline" style={{ color: "#F2EDE6" }}>
                        {lead.businessName}
                      </Link>
                      {compositeOpportunity(lead) > 50 && lead.estimatedValue && lead.estimatedValue > 3000 && (
                        <span title="High opportunity" className="text-xs" style={{ color: "#f59e0b" }}>★</span>
                      )}
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
                    <span className="font-mono text-xs" style={{ color: lead.estimatedValue ? "#34d399" : "rgba(242,237,230,0.3)" }}>
                      {lead.estimatedValue ? `€${(lead.estimatedValue / 1000).toFixed(1)}k` : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-mono text-xs" style={{ color: overdue ? "#f87171" : "rgba(242,237,230,0.5)" }}>
                      {formatDate(lead.nextFollowUpAt)}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/crm/leads/${lead.id}`}
                      className="text-xs px-2.5 py-1 rounded"
                      style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
