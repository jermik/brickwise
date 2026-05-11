"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { discoverLeadsAction, importDiscoveredAction } from "@/lib/crm/actions";
import { BUSINESS_CATEGORIES, type BusinessCategory } from "@/lib/crm/types";
import { DISCOVERY_COUNTRIES } from "@/lib/crm/discovery-categories";
import type { DiscoveredBusiness } from "@/lib/crm/discovery";

export function DiscoverySearch() {
  const router = useRouter();
  const [searching, startSearch] = useTransition();
  const [importing, startImport] = useTransition();

  const [country, setCountry] = useState<string>("Netherlands");
  const [city, setCity] = useState<string>("");
  const [category, setCategory] = useState<BusinessCategory>("Gym");

  const [results, setResults] = useState<DiscoveredBusiness[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [geocoded, setGeocoded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const inputStyle = {
    background: "#131109",
    border: "1px solid #2A2420",
    color: "#F2EDE6",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 13,
    outline: "none",
  };

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) {
      setError("Enter a city.");
      return;
    }
    setError(null);
    setImportMsg(null);
    setResults([]);
    setSelected(new Set());
    startSearch(async () => {
      const r = await discoverLeadsAction(country, city.trim(), category);
      if (r.error) {
        setError(r.error);
        setGeocoded(null);
        return;
      }
      setGeocoded(r.geocoded);
      setResults(r.businesses);
      // Pre-select everything that isn't already imported.
      setSelected(
        new Set(r.businesses.filter((b) => !b.alreadyImported).map((b) => b.externalId)),
      );
    });
  }

  function toggleAll(check: boolean) {
    if (check) {
      setSelected(
        new Set(results.filter((b) => !b.alreadyImported).map((b) => b.externalId)),
      );
    } else {
      setSelected(new Set());
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleImport() {
    const picked = results.filter((b) => selected.has(b.externalId) && !b.alreadyImported);
    if (picked.length === 0) {
      setError("Select at least one business that isn't already imported.");
      return;
    }
    setError(null);
    setImportMsg(null);
    startImport(async () => {
      const res = await importDiscoveredAction(picked, { autoAnalyze });
      if (res.errors.length > 0 && res.imported === 0) {
        setError(res.errors.join(" "));
        return;
      }
      setImportMsg(
        `Imported ${res.imported}${res.skipped ? ` · ${res.skipped} skipped (duplicate)` : ""}${
          res.analyzed ? ` · ${res.analyzed} analysed` : ""
        }`,
      );
      // Mark just-imported as alreadyImported so the UI updates without a refetch
      setResults((rs) =>
        rs.map((r) =>
          picked.some((p) => p.externalId === r.externalId) ? { ...r, alreadyImported: true } : r,
        ),
      );
      setSelected(new Set());
      router.refresh();
    });
  }

  const eligible = results.filter((r) => !r.alreadyImported);

  return (
    <div className="space-y-6">
      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="rounded-lg p-4 space-y-3"
        style={{ background: "#131109", border: "1px solid #2A2420" }}
      >
        <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          Discover local businesses
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.5)" }}>Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} style={{ ...inputStyle, width: "100%" }}>
              {DISCOVERY_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.5)" }}>City / region</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Rotterdam"
              style={{ ...inputStyle, width: "100%" }}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.5)" }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BusinessCategory)}
              style={{ ...inputStyle, width: "100%" }}
            >
              {BUSINESS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={searching}
              className="w-full px-4 py-2 rounded text-sm font-medium"
              style={{ background: "#f59e0b", color: "#0A0907", opacity: searching ? 0.6 : 1 }}
            >
              {searching ? "Searching…" : "Find businesses"}
            </button>
          </div>
        </div>
        {geocoded && (
          <p className="font-mono text-[12px]" style={{ color: "rgba(242,237,230,0.4)" }}>
            Geocoded: {geocoded}
          </p>
        )}
      </form>

      {/* Errors / messages */}
      {error && (
        <div className="rounded px-3 py-2 text-sm" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
          {error}
        </div>
      )}
      {importMsg && (
        <div className="rounded px-3 py-2 text-sm" style={{ background: "rgba(16,185,129,0.08)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}>
          {importMsg} ·{" "}
          <a href="/crm/leads" className="underline">View leads →</a>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <p className="text-sm" style={{ color: "rgba(242,237,230,0.6)" }}>
              <span className="font-mono">{results.length}</span> result{results.length !== 1 ? "s" : ""} ·{" "}
              <span className="font-mono">{eligible.length}</span> new ·{" "}
              <span className="font-mono">{results.length - eligible.length}</span> already imported
            </p>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs" style={{ color: "rgba(242,237,230,0.55)" }}>
                <input type="checkbox" checked={autoAnalyze} onChange={(e) => setAutoAnalyze(e.target.checked)} style={{ accentColor: "#10b981" }} />
                Auto-analyse after import
              </label>
              <button
                type="button"
                onClick={() => toggleAll(selected.size === 0)}
                className="text-xs px-3 py-1.5 rounded"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.7)", border: "1px solid #2A2420" }}
              >
                {selected.size === 0 ? "Select all eligible" : "Deselect all"}
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={importing || selected.size === 0}
                className="px-4 py-1.5 rounded text-sm font-medium"
                style={{ background: "#f59e0b", color: "#0A0907", opacity: importing || selected.size === 0 ? 0.5 : 1 }}
              >
                {importing ? "Importing…" : `Import ${selected.size} → CRM`}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid #2A2420" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #2A2420", background: "#0D0B08" }}>
                  {["", "Business", "Address", "Website", "Phone", "Map"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((b, i) => {
                  const isSelected = selected.has(b.externalId);
                  return (
                    <tr
                      key={b.externalId}
                      style={{
                        borderBottom: i < results.length - 1 ? "1px solid #1e1c18" : undefined,
                        opacity: b.alreadyImported ? 0.45 : 1,
                      }}
                    >
                      <td className="px-3 py-3 w-8">
                        <input
                          type="checkbox"
                          disabled={b.alreadyImported}
                          checked={isSelected}
                          onChange={() => toggle(b.externalId)}
                          style={{ accentColor: "#f59e0b" }}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium" style={{ color: "#F2EDE6" }}>{b.businessName}</div>
                        {b.alreadyImported && (
                          <div className="text-[12px] mt-0.5" style={{ color: "#34d399" }}>✓ already in CRM</div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-xs" style={{ color: "rgba(242,237,230,0.55)" }}>
                        {b.address ?? "—"}
                      </td>
                      <td className="px-3 py-3">
                        {b.website ? (
                          <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: "#f59e0b" }}>
                            {b.website.replace(/^https?:\/\//, "").slice(0, 30)}
                          </a>
                        ) : (
                          <span className="text-[12px] font-mono" style={{ color: "rgba(248,113,113,0.7)" }}>NO WEBSITE</span>
                        )}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>
                        {b.phone ?? "—"}
                      </td>
                      <td className="px-3 py-3">
                        {b.googleMapsUrl ? (
                          <a href={b.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: "#60a5fa" }}>
                            ↗
                          </a>
                        ) : (
                          <span className="text-xs" style={{ color: "rgba(242,237,230,0.3)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {results.length === 0 && !searching && !error && (
        <div className="rounded-lg px-6 py-10 text-center" style={{ border: "2px dashed #2A2420" }}>
          <p className="text-sm" style={{ color: "rgba(242,237,230,0.4)" }}>
            Pick a country, city, and category — then click <span style={{ color: "#f59e0b" }}>Find businesses</span>.
          </p>
          <p className="text-[11px] mt-2" style={{ color: "rgba(242,237,230,0.3)" }}>
            Discovery uses OpenStreetMap data. Coverage varies by region and category.
          </p>
        </div>
      )}
    </div>
  );
}
