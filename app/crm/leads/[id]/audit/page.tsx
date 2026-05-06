import { notFound } from "next/navigation";
import Link from "next/link";
import { findLead } from "@/lib/crm/store";
import { AuditForm } from "@/components/crm/audit-form";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await findLead(id);
  if (!lead) notFound();

  return (
    <div className="px-8 py-8 max-w-xl space-y-6">
      <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(242,237,230,0.4)" }}>
        <Link href="/crm/leads" className="hover:opacity-70">Leads</Link>
        <span>/</span>
        <Link href={`/crm/leads/${id}`} className="hover:opacity-70">{lead.businessName}</Link>
        <span>/</span>
        <span style={{ color: "rgba(242,237,230,0.7)" }}>Audit</span>
      </div>

      <div>
        <h1 className="font-display text-3xl" style={{ color: "#F2EDE6" }}>
          Website audit
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.45)" }}>
          {lead.businessName} — tick what you observe on their site
        </p>
      </div>

      <AuditForm lead={lead} />
    </div>
  );
}
