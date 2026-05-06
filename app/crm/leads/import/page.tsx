import { CSVImport } from "@/components/crm/csv-import";
import { ComplianceBanner } from "@/components/crm/compliance-banner";

export default function ImportPage() {
  return (
    <div className="px-8 py-8 max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl" style={{ color: "#F2EDE6" }}>
          Import CSV
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.45)" }}>
          Bulk-add leads from a spreadsheet export.
        </p>
      </div>
      <ComplianceBanner />
      <CSVImport />
    </div>
  );
}
