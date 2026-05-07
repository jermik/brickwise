import { notFound } from "next/navigation";
import Link from "next/link";
import { findContentIdea } from "@/lib/crm/store";
import { ContentDetailTabs } from "@/components/crm/content-detail-tabs";
import { CONTENT_PLATFORMS } from "@/lib/crm/content/types";

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idea = await findContentIdea(id);
  if (!idea) notFound();

  const platform = CONTENT_PLATFORMS.find((p) => p.value === idea.platform);

  return (
    <div className="px-8 py-8 max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(242,237,230,0.4)" }}>
        <Link href="/crm/content" className="hover:opacity-70">Content</Link>
        <span>/</span>
        <span style={{ color: "rgba(242,237,230,0.7)" }}>{idea.title}</span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[10px] px-2 py-0.5 rounded"
            style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}
          >
            {platform?.label}
          </span>
          <span className="font-mono text-[10px]" style={{ color: "rgba(242,237,230,0.45)" }}>
            {idea.niche} · {idea.city} · {idea.durationSeconds}s · {idea.scriptScenes.length} scenes
          </span>
        </div>
        <h1 className="font-display text-3xl tracking-tight" style={{ color: "#F2EDE6" }}>
          {idea.title}
        </h1>
        <p className="text-sm" style={{ color: "rgba(242,237,230,0.55)" }}>
          For {idea.audience.toLowerCase()} · angle: {idea.angle.replace(/_/g, " ")}
        </p>
      </div>

      <ContentDetailTabs idea={idea} />
    </div>
  );
}
