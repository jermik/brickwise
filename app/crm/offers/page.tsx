import { OFFER_TEMPLATES } from "@/lib/crm/types";

export default function OffersPage() {
  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-6xl space-y-8">
      <div>
        <h1 className="font-display text-3xl" style={{ color: "#F2EDE6" }}>
          Offer templates
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.45)" }}>
          Standard packages to position in your proposals. The audit suggests the best fit per lead automatically; you can override per lead from the lead detail page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                {offer.id.replace(/_/g, " ")}
              </div>
              <h2 className="font-display text-xl" style={{ color: "#F2EDE6" }}>
                {offer.name}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: "rgba(242,237,230,0.5)" }}>
                {offer.tagline}
              </p>
            </div>

            <div
              className="rounded-lg px-3 py-2 font-display text-xl"
              style={{ color: offer.color, background: `${offer.color}0d` }}
            >
              {offer.price}
            </div>

            <p className="text-xs" style={{ color: "rgba(242,237,230,0.45)" }}>
              <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "rgba(242,237,230,0.35)" }}>Good fit for</span>
              <br />
              {offer.goodFitFor}
            </p>

            <ul className="flex-1 space-y-1.5">
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

      <div className="rounded-lg px-4 py-4 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
        <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          How packaging works in this CRM
        </h2>
        <ol className="space-y-2 text-sm" style={{ color: "rgba(242,237,230,0.65)" }}>
          <li>1. Run the website audit for a lead. The system picks the best-fit package automatically based on the score profile.</li>
          <li>2. On the lead detail page you can override the suggestion if you have local context the audit doesn&apos;t.</li>
          <li>3. Click &ldquo;Generate proposal&rdquo; — it produces a tailored email, follow-up email, call script, and bullet points.</li>
          <li>4. Always review and personalise the output before sending. Never bulk-send.</li>
        </ol>

        <div className="pt-3 space-y-2" style={{ borderTop: "1px solid #2A2420" }}>
          <h3 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
            Recurring revenue add-ons
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "SEO retainer", value: "€150 – €500 / mo", note: "Local SEO, GBP, citations, monthly report" },
              { label: "Maintenance", value: "€80 – €200 / mo", note: "Hosting, updates, security, support" },
              { label: "Analytics & CRO", value: "€200 – €500 / mo", note: "GA4 reviews, A/B tests, conversion improvements" },
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
