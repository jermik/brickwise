import Link from "next/link";
import { WaitlistForm } from "@/components/growthos/WaitlistForm";

const ACCENT = "#f59e0b";
const ACCENT_SOFT = "rgba(245,158,11,0.12)";
const ACCENT_BORDER = "rgba(245,158,11,0.25)";
const SURFACE = "#131109";
const BORDER = "#2A2420";

const FEATURES = [
  {
    title: "Lead database",
    body: "Every local business you're researching, with category, city, status, and consent — never lose a prospect to a forgotten tab.",
  },
  {
    title: "Website audit engine",
    body: "32 weighted checks across website quality, local SEO, conversion, and automation. Auto-derives top-3 problems and improvements.",
  },
  {
    title: "Personalised proposals",
    body: "Initial email, follow-up email, LinkedIn DM, call script, and bullet points — all referencing the specific issues from the audit.",
  },
  {
    title: "Follow-up scheduler",
    body: "Auto-schedules a 3-day follow-up after each contact. Hard-capped at 2 pending per lead so you don't keep chasing.",
  },
  {
    title: "Offer packages",
    body: "Five ready-to-use service templates: Starter Site, Growth Site, Local SEO Sprint, Automation Add-on, and the Growth + Automation bundle.",
  },
  {
    title: "Compliance built-in",
    body: "Do-not-contact flags, daily outreach limits, mandatory opt-out copy, and manual personalisation confirmation on every send.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Add a lead",
    body: "Enter a business manually or import a CSV. Categorise by service type and city.",
  },
  {
    n: "02",
    title: "Run the audit",
    body: "Open their website, tick what you observe across 32 weighted checks. Scores compute live.",
  },
  {
    n: "03",
    title: "Generate the proposal",
    body: "GrowthOS picks the best-fit offer and drafts a personalised email referencing the actual issues.",
  },
  {
    n: "04",
    title: "Send. Follow up. Win.",
    body: "Copy the draft, personalise the last 10%, send manually. GrowthOS handles the follow-up reminders.",
  },
];

const USE_CASES = [
  {
    who: "Freelance web designers",
    use: "Find under-built local sites, propose a Starter or Growth website with concrete reasons.",
  },
  {
    who: "SEO consultants",
    use: "Spot title-tag, GBP, and city-page gaps in seconds. Propose a Local SEO Sprint backed by an audit summary.",
  },
  {
    who: "Small agencies",
    use: "Run organised, accountable outreach for the team. Track pipeline, deal value, and follow-ups in one place.",
  },
  {
    who: "Local growth consultants",
    use: "Position automation upgrades — booking, quoting, invoicing — to businesses still doing it by hand.",
  },
];

const FAQ = [
  {
    q: "Is GrowthOS a bulk-email tool?",
    a: "No. GrowthOS generates drafts you copy and send manually from your own email or LinkedIn. There is no automatic sending, no mailing list, no broadcast feature. The whole product is built for low-volume, personalised outreach.",
  },
  {
    q: "How is this different from a spreadsheet?",
    a: "Spreadsheets don't audit websites, don't compute SEO and automation opportunity scores, don't generate personalised proposals, and don't enforce compliance limits. GrowthOS does all of that in one workflow.",
  },
  {
    q: "Will GrowthOS scrape websites for me?",
    a: "No. Audits are operator-driven — you open the prospect's site and tick what you see. This keeps GrowthOS on the right side of platform terms of service and privacy law.",
  },
  {
    q: "What about email/privacy laws like GDPR or CAN-SPAM?",
    a: "GrowthOS includes do-not-contact flags, daily outreach caps, mandatory opt-out lines in every draft, and a hard limit on follow-ups. You're still responsible for complying with the laws in your jurisdiction — but the product is built to make compliance easier, not harder.",
  },
  {
    q: "Do I need a database to use it?",
    a: "It runs on Postgres (Neon by default — free tier works). Setup is a single env var and a one-line migration command.",
  },
  {
    q: "Can my whole agency use it?",
    a: "Yes. Auth is via Clerk, so every team member signs in with their own account. Pipeline data is shared.",
  },
];

