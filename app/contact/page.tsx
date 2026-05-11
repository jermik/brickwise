import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/public-shell";

export const metadata: Metadata = {
  title: { absolute: "Contact Brickwise — Get in Touch" },
  description:
    "Get in touch with Brickwise. Email hello@brickwise.pro for product questions, data corrections, partnership requests, or press.",
  alternates: { canonical: "https://brickwise.pro/contact" },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Brickwise",
  "url": "https://brickwise.pro/contact",
  "mainEntity": {
    "@id": "https://brickwise.pro/#organization",
  },
};

export default function ContactPage() {
  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <article className="max-w-[680px] mx-auto px-6 lg:px-10 py-12">
        <header className="mb-8">
          <div
            className="text-[11px] font-medium mb-2"
            style={{ color: "rgba(242,237,230,0.4)", letterSpacing: "0.04em" }}
          >
            Contact
          </div>
          <h1
            className="text-[30px] font-normal leading-[1.1] tracking-[-0.3px]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Get in touch with Brickwise
          </h1>
        </header>

        <section className="space-y-6 text-[15px] leading-[1.75]" style={{ color: "rgba(242,237,230,0.78)" }}>
          <p>
            We&apos;re a small independent team covering tokenized real estate. Pick whichever channel matches
            your message &mdash; we read everything.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <div
              className="rounded-[10px] p-5"
              style={{ background: "#131109", border: "1px solid #2A2420" }}
            >
              <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.45)" }}>
                Email (general)
              </div>
              <a
                href="mailto:hello@brickwise.pro"
                className="text-[15px] font-medium no-underline"
                style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-mono)" }}
              >
                hello@brickwise.pro
              </a>
              <p className="text-[12px] mt-2" style={{ color: "rgba(242,237,230,0.45)" }}>
                Product questions, data corrections, feature requests.
              </p>
            </div>

            <div
              className="rounded-[10px] p-5"
              style={{ background: "#131109", border: "1px solid #2A2420" }}
            >
              <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.45)" }}>
                Email (press)
              </div>
              <a
                href="mailto:press@brickwise.pro"
                className="text-[15px] font-medium no-underline"
                style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-mono)" }}
              >
                press@brickwise.pro
              </a>
              <p className="text-[12px] mt-2" style={{ color: "rgba(242,237,230,0.45)" }}>
                Press, interviews, partnerships.
              </p>
            </div>

            <div
              className="rounded-[10px] p-5 sm:col-span-2"
              style={{ background: "#131109", border: "1px solid #2A2420" }}
            >
              <div className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-2" style={{ color: "rgba(242,237,230,0.45)" }}>
                X / Twitter
              </div>
              <a
                href="https://x.com/brickwisepro"
                rel="noopener me"
                className="text-[15px] font-medium no-underline"
                style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-mono)" }}
              >
                @brickwisepro
              </a>
              <p className="text-[12px] mt-2" style={{ color: "rgba(242,237,230,0.45)" }}>
                Daily yield commentary and new-listing alerts.
              </p>
            </div>
          </div>

          <h2 className="text-[20px] mt-10 mb-2" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            Reporting an error
          </h2>
          <p>
            Spotted bad data on a property page? Email{" "}
            <a href="mailto:hello@brickwise.pro" style={{ color: "#F2EDE6", textDecoration: "underline" }}>
              hello@brickwise.pro
            </a>{" "}
            with the property URL and the corrected value. We acknowledge corrections within 48 hours and publish
            a change note on the affected page when we update.
          </p>
        </section>
      </article>
    </PublicShell>
  );
}
