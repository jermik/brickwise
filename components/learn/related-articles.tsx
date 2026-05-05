import Link from "next/link";
import { LEARN_ARTICLES, getRelatedArticles, type LearnArticle } from "@/lib/learn-articles";

const categoryColor: Record<LearnArticle["category"], string> = {
  "Beginner Guide": "#22c55e",
  "How-To": "#22c55e",
  "Platform Review": "#3b82f6",
  "Comparison": "#a855f7",
};

export function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const articles = getRelatedArticles(currentSlug, 2);
  if (articles.length === 0) return null;

  return (
    <div>
      <div className="text-[11px] font-semibold mb-3" style={{ color: "rgba(242,237,230,0.4)" }}>
        Continue reading
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map((article) => (
          <Link key={article.slug} href={article.href} className="no-underline block">
            <div
              className="rounded-[10px] px-5 py-4 hover:bg-[#1a1611] transition-colors h-full"
              style={{ background: "#131109", border: "1px solid #2A2420" }}
            >
              <div
                className="text-[10px] font-semibold uppercase tracking-[0.5px] mb-1.5"
                style={{ color: categoryColor[article.category] }}
              >
                {article.category}
              </div>
              <div className="text-[13px] font-medium mb-1" style={{ color: "#F2EDE6" }}>
                {article.shortTitle} →
              </div>
              <div className="text-[11px] leading-[1.5]" style={{ color: "rgba(242,237,230,0.4)" }}>
                {article.readTime} read
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ArticleLinkBar({ exclude }: { exclude?: string }) {
  const articles: LearnArticle[] = LEARN_ARTICLES.filter(
    (a: LearnArticle) => a.slug !== exclude
  ).slice(0, 4);

  return (
    <div className="flex flex-wrap gap-2">
      {articles.map((article) => (
        <Link key={article.slug} href={article.href} className="no-underline">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium hover:opacity-80 transition-opacity"
            style={{
              background: `${categoryColor[article.category]}14`,
              color: categoryColor[article.category],
              border: `1px solid ${categoryColor[article.category]}28`,
            }}
          >
            {article.shortTitle}
          </div>
        </Link>
      ))}
    </div>
  );
}
