"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyRow } from "@/components/property/property-row";
import { PROPERTIES } from "@/lib/data/properties";
import { filterAndSort } from "@/lib/scoring";
import { FilterState, SortKey, ViewMode } from "@/lib/types";

const DEFAULT_FILTERS: FilterState = {
  minYield: 0,
  risk: "All",
  valueStatus: "All",
  country: "All",
  maxPrice: null,
  platform: "All",
};

export default function AnalyzerPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const results = useMemo(
    () => filterAndSort(PROPERTIES, filters, sortKey),
    [filters, sortKey]
  );

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Page header */}
        <div
          className="px-6 pt-7 pb-5"
          style={{ borderBottom: "1px solid #ebebeb" }}
        >
          <div
            className="text-[11px] font-medium uppercase tracking-[0.6px] mb-1.5"
            style={{ color: "#a3a3a3" }}
          >
            Explore
          </div>
          <h1
            className="text-[22px] font-bold tracking-[-0.5px]"
            style={{ color: "#111" }}
          >
            Property Analyzer
          </h1>
        </div>

        {/* Filters */}
        <div style={{ borderBottom: "1px solid #ebebeb" }}>
          <PropertyFilters
            filters={filters}
            sortKey={sortKey}
            viewMode={viewMode}
            onFiltersChange={setFilters}
            onSortChange={setSortKey}
            onViewModeChange={setViewMode}
            resultCount={results.length}
          />
        </div>

        {/* Results */}
        <div className="flex-1 px-6 py-5">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: "#f5f5f5" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 8.5L10 3l7 5.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V8.5z"
                    stroke="#a3a3a3"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 18v-6h6v6"
                    stroke="#a3a3a3"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div
                className="text-[14px] font-semibold mb-1.5"
                style={{ color: "#111" }}
              >
                No properties match
              </div>
              <div className="text-[12px] mb-4" style={{ color: "#a3a3a3" }}>
                Try adjusting your filters above
              </div>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-[12px] font-semibold px-4 py-2 rounded-[7px] transition-opacity hover:opacity-75"
                style={{ background: "#111", color: "#fff" }}
              >
                Reset filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div
              className="rounded-[10px] overflow-hidden"
              style={{ background: "#fff", border: "1px solid #ebebeb" }}
            >
              {/* List header */}
              <div
                className="flex items-center gap-4 px-5 py-3"
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                <div className="w-10 flex-shrink-0" />
                <div className="flex-1 text-[10px] font-semibold uppercase tracking-[0.6px]" style={{ color: "#a3a3a3" }}>
                  Property
                </div>
                <div className="w-24 text-[10px] font-semibold uppercase tracking-[0.6px] hidden sm:block" style={{ color: "#a3a3a3" }}>
                  Status
                </div>
                <div className="w-20 text-[10px] font-semibold uppercase tracking-[0.6px] hidden md:block" style={{ color: "#a3a3a3" }}>
                  Risk
                </div>
                <div className="w-16 text-[10px] font-semibold uppercase tracking-[0.6px] text-right" style={{ color: "#a3a3a3" }}>
                  Yield
                </div>
                <div className="w-20 text-[10px] font-semibold uppercase tracking-[0.6px] text-right hidden sm:block" style={{ color: "#a3a3a3" }}>
                  Token
                </div>
                <div className="w-20 text-[10px] font-semibold uppercase tracking-[0.6px] text-right hidden lg:block" style={{ color: "#a3a3a3" }}>
                  Monthly
                </div>
                <div className="w-5 flex-shrink-0" />
              </div>
              {results.map((p) => (
                <PropertyRow key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
