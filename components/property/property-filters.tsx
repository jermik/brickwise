"use client";

import { FilterState, Platform, SortKey, ViewMode } from "@/lib/types";

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
    <div>
      <div
        className="text-[10px] font-semibold uppercase tracking-[0.8px] mb-1.5"
        style={{ color: "#a3a3a3" }}
      >
        {label}
      </div>
      <div className="flex gap-1">
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
                fontFamily: "var(--font-inter)",
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

export function PropertyFilters({
  filters,
  sortKey,
  viewMode,
  onFiltersChange,
  onSortChange,
  onViewModeChange,
  resultCount,
}: PropertyFiltersProps) {
  const set = (patch: Partial<FilterState>) =>
    onFiltersChange({ ...filters, ...patch });

  return (
    <div className="flex flex-wrap items-end gap-4 py-4 px-6">
      <PillGroup
        label="Min. yield"
        options={[
          { label: "Any", value: "0" },
          { label: "6%+", value: "6" },
          { label: "8%+", value: "8" },
          { label: "10%+", value: "10" },
        ]}
        value={String(filters.minYield)}
        onChange={(v) => set({ minYield: Number(v) })}
      />

      <div className="w-px h-7 self-end mb-0.5" style={{ background: "#ebebeb" }} />

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

      <div className="w-px h-7 self-end mb-0.5" style={{ background: "#ebebeb" }} />

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

      <div className="w-px h-7 self-end mb-0.5" style={{ background: "#ebebeb" }} />

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

      {/* Sort + count + view toggle pushed right */}
      <div className="flex items-center gap-3 ml-auto self-end">
        <span className="text-[11px]" style={{ color: "#a3a3a3" }}>
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
            fontFamily: "var(--font-inter)",
          }}
        >
          <option value="score">Best score</option>
          <option value="yield">Highest yield</option>
          <option value="price">Lowest price</option>
          <option value="monthly">Highest monthly</option>
        </select>

        <div
          className="flex rounded-[6px] overflow-hidden"
          style={{ border: "1px solid #e5e5e5" }}
        >
          {(["grid", "list"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className="px-2.5 py-[7px] transition-colors"
              style={{
                background: viewMode === mode ? "#f0f0f0" : "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {mode === "grid" ? (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <rect x="0.5" y="0.5" width="5" height="5" rx="1" fill={viewMode === "grid" ? "#1a1a1a" : "#a3a3a3"} />
                  <rect x="7.5" y="0.5" width="5" height="5" rx="1" fill={viewMode === "grid" ? "#1a1a1a" : "#a3a3a3"} />
                  <rect x="0.5" y="7.5" width="5" height="5" rx="1" fill={viewMode === "grid" ? "#1a1a1a" : "#a3a3a3"} />
                  <rect x="7.5" y="7.5" width="5" height="5" rx="1" fill={viewMode === "grid" ? "#1a1a1a" : "#a3a3a3"} />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <rect x="0.5" y="1.5" width="12" height="2" rx="1" fill={viewMode === "list" ? "#1a1a1a" : "#a3a3a3"} />
                  <rect x="0.5" y="5.5" width="12" height="2" rx="1" fill={viewMode === "list" ? "#1a1a1a" : "#a3a3a3"} />
                  <rect x="0.5" y="9.5" width="12" height="2" rx="1" fill={viewMode === "list" ? "#1a1a1a" : "#a3a3a3"} />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
