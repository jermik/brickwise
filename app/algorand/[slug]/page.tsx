import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { ProjectLogo } from "@/components/algorand/project-logo";
import {
  ALGORAND_PROJECTS,
  getAlgorandProject,
  getRelatedProjects,
} from "@/lib/algorand";

export const revalidate = 3600;

export function generateStaticParams() {
  return ALGORAND_PROJECTS.map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getAlgorandProject(slug);
  if (!project) return { title: "Project not found | Brickwise" };

  const title = `${project.name} — ${project.category} on Algorand | Brickwise`;
  return {
    title,
    description: project.shortDescription,
    keywords: [
      project.name,
      `${project.name} Algorand`,
      `${project.category} Algorand`,
      ...project.ecosystemTags,
      "Algorand ecosystem",
    ],
    openGraph: {
      title,
      description: project.shortDescription,
      type: "website",
      url: `https://brickwise.pro/algorand/${project.slug}`,
    },
    alternates: { canonical: `https://brickwise.pro/algorand/${project.slug}` },
  };
}

export default async function AlgorandProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getAlgorandProject(slug);
  if (!project) notFound();
  const related = getRelatedProjects(project, 4);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://brickwise.pro" },
      { "@type": "ListItem", position: 2, name: "Algorand Ecosystem", item: "https://brickwise.pro/algorand" },
      { "@type": "ListItem", position: 3, name: project.name, item: `https://brickwise.pro/algorand/${project.slug}` },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.longDescription,
    url: project.website,
    applicationCategory: project.category,
    operatingSystem: "Web",
  };

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14" style={{ color: "rgba(255,255,255,0.9)" }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          <Link href="/" className="no-underline hover:opacity-70" style={{ color: "rgba(255,255,255,0.5)" }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/algorand" className="no-underline hover:opacity-70" style={{ color: "rgba(255,255,255,0.5)" }}>
            Algorand
          </Link>
          <span>/</span>
          <span style={{ color: "rgba(255,255,255,0.85)" }}>{project.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-5 mb-8">
          <ProjectLogo name={project.name} logoUrl={project.logoUrl} size={84} rounded={16} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h1 className="text-[32px] sm:text-[40px] font-bold tracking-[-1px] leading-[1.05]" style={{ color: "#FFFFFF", fontFamily: "var(--font-dm-serif)" }}>
                {project.name}
              </h1>
              {project.verified && (
                <span
                  className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.6px] px-2 py-0.5 rounded"
                  style={{ background: "rgba(59, 130, 246, 0.12)", color: "#60A5FA" }}
                >
                  Verified
                </span>
              )}
              {project.featured && (
                <span
                  className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.6px] px-2 py-0.5 rounded"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}
                >
                  Featured
                </span>
              )}
            </div>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.6)" }}>
              <span style={{ color: "#60A5FA" }}>{project.category}</span>
              {project.tokenTicker && (
                <> · <span style={{ fontFamily: "var(--font-dm-mono)" }}>{project.tokenTicker}</span></>
              )}
              {project.launchYear && <> · Since {project.launchYear}</>}
              <> · Algorand</>
            </p>
          </div>
        </div>

        {/* Short summary */}
        <p className="text-[17px] leading-[1.6] mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
          {project.shortDescription}
        </p>

        {/* Action row */}
        <div className="flex gap-2 flex-wrap mb-10">
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-semibold no-underline px-5 py-2.5 rounded-[8px] transition-opacity hover:opacity-90"
            style={{ background: "#FFFFFF", color: "#0A0A0F" }}
          >
            Visit website →
          </a>
          {project.socials?.twitter && (
            <SocialButton label="Twitter / X" href={project.socials.twitter} />
          )}
          {project.socials?.discord && <SocialButton label="Discord" href={project.socials.discord} />}
          {project.socials?.telegram && <SocialButton label="Telegram" href={project.socials.telegram} />}
          {project.socials?.github && <SocialButton label="GitHub" href={project.socials.github} />}
          {project.socials?.docs && <SocialButton label="Docs" href={project.socials.docs} />}
        </div>

        {/* About */}
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.7px] mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
          About
        </h2>
        <p className="text-[14.5px] leading-[1.7] mb-8" style={{ color: "rgba(255,255,255,0.78)" }}>
          {project.longDescription}
        </p>

        {/* Ecosystem tags */}
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.7px] mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
          Tags
        </h2>
        <div className="flex flex-wrap gap-1.5 mb-10">
          {project.ecosystemTags.map((tag) => (
            <span
              key={tag}
              className="text-[11.5px] font-medium px-2.5 py-1 rounded"
              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Brickwise notes */}
        {project.aiSummary && (
          <div
            className="rounded-[12px] p-5 mb-10"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(59,130,246,0.15)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60A5FA" }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.6px]" style={{ color: "#60A5FA" }}>
                Brickwise summary
              </span>
            </div>
            <p className="text-[13.5px] leading-[1.65]" style={{ color: "rgba(255,255,255,0.85)" }}>
              {project.aiSummary}
            </p>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.7px] mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
              More {project.category} projects
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/algorand/${r.slug}`}
                  className="rounded-[10px] p-4 flex items-center gap-3 no-underline transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <ProjectLogo name={r.name} logoUrl={r.logoUrl} size={40} rounded={10} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold truncate" style={{ color: "#FFFFFF" }}>
                      {r.name}
                    </div>
                    <div className="text-[11.5px] truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {r.shortDescription}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <Link
          href="/algorand"
          className="text-[13px] no-underline"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          ← Back to ecosystem
        </Link>

        <p className="text-[10.5px] mt-10 leading-[1.6]" style={{ color: "rgba(255,255,255,0.3)" }}>
          Brickwise is not affiliated with {project.name}. Information is editorial research, not financial advice or endorsement.
        </p>
      </div>
    </PublicShell>
  );
}

function SocialButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[13px] font-medium px-4 py-2.5 rounded-[8px] no-underline transition-colors"
      style={{
        background: "rgba(255,255,255,0.04)",
        color: "rgba(255,255,255,0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {label}
    </a>
  );
}
