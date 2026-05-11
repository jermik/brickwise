"use client";

// Client-side filtered + searchable project list.
// Hydrates over server-rendered initial state, so SEO still gets all projects in the HTML.

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AlgorandCategory, AlgorandProject } from "@/lib/algorand-types";
import { ProjectLogo } from "./project-logo";

interface ProjectListProps {
  projects: AlgorandProject[];
  categories: { name: AlgorandCategory; count: number }[];
}

export function ProjectList({ projects, categories }: ProjectListProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<AlgorandCategory | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCategory =
        activeCategory === "All" ||
        p.category === activeCategory ||
        (p.subcategories?.includes(activeCategory) ?? false);
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.ecosystemTags.some((t) => t.toLowerCase().includes(q)) ||
        p.tokenTicker?.toLowerCase().includes(q)
      );
    });
  }, [projects, query, activeCategory]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-[10px] flex-1 max-w-md"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" />
            <path d="M10 10l3 3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search projects, tags, tokens..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none text-[13px] flex-1"
            style={{ color: "rgba(255,255,255,0.9)" }}
          />
        </div>
        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          {filtered.length} of {projects.length} projects
        </span>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 mb-7 flex-wrap">
        <CategoryChip
          label="All"
          count={projects.length}
          active={activeCategory === "All"}
          onClick={() => setActiveCategory("All")}
        />
        {categories.map((c) => (
          <CategoryChip
            key={c.name}
            label={c.name}
            count={c.count}
            active={activeCategory === c.name}
            onClick={() => setActiveCategory(c.name)}
          />
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="rounded-[12px] py-16 text-center text-[13px]"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
        >
          No projects match that filter.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[12px] font-medium px-3 h-8 rounded-[7px] transition-colors flex items-center gap-1.5"
      style={{
        background: active ? "#3B82F6" : "rgba(255,255,255,0.04)",
        color: active ? "#FFFFFF" : "rgba(255,255,255,0.7)",
        border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {label}
      <span style={{ opacity: 0.6, fontVariantNumeric: "tabular-nums" }}>{count}</span>
    </button>
  );
}

function ProjectCard({ project }: { project: AlgorandProject }) {
  return (
    <Link
      href={`/algorand/${project.slug}`}
      className="rounded-[12px] p-4 no-underline transition-colors flex flex-col gap-3 group"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start gap-3">
        <ProjectLogo name={project.name} logoUrl={project.logoUrl} size={44} rounded={10} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="text-[14px] font-semibold truncate" style={{ color: "#FFFFFF" }}>
              {project.name}
            </span>
            {project.verified && (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M6 0l1.5 1.2 1.9-.2.5 1.8 1.8.5-.2 1.9L12 6l-1.2 1.5.2 1.9-1.8.5-.5 1.8-1.9-.2L6 12l-1.5-1.2-1.9.2-.5-1.8L.5 8.7l.2-1.9L0 6l1.2-1.5L1 2.6l1.8-.5.5-1.8 1.9.2L6 0z" fill="#3B82F6" />
                <path d="M3.5 6L5 7.5 8.5 4" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span
            className="text-[12px] font-medium uppercase tracking-[0.6px]"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {project.category}
            {project.tokenTicker && ` · ${project.tokenTicker}`}
          </span>
        </div>
      </div>
      <p
        className="text-[12.5px] leading-[1.55] line-clamp-2 flex-1"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        {project.shortDescription}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        {project.ecosystemTags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[12px] font-medium px-2 py-0.5 rounded"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
