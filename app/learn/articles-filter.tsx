"use client";

import { useState } from "react";
import Link from "next/link";
import type { LearnArticle } from "@/lib/learn-articles";

const CATEGORIES = ["All", "Beginner Guide", "How-To", "Platform Review", "Comparison"] as const;
type Category = (typeof CATEGORIES)[number];

export function ArticlesFilter({ articles }: { articles: LearnArticle[] }) {
  const [active, setActive] = useState<Category>("All");

  const filtered = active === "All" ? articles : articles.filter((a) => a.category === active);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter guides by category">
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(cat)}
              className="px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer"
              style={{
                background: isActive ? "#22c55e" : "rgba(255,255,255,0.05)",
                color: isActive ? "#0A0907" : "rgba(242,237,230,0.5)",
                border: "1px solid",
                borderColor: isActive ? "#22c55e" : "rgba(255,255,255,0.08)",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="space-y-3 mb-12" role="tabpanel" aria-label={`${active} guides`}>
        {filtered.length === 0 ? (
          <div
            className="rounded-[10px] px-5 py-8 text-center text-[13px]"
            style={{ background: "#131109", border: "1px solid #2A2420", color: "rgba(242,237,230,0.45)" }}
          >
            No guides in this category yet.
          </div>
        ) : (
          filtered.map((article) => (
            <Link key={article.slug} href={article.href} className="no-underline block">
              <div
                className="rounded-[10px] px-5 py-5 flex gap-5 hover:bg-[#1a1611] transition-colors"
                style={{ background: "#131109", border: "1px solid #2A2420" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="text-[12px] font-semibold uppercase tracking-[0.5px] px-2 py-0.5 rounded-full"
                      style={{ background: `${article.accentColor}18`, color: article.accentColor }}
                    >
                      {article.category}
                    </div>
                    <span className="text-[12px]" style={{ color: "rgba(242,237,230,0.3)" }}>
                      {article.readTime} read
                    </span>
                  </div>
                  <h2 className="text-[15px] font-semibold mb-1.5 leading-snug" style={{ color: "#F2EDE6" }}>
                    {article.title}
                  </h2>
                  <p className="text-[12px] leading-[1.6]" style={{ color: "rgba(242,237,230,0.5)" }}>
                    {article.description}
                  </p>
                </div>
                <div className="flex-shrink-0 self-center" style={{ color: "rgba(242,237,230,0.3)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
