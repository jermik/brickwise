export type LearnArticle = {
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  description: string;
  category: "Beginner Guide" | "How-To" | "Platform Review" | "Comparison";
  readTime: string;
  accentColor: string;
};

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    slug: "what-is-tokenized-real-estate",
    href: "/learn/what-is-tokenized-real-estate",
    title: "What Is Tokenized Real Estate? Complete Guide",
    shortTitle: "What Is Tokenized Real Estate?",
    description:
      "How blockchain tokens represent property ownership, typical yields, risks, and getting started from $50.",
    category: "Beginner Guide",
    readTime: "8 min",
    accentColor: "#22c55e",
  },
  {
    slug: "how-to-invest-in-tokenized-real-estate",
    href: "/learn/how-to-invest-in-tokenized-real-estate",
    title: "How to Invest in Tokenized Real Estate: 8-Step Guide",
    shortTitle: "How to Invest in Tokenized RE",
    description:
      "From account creation to your first daily payout — platform choice, KYC, funding, and property research.",
    category: "How-To",
    readTime: "10 min",
    accentColor: "#22c55e",
  },
  {
    slug: "realt-review",
    href: "/learn/realt-review",
    title: "RealT Review: Yields, Fees & Is It Worth It?",
    shortTitle: "RealT Review",
    description:
      "Data-driven review of RealT — actual net yields, fee structure, liquidity, pros/cons, and verdict.",
    category: "Platform Review",
    readTime: "7 min",
    accentColor: "#3b82f6",
  },
  {
    slug: "lofty-review",
    href: "/learn/lofty-review",
    title: "Lofty Review: Yields, Daily Payouts & Liquidity",
    shortTitle: "Lofty Review",
    description:
      "In-depth analysis of Lofty AI — yields, $50 minimum, daily payouts, and Proactive Market Maker.",
    category: "Platform Review",
    readTime: "7 min",
    accentColor: "#f97316",
  },
  {
    slug: "realt-vs-lofty",
    href: "/compare/realt-vs-lofty",
    title: "RealT vs Lofty: Full Platform Comparison",
    shortTitle: "RealT vs Lofty",
    description:
      "Side-by-side comparison across yield, fees, liquidity, onboarding, and DeFi integrations.",
    category: "Comparison",
    readTime: "6 min",
    accentColor: "#a855f7",
  },
];

// Related article graph — each slug maps to 2–3 related slugs
const RELATED_GRAPH: Record<string, string[]> = {
  "what-is-tokenized-real-estate": ["how-to-invest-in-tokenized-real-estate", "realt-vs-lofty", "realt-review"],
  "how-to-invest-in-tokenized-real-estate": ["what-is-tokenized-real-estate", "realt-review", "lofty-review"],
  "realt-review": ["lofty-review", "realt-vs-lofty", "how-to-invest-in-tokenized-real-estate"],
  "lofty-review": ["realt-review", "realt-vs-lofty", "how-to-invest-in-tokenized-real-estate"],
  "realt-vs-lofty": ["realt-review", "lofty-review", "what-is-tokenized-real-estate"],
};

export function getRelatedArticles(currentSlug: string, limit = 2): LearnArticle[] {
  const related = RELATED_GRAPH[currentSlug] ?? [];
  return related
    .slice(0, limit)
    .map((slug) => LEARN_ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is LearnArticle => a !== undefined);
}
