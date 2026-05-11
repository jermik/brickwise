import { FindBusinesses } from "@/components/crm/find-businesses";

export default function DiscoveryPage() {
  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-6xl space-y-6">
      <div>
        <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "#f59e0b" }}>
          Brickwise · Lead Discovery
        </p>
        <h1 className="font-display text-3xl mt-1" style={{ color: "#F2EDE6" }}>
          Find businesses
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.55)" }}>
          Search local businesses by niche and city. Review each result, import the strong ones, and start the audit. No bulk send.
        </p>
      </div>

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
          <p style={{ color: "#f59e0b" }} className="font-medium">For personalised outreach only.</p>
          <p>
            Discovery uses Google Places API for business data. Each lead must be reviewed and personalised before any contact. The system enforces a daily outreach cap and do-not-contact flags. It cannot bulk-send.
          </p>
        </div>
      </div>

      <FindBusinesses />
    </div>
  );
}