export default function GrowthOSLanding() {
  return (
    <div style={{ background: "#0A0907", color: "#F2EDE6" }} className="min-h-screen">
      {/* Top nav */}
      <header className="border-b" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/growthos" className="flex items-center gap-2.5 group">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-md font-display text-base"
              style={{ background: ACCENT_SOFT, color: ACCENT, border: `1px solid ${ACCENT_BORDER}` }}
            >
              G
            </span>
            <span className="font-display text-lg tracking-tight">GrowthOS</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <a href="#features" className="hidden sm:inline text-sm" style={{ color: "rgba(242,237,230,0.6)" }}>Features</a>
            <a href="#how" className="hidden sm:inline text-sm" style={{ color: "rgba(242,237,230,0.6)" }}>How it works</a>
            <a href="#faq" className="hidden sm:inline text-sm" style={{ color: "rgba(242,237,230,0.6)" }}>FAQ</a>
            <Link
              href="/sign-in?redirect_url=/crm"
              className="text-sm px-3 py-1.5 rounded"
              style={{ color: "rgba(242,237,230,0.7)" }}
            >
              Sign in
            </Link>
            <Link
              href="/crm"
              className="text-sm px-3 py-1.5 rounded font-medium"
              style={{ background: ACCENT, color: "#0A0907" }}
            >
              Open GrowthOS
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-3xl space-y-6">
          <p
            className="font-mono text-[11px] tracking-widest uppercase"
            style={{ color: ACCENT }}
          >
            Local business outreach CRM
          </p>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight">
            Turn local business opportunities into clients.
          </h1>
          <p className="text-lg sm:text-xl" style={{ color: "rgba(242,237,230,0.65)" }}>
            GrowthOS is the local business growth system for audits, outreach, proposals, and follow-ups — built for freelancers, web designers, SEO consultants, and small agencies who sell to local businesses.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/crm"
              className="px-5 py-3 rounded text-sm font-medium"
              style={{ background: ACCENT, color: "#0A0907" }}
            >
              Open GrowthOS →
            </Link>
            <Link
              href="/crm/leads/new"
              className="px-5 py-3 rounded text-sm"
              style={{ background: "rgba(255,255,255,0.04)", color: "#F2EDE6", border: `1px solid ${BORDER}` }}
            >
              Start with your first lead
            </Link>
          </div>
          <p className="font-mono text-xs pt-2" style={{ color: "rgba(242,237,230,0.4)" }}>
            No bulk sending. No scraping. No spam. Manual outreach, organised.
          </p>

          {/* Bio-link target — focused waitlist capture above the fold. */}
          <div className="pt-6">
            <WaitlistForm source="bio" />
          </div>
        </div>

        {/* Stat strip */}
        <div
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-xl overflow-hidden"
          style={{ background: BORDER }}
        >
          {[
            { v: "32", l: "audit checks" },
            { v: "5", l: "offer packages" },
            { v: "10/day", l: "outreach cap" },
            { v: "0", l: "bulk-send features" },
          ].map((s) => (
            <div key={s.l} className="p-5 sm:p-6" style={{ background: SURFACE }}>
              <p className="font-display text-2xl sm:text-3xl" style={{ color: ACCENT }}>{s.v}</p>
              <p className="font-mono text-[12px] tracking-widest uppercase mt-1" style={{ color: "rgba(242,237,230,0.45)" }}>
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="border-t" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <p className="font-mono text-[11px] tracking-widest uppercase" style={{ color: ACCENT }}>
            The problem
          </p>
          <h2 className="font-display text-3xl sm:text-4xl mt-3 max-w-2xl">
            Local outreach is broken — and bulk tools make it worse.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {[
              { t: "Spreadsheets lose leads", b: "You research 50 businesses, send 8 emails, then forget which ones replied. The pipeline lives in your head." },
              { t: "Bulk tools get you blocked", b: "Mass cold-mailers torch your domain reputation. Local business owners can smell a spam template instantly." },
              { t: "Generic pitches don't convert", b: "Without specific reasons — bad title tags, no booking, broken mobile CTA — your offer sounds like every other agency's." },
            ].map((p) => (
              <div key={p.t} className="rounded-lg p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <p className="font-display text-lg">{p.t}</p>
                <p className="text-sm mt-2" style={{ color: "rgba(242,237,230,0.6)" }}>{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-t" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="font-mono text-[11px] tracking-widest uppercase" style={{ color: ACCENT }}>
                The solution
              </p>
              <h2 className="font-display text-3xl sm:text-4xl mt-3">
                One workflow from research to win.
              </h2>
              <p className="text-base mt-4" style={{ color: "rgba(242,237,230,0.65)" }}>
                GrowthOS pulls your lead database, website audit, offer selection, proposal generation, and follow-up scheduling into a single workflow. You spend less time admining and more time talking to real prospects with specific, helpful suggestions.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { t: "Audit", b: "Score 4 dimensions" },
                { t: "Outreach", b: "Personalised, manual" },
                { t: "Proposals", b: "Auto-drafted, editable" },
                { t: "Follow-ups", b: "Scheduled, capped" },
              ].map((p) => (
                <div key={p.t} className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                  <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: ACCENT }}>{p.t}</p>
                  <p className="text-sm mt-1.5" style={{ color: "rgba(242,237,230,0.7)" }}>{p.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <p className="font-mono text-[11px] tracking-widest uppercase" style={{ color: ACCENT }}>
            Features
          </p>
          <h2 className="font-display text-3xl sm:text-4xl mt-3">
            Built for selling websites, SEO, and automation to local businesses.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="rounded-lg p-5 space-y-2" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <span
                  className="inline-block font-mono text-[12px] tracking-widest"
                  style={{ color: ACCENT }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-display text-lg">{f.title}</p>
                <p className="text-sm" style={{ color: "rgba(242,237,230,0.6)" }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <p className="font-mono text-[11px] tracking-widest uppercase" style={{ color: ACCENT }}>
            How it works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl mt-3 max-w-2xl">
            Four steps from a name on a list to a paying client.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-lg p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <p className="font-display text-3xl" style={{ color: ACCENT }}>{s.n}</p>
                <p className="font-display text-lg mt-2">{s.title}</p>
                <p className="text-sm mt-1.5" style={{ color: "rgba(242,237,230,0.6)" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <p className="font-mono text-[11px] tracking-widest uppercase" style={{ color: ACCENT }}>
            Who it's for
          </p>
          <h2 className="font-display text-3xl sm:text-4xl mt-3 max-w-2xl">
            For people who sell services to local businesses.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-10">
            {USE_CASES.map((u) => (
              <div key={u.who} className="flex items-start gap-4 rounded-lg p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <span style={{ color: ACCENT }} className="mt-1">→</span>
                <div>
                  <p className="font-display text-lg">{u.who}</p>
                  <p className="text-sm mt-1" style={{ color: "rgba(242,237,230,0.65)" }}>{u.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="border-t" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="rounded-xl p-8 sm:p-10" style={{ background: SURFACE, border: `1px solid ${ACCENT_BORDER}` }}>
            <p className="font-mono text-[11px] tracking-widest uppercase" style={{ color: ACCENT }}>
              Compliance
            </p>
            <h2 className="font-display text-3xl sm:text-4xl mt-3">
              GrowthOS is not a spam tool.
            </h2>
            <p className="text-base mt-4 max-w-3xl" style={{ color: "rgba(242,237,230,0.7)" }}>
              The product is intentionally designed for personalised, low-volume outreach. There is no bulk-send feature, no automated mailing, no mass scraping. Built-in safeguards keep you compliant with email and privacy laws — but you are still responsible for following the rules in your jurisdiction.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {[
                "Do-not-contact flag respected at every action",
                "Daily outreach cap (10/day) enforced server-side",
                "Mandatory opt-out line in every draft",
                "Manual personalisation confirmation per contact",
                "Maximum 2 pending follow-ups per lead",
                "No automatic bulk sending — drafts only",
              ].map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm">
                  <span style={{ color: "#34d399" }} className="mt-0.5">✓</span>
                  <span style={{ color: "rgba(242,237,230,0.75)" }}>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="border-t" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28 text-center">
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight max-w-2xl mx-auto">
            Ready to systemise your local outreach?
          </h2>
          <p className="text-base sm:text-lg mt-5 max-w-xl mx-auto" style={{ color: "rgba(242,237,230,0.65)" }}>
            Sign in, add your first lead, run the audit, and generate a proposal in under five minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              href="/crm"
              className="px-6 py-3 rounded text-sm font-medium"
              style={{ background: ACCENT, color: "#0A0907" }}
            >
              Open GrowthOS →
            </Link>
            <Link
              href="/crm/leads/new"
              className="px-6 py-3 rounded text-sm"
              style={{ background: "rgba(255,255,255,0.04)", color: "#F2EDE6", border: `1px solid ${BORDER}` }}
            >
              Start with your first lead
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
          <p className="font-mono text-[11px] tracking-widest uppercase text-center" style={{ color: ACCENT }}>
            FAQ
          </p>
          <h2 className="font-display text-3xl sm:text-4xl mt-3 text-center">Common questions</h2>
          <div className="mt-10 space-y-2">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-lg overflow-hidden"
                style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5">
                  <span className="font-display text-base sm:text-lg">{item.q}</span>
                  <span className="font-mono text-xl shrink-0 group-open:rotate-45 transition-transform" style={{ color: ACCENT }}>+</span>
                </summary>
                <div className="px-5 pb-5 text-sm" style={{ color: "rgba(242,237,230,0.7)" }}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded font-display text-sm"
              style={{ background: ACCENT_SOFT, color: ACCENT, border: `1px solid ${ACCENT_BORDER}` }}
            >
              G
            </span>
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.5)" }}>
              GrowthOS
            </span>
          </div>
          <p className="text-xs" style={{ color: "rgba(242,237,230,0.4)" }}>
            For personalised outreach. No bulk send. Comply with local laws.
          </p>
        </div>
      </footer>
    </div>
  );
}
