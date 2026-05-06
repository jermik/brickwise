import { OFFER_TEMPLATES } from "@/lib/crm/types";

export default function OffersPage() {
  return (
    <div className="px-8 py-8 max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-3xl" style={{ color: "#F2EDE6" }}>
          Offer templates
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.45)" }}>
          Standard packages to position in your proposals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {OFFER_TEMPLATES.map((offer) => (
          <div
            key={offer.id}
            className="rounded-xl p-5 space-y-4 flex flex-col"
            style={{
              background: "#131109",
              border: `1px solid ${offer.color}33`,
              boxShadow: `0 0 30px ${offer.color}0a`,
            }}
          >
            <div>
              <div
                className="inline-block rounded px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase mb-3"
                style={{ background: `${offer.color}15`, color: offer.color }}
              >
                {offer.id}
              </div>
              <h2 className="font-display text-xl" style={{ color: "#F2EDE6" }}>
                {offer.name}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: "rgba(242,237,230,0.5)" }}>
                {offer.tagline}
              </p>
            </div>

            <div
              className="rounded-lg px-3 py-2 font-display text-2xl"
              style={{ color: offer.color, background: `${offer.color}0d` }}
            >
              {offer.price}
            </div>

            <ul className="flex-1 space-y-2">
              {offer.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span style={{ color: offer.color }} className="mt-0.5 shrink-0">✓</span>
                  <span style={{ color: "rgba(242,237,230,0.75)" }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg px-4 py-4 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
        <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          How to use these in proposals
        </h2>
        <ol className="space-y-2 text-sm" style={{ color: "rgba(242,237,230,0.65)" }}>
          <li>1. Run the website audit first to identify which package fits the business.</li>
          <li>2. Go to the lead&apos;s proposal page and click &ldquo;Generate proposal&rdquo; — it picks the right offer automatically.</li>
          <li>3. Always review and personalise the generated text before sending anything.</li>
          <li>4. Keep prices as internal guides — adjust per business, complexity, and market.</li>
        </ol>

        <div className="pt-3 space-y-2" style={{ borderTop: "1px solid #2A2420" }}>
          <h3 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
            Pricing notes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "SEO retainer", value: "€150 – €500 / month", note: "Ongoing local SEO, Google Business Profile, citations" },
              { label: "Analytics setup", value: "€200 – €400 once", note: "GA4, Search Console, heatmaps, conversion tracking" },
              { label: "Maintenance", value: "€80 – €200 / month", note: "Hosting, updates, security, support" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg px-3 py-3 space-y-1" style={{ background: "#0A0907", border: "1px solid #2A2420" }}>
                <p className="text-xs font-mono" style={{ color: "rgba(242,237,230,0.4)" }}>{item.label}</p>
                <p className="font-display text-base" style={{ color: "#f59e0b" }}>{item.value}</p>
                <p className="text-xs" style={{ color: "rgba(242,237,230,0.45)" }}>{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
