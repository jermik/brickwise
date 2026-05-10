// Algorand ecosystem helpers. JSON-driven. SSG-friendly.
// Phase 2 (DB migration) can swap the data source without changing the API surface.

import projectsRaw from "@/lib/data/algorand-projects.json";
import type { AlgorandCategory, AlgorandProject } from "./algorand-types";

export const ALGORAND_PROJECTS = projectsRaw as unknown as AlgorandProject[];

export function getAlgorandProject(slug: string): AlgorandProject | undefined {
  return ALGORAND_PROJECTS.find((p) => p.slug === slug);
}

export function getAlgorandCategories(): { name: AlgorandCategory; count: number }[] {
  const counts = new Map<AlgorandCategory, number>();
  for (const p of ALGORAND_PROJECTS) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getFeaturedProjects(limit = 8): AlgorandProject[] {
  return ALGORAND_PROJECTS.filter((p) => p.featured).slice(0, limit);
}

export function getRelatedProjects(
  project: AlgorandProject,
  limit = 4,
): AlgorandProject[] {
  return ALGORAND_PROJECTS
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, limit);
}

export function searchAlgorandProjects(query: string): AlgorandProject[] {
  if (!query.trim()) return ALGORAND_PROJECTS;
  const q = query.toLowerCase();
  return ALGORAND_PROJECTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.ecosystemTags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q),
  );
}

export const ALGORAND_TOTAL_COUNT = ALGORAND_PROJECTS.length;
