import Link from "next/link";
import { readContentIdeas } from "@/lib/crm/store";
import { ContentGeneratorForm } from "@/components/crm/content-generator-form";
import {
  CONTENT_PLATFORMS,
  CONTENT_STATUS_CONFIG,
  type ContentIdea,
} from "@/lib/crm/content/types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

export default async function ContentPage() {
  // Fail-soft: a transient Neon hiccup shouldn't 500 the whole page —
  // surface an inline banner and still render the form so creating new
  // content packages keeps working.
  let ideas: ContentIdea[] = [];
  let loadError: string | null = null;
  try {
    ideas = await readContentIdeas();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Could not load saved ideas.";
    console.error("[content.page] readContentIdeas.failed", { message: loadError });
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-6xl space-y-6">
      <div>
        <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "#f59e0b" }}>
          GrowthOS · Content engine
        </p>
        <h1 className="font-display text-3xl mt-1" style={{ color: "#F2EDE6" }}>
          Short-form content packages
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.55)" }}>
          Generate scripts, subtitles, captions, and platform packs for TikTok, Reels, Shorts, LinkedIn, and X. No auto-posting — drafts only.
        </p>
      </div>

      {/* Compliance note */}
      <div
        className="flex items-start gap-3 rounded-lg px-4 py-3 text-xs"
        style={{
          background: "rgba(245,158,11,0.06)",
          border: "1px solid rgba(245,158,11,0.2)",
          color: "rgba(242,237,230,0.7)",
        }}
      >
        <span className="mt-0.5" style={{ color: "#f59e0b" }}>⚠</span>
        <div className="space-y-1">
          <p style={{ color: "#f59e0b" }} className="font-medium">
            Honest framing required.
          </p>
          <p>
            Templates use cautious phrasing — &ldquo;could help&rdquo;, &ldquo;potential opportunity&rdquo;, &ldquo;based on visible website signals&rdquo;. No guaranteed-result claims, no spam instructions, no fake automation. Review every draft before posting.
          </p>
        </div>
      </div>

      <ContentGeneratorForm />

      {loadError && (
        <div
          className="rounded-lg px-4 py-3 text-xs"
          style={{
            background: "rgba(248,113,113,0.08)",
            color: "#f87171",
            border: "1px solid rgba(248,113,113,0.25)",
          }}
        >
          Couldn&rsquo;t load saved ideas right now (transient database hiccup).
          Refresh in a few seconds — already-saved ideas are safe and will reappear.
          <span className="block mt-1 opacity-60">{loadError.slice(0, 200)}</span>
        </div>
      )}

      {/* Saved ideas */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
            Saved ideas · {ideas.length}
          </h2>
        </div>

        {ideas.length === 0 && (
          <div className="rounded-lg px-6 py-12 text-center" style={{ border: "2px dashed #2A2420" }}>
            <p className="font-display text-xl" style={{ color: "rgba(242,237,230,0.5)" }}>No content ideas yet</p>
            <p className="text-sm mt-2" style={{ color: "rgba(242,237,230,0.35)" }}>
              Pick a platform, niche, city, and angle above — then click Generate content package.
            </p>
          </div>
        )}

        {ideas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ideas.map((idea: ContentIdea) => {
              const platform = CONTENT_PLATFORMS.find((p) => p.value === idea.platform);
              const status = CONTENT_STATUS_CONFIG[idea.status];
              return (
                <Link
                  key={idea.id}
                  href={`/crm/content/${idea.id}`}
                  className="rounded-lg p-4 space-y-2 transition-colors hover:bg-white/[0.02]"
                  style={{ background: "#131109", border: "1px solid #2A2420" }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[12px] px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}
                    >
                      {platform?.label}
                    </span>
                    <span
                      className="font-mono text-[12px] px-1.5 py-0.5 rounded"
                      style={{ background: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                    <span className="ml-auto text-[12px] font-mono" style={{ color: "rgba(242,237,230,0.35)" }}>
                      {fmtDate(idea.createdAt)}
                    </span>
                  </div>
                  <p className="font-display text-base leading-tight" style={{ color: "#F2EDE6" }}>
                    {idea.title}
                  </p>
                  <p className="text-xs line-clamp-2" style={{ color: "rgba(242,237,230,0.55)" }}>
                    {idea.hook}
                  </p>
                  <p className="font-mono text-[12px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                    {idea.niche} · {idea.city} · {idea.durationSeconds}s · {idea.scriptScenes.length} scenes
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
