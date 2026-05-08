import { notFound } from "next/navigation";
import Link from "next/link";
import { findLead } from "@/lib/crm/store";
import { generateProposalPackage } from "@/lib/crm/proposal/package";
import type { Locale } from "@/lib/crm/proposal/package";
import { ProposalPackageView } from "@/components/crm/proposal-package-view";

export default async function ProposalPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await findLead(id);
  if (!lead) notFound();

  // Generate both locales server-side so the client can toggle without a refetch.
  const en = generateProposalPackage(lead, lead.richAudit, lead.leadScoreData, { locale: "en" });
  const nl = generateProposalPackage(lead, lead.richAudit, lead.leadScoreData, { locale: "nl" });
  const pkg = en;
  const packages = en && nl ? ({ en, nl } as Record<Locale, NonNullable<typeof en>>) : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-4xl space-y-6">
      <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(242,237,230,0.4)" }}>
        <Link href="/crm/leads" className="hover:opacity-70">Leads</Link>
        <span>/</span>
        <Link href={`/crm/leads/${id}`} className="hover:opacity-70">{lead.businessName}</Link>
        <span>/</span>
        <span style={{ color: "rgba(242,237,230,0.7)" }}>Proposal package</span>
      </div>

      <div>
        <h1 className="font-display text-3xl" style={{ color: "#F2EDE6" }}>
          Make Proposal — {lead.businessName}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.55)" }}>
          {lead.category} · {lead.city}
          {pkg ? "" : " · Audit needed before a proposal can be generated."}
        </p>
      </div>

      {!pkg && (
        <div className="rounded-lg p-6 space-y-3" style={{ background: "#131109", border: "1px solid rgba(245,158,11,0.25)" }}>
          <p className="font-display text-lg" style={{ color: "#f59e0b" }}>Run the audit first</p>
          <p className="text-sm" style={{ color: "rgba(242,237,230,0.65)" }}>
            The proposal package is built from the structured audit data. Save an audit for this lead, then come back here.
          </p>
          <Link
            href={`/crm/leads/${id}/audit`}
            className="inline-block px-4 py-2 rounded text-sm font-medium"
            style={{ background: "#f59e0b", color: "#0A0907" }}
          >
            Run website audit →
          </Link>
        </div>
      )}

      {packages && <ProposalPackageView packages={packages} leadWebsite={lead.website} />}
    </div>
  );
}
