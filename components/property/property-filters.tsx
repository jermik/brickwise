"use client";

import { FilterState, SortKey, ViewMode } from "@/lib/types";

export const DEFAULT_FILTERS: FilterState = {
  minYield: 0,
  risk: "All",
  valueStatus: "All",
  country: "All",
  maxPrice: null,
  platform: "All",
  propertyType: "All",
  minOccupancy: 0,
};

function isFiltered(f: FilterState): boolean {
  return (
    f.minYield > 0 || f.risk !== "All" || f.valueStatus !== "All" ||
    f.platform !== "All" || f.propertyType !== "All" ||
    f.minOccupancy > 0 || f.maxPrice !== null
  );
}

interface PropertyFiltersProps {
  filters: FilterState;
  sortKey: SortKey;
  viewMode: ViewMode;
  onFiltersChange: (f: FilterState) => void;
  onSortChange: (s: SortKey) => void;
  onViewModeChange: (v: ViewMode) => void;
  resultCount: number;
}

function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex-shrink-0">
      <div className="text-[10px] font-semibold uppercase tracking-[0.8px] mb-1.5" style={{ color: "#a3a3a3" }}>
        {label}
      </div>
      <div className="flex gap-1 flex-wrap">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className="px-2.5 py-1 rounded-[5px] text-[12px] font-medium transition-all"
              style={{
                border: `1px solid ${active ? "#111" : "#e5e5e5"}`,
                background: active ? "#111" : "transparent",
                color: active ? "#fff" : "#737373",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const Sep = () => (
  <div className="w-px h-7 self-end mb-0.5 flex-shrink-0" style={{ background: "#ebebeb" }} />
);

export function PropertyFilters({
  filters,
  sortKey,
  viewMode,
  onFiltersChange,
  onSortChange,
  onViewModeChange,
  resultCount,
}: PropertyFiltersProps) {
  const set = (patch: Partial<FilterState>) => onFiltersChange({ ...filters, ...patch });
  const filtered = isFiltered(filters);

  return (
    <div className="py-3 px-6">
      {/* Row 1: Primary filters */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3 mb-3">
        <PillGroup
          label="Min. Yield"
          options={[
            { label: "Any", value: "0" },
            { label: "6%+", value: "6" },
            { label: "8%+", value: "8" },
            { label: "10%+", value: "10" },
          ]}
          value={String(filters.minYield)}
          onChange={(v) => set({ minYield: Number(v) })}
        />
        <Sep />
        <PillGroup
          label="Risk"
          options={[
            { label: "All", value: "All" },
            { label: "Low", value: "Low" },
            { label: "Medium", value: "Medium" },
          ]}
          value={filters.risk}
          onChange={(v) => set({ risk: v as FilterState["risk"] })}
        />
        <Sep />
        <PillGroup
          label="Value"
          options={[
            { label: "All", value: "All" },
            { label: "Undervalued", value: "undervalued" },
            { label: "Fair", value: "fair" },
            { label: "Overpriced", value: "overpriced" },
          ]}
          value={filters.valueStatus}
          onChange={(v) => set({ valueStatus: v as FilterState["valueStatus"] })}
        />
        <Sep />
        <PillGroup
          label="Platform"
          options={[
            { label: "All", value: "All" },
            { label: "RealT", value: "RealT" },
            { label: "Lofty", value: "Lofty" },
          ]}
          value={filters.platform}
          onChange={(v) => set({ platform: v as FilterState["platform"] })}
        />

        {/* Sort + count + view pushed right */}
        <div className="flex items-center gap-3 ml-auto self-end">
          <span className="text-[11px] flex-shrink-0" style={{ color: "#a3a3a3" }}>
            {resultCount} {resultCount === 1 ? "property" : "properties"}
          </span>

          <select
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="text-[12px] rounded-[6px] outline-none cursor-pointer"
            style={{
              background: "#fff",
              border: "1px solid #e5e5e5",
              color: "#111",
              padding: "5px 10px",
            }}
          >
            <option value="score">Best score</option>
            <option value="yield">Highest yield</option>
            <option value="price">Lowest token price</option>
            <option value="monthly">Highest monthly rent</option>
            <option value="payback">Fastest payback</option>
            <option value="occupancy">Highest occupancy</option>
            <option value="caprate">Highest cap rate</option>
          </select>

          {/* View toggle: grid / list / chart */}
          <div className="flex rounded-[6px] overflow-hidden flex-shrink-0" style={{ border: "1px solid #e5e5e5" }}>
            {(["grid", "list", "chart"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                title={mode === "grid" ? "Grid" : mode === "list" ? "List" : "Chart"}
                className="px-2.5 py-[7px] transition-colors"
                style={{ background: viewMode === mode ? "#f0f0f0" : "#fff", border: "none", cursor: "pointer" }}
              >
                {mode === "grid" ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <rect x="0.5" y="0.5" width="5" height="5" rx="1" fill={viewMode === "grid" ? "#1a1a1a" : "#a3a3a3"} />
                    <rect x="7.5" y="0.5" width="5" height="5" rx="1" fill={viewMode === "grid" ? "#1a1a1a" : "#a3a3a3"} />
                    <rect x="0.5" y="7.5" width="5" height="5" rx="1" fill={viewMode === "grid" ? "#1a1a1a" : "#a3a3a3"} />
                    <rect x="7.5" y="7.5" width="5" height="5" rx="1" fill={viewMode === "grid" ? "#1a1a1a" : "#a3a3a3"} />
                  </svg>
                ) : mode === "list" ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <rect x="0.5" y="1.5" width="12" height="2" rx="1" fill={viewMode === "list" ? "#1a1a1a" : "#a3a3a3"} />
                    <rect x="0.5" y="5.5" width="12" height="2" rx="1" fill={viewMode === "list" ? "#1a1a1a" : "#a3a3a3"} />
                    <rect x="0.5" y="9.5" width="12" height="2" rx="1" fill={viewMode === "list" ? "#1a1a1a" : "#a3a3a3"} />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="3" cy="9.5" r="2" fill={viewMode === "chart" ? "#1a1a1a" : "#a3a3a3"} />
                    <circle cx="7" cy="5.5" r="1.5" fill={viewMode === "chart" ? "#1a1a1a" : "#a3a3a3"} />
                    <circle cx="11.5" cy="2" r="1" fill={viewMode === "chart" ? "#1a1a1a" : "#a3a3a3"} />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Secondary filters */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <PillGroup
          label="Property Type"
          options={[
            { label: "All types", value: "All" },
            { label: "Single Family", value: "Single Family" },
            { label: "Multi Family", value: "Multi Family" },
            { label: "Condo", value: "Condo" },
            { label: "Commercial", value: "Commercial" },
          ]}
          value={filters.propertyType}
          onChange={(v) => set({ propertyType: v as FilterState["propertyType"] })}
        />
        <Sep />
        <PillGroup
          label="Occupancy"
          options={[
            { label: "Any", value: "0" },
            { label: "90%+", value: "90" },
            { label: "95%+", value: "95" },
            { label: "100%", value: "100" },
          ]}
          value={String(filters.minOccupancy)}
          onChange={(v) => set({ minOccupancy: Number(v) })}
        />
        <Sep />
        <PillGroup
          label="Max Token Price"
          options={[
            { label: "Any", value: "" },
            { label: "≤€50", value: "50" },
            { label: "≤€100", value: "100" },
            { label: "≤€200", value: "200" },
          ]}
          value={filters.maxPrice ? String(filters.maxPrice) : ""}
          onChange={(v) => set({ maxPrice: v ? Number(v) : null })}
        />

        {filtered && (
          <button
            onClick={() => onFiltersChange(DEFAULT_FILTERS)}
            className="self-end text-[11px] font-medium px-3 py-1.5 rounded-[5px] transition-opacity hover:opacity-75"
            style={{ background: "#fff5f5", color: "#dc2626", border: "1px solid #fecaca" }}
          >
            ✕ Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
