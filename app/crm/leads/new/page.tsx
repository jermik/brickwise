import { LeadForm } from "@/components/crm/lead-form";

export default function NewLeadPage() {
  return (
    <div className="px-8 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl" style={{ color: "#F2EDE6" }}>
          Add lead manually
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.45)" }}>
          Add a business to your outreach pipeline. Save and audit jumps you straight into the audit checklist.
        </p>
      </div>
      <LeadForm mode="create" />
    </div>
  );
}
