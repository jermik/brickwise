import { DiscoverySearch } from "@/components/crm/discovery-search";

export default function DiscoveryPage() {
  return (
    <div className="px-8 py-8 max-w-6xl space-y-6">
      <div>
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#f59e0b" }}>
          GrowthOS · Lead Discovery
        </p>
        <h1 className="font-display text-3xl mt-1" style={{ color: "#F2EDE6" }}>
          Find local businesses
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.55)" }}>
          Discover prospects from OpenStreetMap by country, city, and category. Review, select, and import into your pipeline. No bulk send. No scraping.
        </p>
      </div>

      {/* Compliance + sourcing notice */}
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
            Discovery uses public OpenStreetMap data (Nominatim + Overpass). You must review every imported business and personalise every message before sending. The system enforces a daily outreach cap, do-not-contact flags, and capped follow-ups — it cannot bulk-send and never will.
          </p>
          <p className="opacity-70">
            Data attribution: © OpenStreetMap contributors (ODbL).
          </p>
        </div>
      </div>

      <DiscoverySearch />
    </div>
  );
}
