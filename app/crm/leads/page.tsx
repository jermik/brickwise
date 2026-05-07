import Link from "next/link";
import { readLeads } from "@/lib/crm/store";
import { LeadTable } from "@/components/crm/lead-table";
import { ComplianceBanner } from "@/components/crm/compliance-banner";

export default async function LeadsPage() {
  const leads = await readLeads();

  return (
    <div className="px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#F2EDE6" }}>
            Leads
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.45)" }}>
            {leads.length} businesses in your database
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/crm/leads/new"
            className="px-4 py-2 rounded text-sm font-medium"
            style={{ background: "#f59e0b", color: "#0A0907" }}
          >
            + Add lead manually
          </Link>
          <Link
            href="/crm/leads/import"
            className="px-4 py-2 rounded text-sm"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.7)", border: "1px solid #2A2420" }}
          >
            Import CSV
          </Link>
        </div>
      </div>

      <ComplianceBanner />
      <LeadTable leads={leads} />
    </div>
  );
}
