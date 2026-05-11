import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/public-shell";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy — Brickwise" },
  description:
    "How Brickwise handles your data. We don't sell personal data. Cookies are used for sign-in and product analytics only.",
  alternates: { canonical: "https://brickwise.pro/privacy" },
};

const LAST_UPDATED = "2026-05-11";

export default function PrivacyPage() {
  return (
    <PublicShell>
      <article className="max-w-[760px] mx-auto px-6 lg:px-10 py-12">
        <header className="mb-8">
          <div
            className="text-[11px] font-medium mb-2"
            style={{ color: "rgba(242,237,230,0.4)", letterSpacing: "0.04em" }}
          >
            Legal
          </div>
          <h1
            className="text-[30px] font-normal leading-[1.1] tracking-[-0.3px]"
            style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}
          >
            Privacy policy
          </h1>
          <time
            className="text-[12px] mt-2 inline-block"
            style={{ color: "rgba(242,237,230,0.4)" }}
            dateTime={LAST_UPDATED}
          >
            Last updated {LAST_UPDATED}
          </time>
        </header>

        <section className="space-y-5 text-[15px] leading-[1.75]" style={{ color: "rgba(242,237,230,0.78)" }}>
          <p>
            Brickwise (&quot;we&quot;, &quot;us&quot;) operates brickwise.pro. This policy describes what data we
            collect, why, and how to remove it.
          </p>

          <h2 className="text-[20px] mt-8 mb-2" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            What we collect
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account info</strong> &mdash; if you sign in, we receive your email and a unique user ID from
              our authentication provider (Clerk). We do not receive your password.
            </li>
            <li>
              <strong>Email captures</strong> &mdash; if you subscribe to the weekly digest, we store your email
              address for that purpose only.
            </li>
            <li>
              <strong>Product analytics</strong> &mdash; we use Vercel Analytics and Speed Insights to measure
              pageviews and performance. These are aggregated and do not include personal identifiers beyond a
              short-lived session hash.
            </li>
            <li>
              <strong>Error monitoring</strong> &mdash; we use Sentry to capture client and server exceptions so we
              can fix bugs. Stack traces and request metadata are recorded; we strip query strings that look like
              tokens or emails.
            </li>
          </ul>

          <h2 className="text-[20px] mt-8 mb-2" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            What we do not do
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We do not sell personal data.</li>
            <li>We do not run third-party advertising trackers.</li>
            <li>We do not share your email with the platforms we cover.</li>
          </ul>

          <h2 className="text-[20px] mt-8 mb-2" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            Your rights
          </h2>
          <p>
            You can request deletion of your account and any associated data by emailing{" "}
            <a href="mailto:hello@brickwise.pro" style={{ color: "#F2EDE6", textDecoration: "underline" }}>
              hello@brickwise.pro
            </a>
            . We respond within 14 days.
          </p>

          <h2 className="text-[20px] mt-8 mb-2" style={{ color: "#F2EDE6", fontFamily: "var(--font-dm-serif)" }}>
            Changes
          </h2>
          <p>
            We update this policy when our data handling changes. The &quot;Last updated&quot; date at the top of
            this page reflects the most recent revision.
          </p>
        </section>
      </article>
    </PublicShell>
  );
}
