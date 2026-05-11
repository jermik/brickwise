"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  findBusinessesAction,
  importDiscoveredBusinessAction,
} from "@/lib/crm/actions";
import type { DiscoveredBusinessV2 } from "@/lib/crm/discovery/places";
import {
  DISCOVERY_LOCATIONS,
  DISCOVERY_NICHES,
  OTHER_OPTION,
  findCountry,
} from "@/lib/crm/discovery/locations";

type LimitOption = 10 | 25 | 50;

const LIMIT_OPTIONS: LimitOption[] = [10, 25, 50];

type CardState =
  | { kind: "idle" }
  | { kind: "importing" }
  | { kind: "imported"; leadId: string }
  | { kind: "duplicate"; leadId: string }
  | { kind: "error"; message: string };

const inputStyle: React.CSSProperties = {
  background: "#131109",
  border: "1px solid #2A2420",
  color: "#F2EDE6",
  borderRadius: 6,
  padding: "10px 14px",
  fontSize: 14,
  outline: "none",
  width: "100%",
};

const smallInputStyle: React.CSSProperties = {
  ...inputStyle,
  padding: "6px 10px",
  fontSize: 12,
  width: "auto",
};

export function FindBusinesses() {
  const router = useRouter();
  const [searching, startSearch] = useTransition();

  // Country (dropdown only — pick from curated list)
  const [country, setCountry] = useState<string>(DISCOVERY_LOCATIONS[0].country);

  // City (dropdown of country.cities + "Other" → reveals text input)
  const [citySelect, setCitySelect] = useState<string>("");
  const [cityCustom, setCityCustom] = useState<string>("");

  // Niche (dropdown of presets + "Other" → reveals text input)
  const [nicheSelect, setNicheSelect] = useState<string>("");
  const [nicheCustom, setNicheCustom] = useState<string>("");

  const [limit, setLimit] = useState<LimitOption>(25);
  const [enrich, setEnrich] = useState(true);

  const [results, setResults] = useState<DiscoveredBusinessV2[]>([]);
  const [query, setQuery] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [bulkBusy, setBulkBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const countryConfig = useMemo(() => findCountry(country), [country]);
  const cities = countryConfig?.cities ?? [];

  const cityValue =
    citySelect === OTHER_OPTION ? cityCustom.trim() : citySelect.trim();
  const nicheValue =
    nicheSelect === OTHER_OPTION ? nicheCustom.trim() : nicheSelect.trim();
  const canSearch = cityValue.length > 0 && nicheValue.length > 0;

  function setCardState(id: string, state: CardState) {
    setCardStates((s) => ({ ...s, [id]: state }));
  }

  function handleCountryChange(next: string) {
    setCountry(next);
    setCitySelect("");
    setCityCustom("");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!canSearch) {
      setError("Pick a niche and a city.");
      return;
    }
    setError(null);
    setResults([]);
    setCardStates({});
    setSelected(new Set());
    setQuery(null);
    startSearch(async () => {
      const r = await findBusinessesAction({
        niche: nicheValue,
        city: cityValue,
        country,
        regionCode: countryConfig?.regionCode,
        limit,
      });
      if (!r.ok && r.results.length === 0) {
        setError(r.error ?? "Search failed.");
        return;
      }
      setQuery(r.query);
      setResults(r.results);
      if (r.error) setError(r.error);
    });
  }

  async function importOne(business: DiscoveredBusinessV2, then?: "audit") {
    if (cardStates[business.externalId]?.kind === "importing") return;
    setCardState(business.externalId, { kind: "importing" });
    const res = await importDiscoveredBusinessAction({
      business,
      niche: nicheValue,
      city: cityValue,
      query: query ?? `${nicheValue} in ${cityValue}`,
      enrich,
    });
    if (res.kind === "created" && res.leadId) {
      setCardState(business.externalId, { kind: "imported", leadId: res.leadId });
      if (then === "audit") {
        // ?auto=1 tells the audit page to kick off Auto-audit on mount.
        router.push(`/crm/leads/${res.leadId}/audit?auto=1`);
      }
    } else if (res.kind === "duplicate" && res.leadId) {
      setCardState(business.externalId, { kind: "duplicate", leadId: res.leadId });
    } else {
      setCardState(business.externalId, {
        kind: "error",
        message: res.message ?? "Import failed.",
      });
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function importSelected() {
    const targets = results.filter(
      (b) => selected.has(b.externalId) && !b.alreadyImported,
    );
    if (targets.length === 0) return;
    setBulkBusy(true);
    for (const b of targets) {
      // sequential for politeness with enrichment fetches
      // eslint-disable-next-line no-await-in-loop
      await importOne(b);
    }
    setBulkBusy(false);
    setSelected(new Set());
    router.refresh();
  }

  const eligible = results.filter((r) => !r.alreadyImported);

  return (
    <div className="space-y-6">
      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="rounded-lg p-5 space-y-4"
        style={{ background: "#131109", border: "1px solid #2A2420" }}
      >
        <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          Find Businesses
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Country */}
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.55)" }}>Country</label>
            <select
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
              style={inputStyle}
            >
              {DISCOVERY_LOCATIONS.map((c) => (
                <option key={c.regionCode} value={c.country}>
                  {c.country}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.55)" }}>City</label>
            <select
              value={citySelect}
              onChange={(e) => {
                setCitySelect(e.target.value);
                if (e.target.value !== OTHER_OPTION) setCityCustom("");
              }}
              style={inputStyle}
              required
            >
              <option value="" disabled>
                Pick a city…
              </option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value={OTHER_OPTION}>Other (type your own)…</option>
            </select>
            {citySelect === OTHER_OPTION && (
              <input
                value={cityCustom}
                onChange={(e) => setCityCustom(e.target.value)}
                placeholder={`City in ${country}`}
                style={inputStyle}
                autoFocus
              />
            )}
          </div>

          {/* Niche */}
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.55)" }}>Niche</label>
            <select
              value={nicheSelect}
              onChange={(e) => {
                setNicheSelect(e.target.value);
                if (e.target.value !== OTHER_OPTION) setNicheCustom("");
              }}
              style={inputStyle}
              required
            >
              <option value="" disabled>
                Pick a niche…
              </option>
              {DISCOVERY_NICHES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
              <option value={OTHER_OPTION}>Other (type your own)…</option>
            </select>
            {nicheSelect === OTHER_OPTION && (
              <input
                value={nicheCustom}
                onChange={(e) => setNicheCustom(e.target.value)}
                placeholder="e.g. piano teachers"
                style={inputStyle}
                autoFocus
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-end">
          <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: "rgba(242,237,230,0.55)" }}>
            <input
              type="checkbox"
              checked={enrich}
              onChange={(e) => setEnrich(e.target.checked)}
              style={{ accentColor: "#10b981" }}
            />
            Enrich socials/email on import
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value) as LimitOption)}
            style={smallInputStyle}
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} results
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={searching || !canSearch}
            className="px-5 py-2 rounded text-sm font-medium"
            style={{
              background: "#f59e0b",
              color: "#0A0907",
              opacity: searching || !canSearch ? 0.6 : 1,
            }}
          >
            {searching ? "Searching…" : "Find businesses"}
          </button>
        </div>
      </form>

      {/* Status messages */}
      {error && (
        <div className="rounded px-3 py-2 text-sm" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
          {error}
        </div>
      )}

      {/* Bulk action bar */}
      {results.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm" style={{ color: "rgba(242,237,230,0.6)" }}>
            <span className="font-mono">{results.length}</span> result{results.length !== 1 && "s"} for{" "}
            <span style={{ color: "#F2EDE6" }}>{query}</span>
            {" · "}
            <span className="font-mono">{eligible.length}</span> new
            {results.length - eligible.length > 0 && (
              <>
                {" · "}
                <span className="font-mono">{results.length - eligible.length}</span> already in CRM
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            {eligible.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const allEligibleSelected =
                    selected.size > 0 && eligible.every((r) => selected.has(r.externalId));
                  if (allEligibleSelected) {
                    setSelected(new Set());
                  } else {
                    setSelected(new Set(eligible.map((r) => r.externalId)));
                  }
                }}
                className="text-xs px-3 py-1.5 rounded"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.7)", border: "1px solid #2A2420" }}
              >
                {selected.size > 0 && eligible.every((r) => selected.has(r.externalId))
                  ? "Deselect all"
                  : `Select all (${eligible.length})`}
              </button>
            )}
            <button
              type="button"
              onClick={importSelected}
              disabled={bulkBusy || selected.size === 0}
              className="px-4 py-1.5 rounded text-sm font-medium"
              style={{
                background: selected.size === 0 || bulkBusy ? "rgba(245,158,11,0.25)" : "#f59e0b",
                color: "#0A0907",
                opacity: selected.size === 0 || bulkBusy ? 0.6 : 1,
              }}
            >
              {bulkBusy ? "Importing…" : `Import ${selected.size || ""} selected`}
            </button>
          </div>
        </div>
      )}

      {/* Results grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((b) => (
            <ResultCard
              key={b.externalId}
              business={b}
              state={cardStates[b.externalId] ?? { kind: "idle" }}
              selected={selected.has(b.externalId)}
              onToggleSelect={() => toggleSelect(b.externalId)}
              onImport={() => importOne(b)}
              onImportAndAudit={() => importOne(b, "audit")}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {results.length === 0 && !searching && !error && (
        <div className="rounded-lg px-6 py-16 text-center" style={{ border: "2px dashed #2A2420" }}>
          <p className="text-sm" style={{ color: "rgba(242,237,230,0.5)" }}>
            Pick a country, city, and niche, then click <span style={{ color: "#f59e0b" }}>Find businesses</span>.
          </p>
          <p className="text-[11px] mt-2" style={{ color: "rgba(242,237,230,0.3)" }}>
            Powered by Google Places. Results scope to the country you pick. No bulk send.
          </p>
        </div>
      )}
    </div>
  );
}

interface ResultCardProps {
  business: DiscoveredBusinessV2;
  state: CardState;
  selected: boolean;
  onToggleSelect: () => void;
  onImport: () => void;
  onImportAndAudit: () => void;
}

function ResultCard({
  business: b,
  state,
  selected,
  onToggleSelect,
  onImport,
  onImportAndAudit,
}: ResultCardProps) {
  const importedOrDup = state.kind === "imported" || state.kind === "duplicate" || !!b.alreadyImported;
  const importing = state.kind === "importing";
  const ratingLabel =
    typeof b.rating === "number"
      ? `${b.rating.toFixed(1)}${b.ratingCount ? ` · ${b.ratingCount}` : ""}`
      : null;
  const websiteHost = b.websiteUri?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const niceType = b.primaryType
    ? b.primaryType.replace(/_/g, " ")
    : b.types[0]?.replace(/_/g, " ");

  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-3 transition-colors"
      style={{
        background: "#0F0D08",
        border: `1px solid ${selected ? "rgba(245,158,11,0.45)" : "#2A2420"}`,
        opacity: importedOrDup ? 0.78 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium truncate" style={{ color: "#F2EDE6" }} title={b.businessName}>
            {b.businessName}
          </div>
          {niceType && (
            <div className="text-[11px] capitalize" style={{ color: "rgba(242,237,230,0.45)" }}>
              {niceType}
            </div>
          )}
        </div>
        {!importedOrDup && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            style={{ accentColor: "#f59e0b" }}
            aria-label="Select for batch import"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        {ratingLabel && (
          <span
            className="px-2 py-0.5 rounded font-mono"
            style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" }}
            title="Google rating · review count"
          >
            ★ {ratingLabel}
          </span>
        )}
        {b.googleMapsUri && (
          <a
            href={b.googleMapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 rounded"
            style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.25)" }}
          >
            Maps ↗
          </a>
        )}
      </div>

      {b.formattedAddress && (
        <div className="text-xs" style={{ color: "rgba(242,237,230,0.55)" }}>
          {b.formattedAddress}
        </div>
      )}

      <div className="text-xs space-y-1">
        {websiteHost ? (
          <a
            href={b.websiteUri}
            target="_blank"
            rel="noopener noreferrer"
            className="block underline truncate"
            style={{ color: "#f59e0b" }}
            title={b.websiteUri}
          >
            {websiteHost}
          </a>
        ) : (
          <span className="font-mono text-[12px]" style={{ color: "rgba(248,113,113,0.7)" }}>
            NO WEBSITE
          </span>
        )}
        {b.phone && (
          <div className="font-mono" style={{ color: "rgba(242,237,230,0.55)" }}>
            {b.phone}
          </div>
        )}
      </div>

      {b.shortDescription && (
        <p className="text-[11px] leading-snug" style={{ color: "rgba(242,237,230,0.5)" }}>
          {b.shortDescription}
        </p>
      )}

      {/* Status row */}
      {importedOrDup && (
        <div className="flex items-center gap-2 text-[11px]">
          {state.kind === "imported" && state.leadId && (
            <a
              href={`/crm/leads/${state.leadId}`}
              className="underline"
              style={{ color: "#34d399" }}
            >
              ✓ Imported · open lead
            </a>
          )}
          {state.kind === "duplicate" && state.leadId && (
            <a
              href={`/crm/leads/${state.leadId}`}
              className="underline"
              style={{ color: "#60a5fa" }}
            >
              Already in CRM · open lead
            </a>
          )}
          {state.kind !== "imported" && state.kind !== "duplicate" && b.alreadyImported && (
            <span style={{ color: "rgba(52,211,153,0.85)" }}>Already in CRM</span>
          )}
        </div>
      )}
      {state.kind === "error" && (
        <div className="text-[11px]" style={{ color: "#f87171" }}>
          {state.message}
        </div>
      )}

      {/* CTAs */}
      {!importedOrDup && (
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          <button
            type="button"
            onClick={onImportAndAudit}
            disabled={importing}
            className="flex-1 px-3 py-1.5 rounded text-xs font-medium transition-opacity"
            style={{
              background: "#f59e0b",
              color: "#0A0907",
              opacity: importing ? 0.6 : 1,
            }}
          >
            {importing ? "Importing…" : "Import + Audit"}
          </button>
          <button
            type="button"
            onClick={onImport}
            disabled={importing}
            className="px-3 py-1.5 rounded text-xs transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(242,237,230,0.85)",
              border: "1px solid #2A2420",
              opacity: importing ? 0.6 : 1,
            }}
          >
            Import
          </button>
        </div>
      )}
    </div>
  );
}
