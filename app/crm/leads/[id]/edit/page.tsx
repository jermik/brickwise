import { notFound } from "next/navigation";
import { findLead } from "@/lib/crm/store";
import { LeadForm } from "@/components/crm/lead-form";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await findLead(id);
  if (!lead) notFound();

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl" style={{ color: "#F2EDE6" }}>
          Edit lead
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.45)" }}>
          {lead.businessName}
        </p>
      </div>
      <LeadForm lead={lead} mode="edit" />
    </div>
  );
}
