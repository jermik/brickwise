"use client";

import { useState } from "react";
import type { ProposalPackage, OutreachEmail, Locale } from "@/lib/crm/proposal/package";

interface Props {
  packages: Record<Locale, ProposalPackage>;
}

const SEVERITY_COLOR: Record<string, string> = {
  critical: "#ef4444",
  high: "#f87171",
  medium: "#f59e0b",
  low: "#9ca3af",
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function CopyButton({ text, label = "Copy", small = false }: { text: string; label?: string; small?: boolean }) {
  const [done, setDone] = useState(false);
  async function handle() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }
  return (
    <button
      type="button"
      onClick={handle}
      className={`rounded text-xs ${small ? "px-2 py-0.5" : "px-3 py-1.5"}`}
      style={{
        background: done ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)",
        color: done ? "#10b981" : "#F2EDE6",
        border: `1px solid ${done ? "rgba(16,185,129,0.3)" : "#2A2420"}`,
      }}
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}

type SendStatus =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok"; sentAt: string; from?: string }
  | { kind: "error"; message: string };

function EmailBlockControlled({
  title,
  email,
  recipient,
  onRecipientChange,
  leadId,
  locale,
}: {
  title: string;
  email: OutreachEmail;
  recipient: string;
  onRecipientChange: (v: string) => void;
  leadId: string;
  locale: Locale;
}) {
  const setRecipient = onRecipientChange;
  const [status, setStatus] = useState<SendStatus>({ kind: "idle" });

  async function handleSend() {
    if (!recipient.trim()) {
      setStatus({ kind: "error", message: locale === "nl" ? "Vul een ontvanger in." : "Recipient is required." });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          recipient: recipient.trim(),
          subject: email.subject,
          body: email.body,
          locale,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        sentAt?: string;
        from?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus({ kind: "error", message: data.error ?? `Failed (${res.status}).` });
        return;
      }
      setStatus({ kind: "ok", sentAt: data.sentAt ?? new Date().toISOString(), from: data.from });
    } catch (e) {
      setStatus({ kind: "error", message: e instanceof Error ? e.message : "Network error." });
    }
  }

  const labelSendIdle = locale === "nl" ? "E-mail versturen" : "Send email";
  const labelSending = locale === "nl" ? "Versturen…" : "Sending…";

  return (
    <div className="rounded-lg p-4 space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #2A2420" }}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.5)" }}>
          {title}
        </p>
        <div className="flex gap-1.5">
          <CopyButton text={email.subject} label="Copy subject" small />
          <CopyButton text={email.body} label="Copy body" small />
          <CopyButton text={`To: ${recipient}\nSubject: ${email.subject}\n\n${email.body}`} label="Copy all" small />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-2 items-start">
        <label className="text-xs" style={{ color: "rgba(242,237,230,0.4)" }}>To</label>
        <input
          type="email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="recipient@example.com"
          style={{
            background: "#0A0907",
            border: "1px solid #2A2420",
            color: "#F2EDE6",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 13,
            outline: "none",
            width: "100%",
          }}
        />

        <label className="text-xs" style={{ color: "rgba(242,237,230,0.4)" }}>Subject</label>
        <input
          type="text"
          value={email.subject}
          readOnly
          style={{
            background: "#0A0907",
            border: "1px solid #2A2420",
            color: "#F2EDE6",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 13,
            outline: "none",
            width: "100%",
          }}
        />
      </div>

      <textarea
        readOnly
        value={email.body}
        style={{
          background: "#0A0907",
          border: "1px solid #2A2420",
          color: "#F2EDE6",
          borderRadius: 8,
          padding: 14,
          fontSize: 12.5,
          lineHeight: 1.6,
          fontFamily: "var(--font-dm-mono)",
          width: "100%",
          minHeight: 240,
          resize: "vertical",
          outline: "none",
        }}
      />

      <div className="flex flex-wrap gap-2">
        <a
          href={`mailto:${recipient}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`}
          className="px-3 py-1.5 rounded text-xs"
          style={{ background: "rgba(255,255,255,0.06)", color: "#F2EDE6", border: "1px solid #2A2420" }}
        >
          {locale === "nl" ? "Openen in mailprogramma →" : "Open in mail client →"}
        </a>
        <button
          type="button"
          onClick={handleSend}
          disabled={status.kind === "sending"}
          className="px-3 py-1.5 rounded text-xs font-medium"
          style={{
            background: "#f59e0b",
            color: "#0A0907",
            opacity: status.kind === "sending" ? 0.6 : 1,
          }}
          title={locale === "nl"
            ? "Verstuur direct via Resend vanuit growth@brickwise.pro"
            : "Send directly via Resend from growth@brickwise.pro"}
        >
          {status.kind === "sending" ? labelSending : labelSendIdle}
        </button>
      </div>

      {/* Send-status banner — persists until next send. */}
      {status.kind === "ok" && (
        <div
          className="rounded px-3 py-2 text-xs"
          style={{ background: "rgba(16,185,129,0.08)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" }}
        >
          {locale === "nl"
            ? `E-mail verstuurd vanuit ${status.from ?? "growth@brickwise.pro"} op ${new Date(status.sentAt).toLocaleString("nl-NL")}.`
            : `Email sent from ${status.from ?? "growth@brickwise.pro"} at ${new Date(status.sentAt).toLocaleString("en-GB")}.`}
        </div>
      )}
      {status.kind === "error" && (
        <div
          className="rounded px-3 py-2 text-xs"
          style={{ background: "rgba(248,113,113,0.08)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}

export function ProposalPackageView({ packages }: Props) {
  const [locale, setLocale] = useState<Locale>("en");
  const pkg = packages[locale];

  // Recipient state lives at this level so it persists across language toggles.
  const [recipient, setRecipient] = useState<string>(packages.en.outreachEmail.recipient ?? "");

  return (
    <div className="space-y-6">
      {/* Header / actions */}
      <div className="rounded-lg p-4 flex flex-wrap items-center justify-between gap-3" style={{ background: "#131109", border: "1px solid rgba(245,158,11,0.25)" }}>
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#f59e0b" }}>
            Proposal package
          </p>
          <p className="text-sm mt-0.5" style={{ color: "rgba(242,237,230,0.6)" }}>
            Demo-quality, deterministic. Review every section before sending.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Language selector — toggles which package is shown / copied. */}
          <div className="flex rounded-md p-0.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2A2420" }}>
            {(["en", "nl"] as const).map((loc) => (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                className="px-2.5 py-1 rounded text-xs font-mono"
                style={{
                  background: locale === loc ? "rgba(245,158,11,0.18)" : "transparent",
                  color: locale === loc ? "#f59e0b" : "rgba(242,237,230,0.55)",
                }}
              >
                {loc === "en" ? "English" : "Nederlands"}
              </button>
            ))}
          </div>
          <CopyButton text={pkg.fullProposalText} label="Copy entire proposal" />
        </div>
      </div>

      {/* Section 1 — Executive summary */}
      <section className="rounded-lg p-5 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.5)" }}>
            1 · Executive summary
          </p>
          <CopyButton text={pkg.executiveSummary} small />
        </div>
        <p className="text-sm whitespace-pre-line" style={{ color: "rgba(242,237,230,0.8)", lineHeight: 1.7 }}>
          {pkg.executiveSummary}
        </p>
      </section>

      {/* Section 2 — Priority problems */}
      <section className="rounded-lg p-5 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.5)" }}>
          2 · Priority issues
        </p>
        <div className="space-y-3">
          {pkg.priorityProblems.length === 0 && (
            <p className="text-xs" style={{ color: "rgba(242,237,230,0.4)" }}>No priority issues — site appears in good shape.</p>
          )}
          {pkg.priorityProblems.map((p, i) => (
            <div key={i} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #2A2420" }}>
              <div className="flex items-start gap-3 mb-2">
                <span className="font-display text-xl" style={{ color: SEVERITY_COLOR[p.severity] ?? "#9ca3af" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base" style={{ color: "#F2EDE6" }}>{p.title}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: `${SEVERITY_COLOR[p.severity]}22`, color: SEVERITY_COLOR[p.severity] }}>
                      {p.severity}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-sm pl-12">
                <p style={{ color: "rgba(242,237,230,0.75)" }}>
                  <span className="font-mono text-[10px] uppercase tracking-wider mr-2" style={{ color: "rgba(242,237,230,0.4)" }}>Why</span>
                  {p.whyItMatters}
                </p>
                <p style={{ color: "rgba(242,237,230,0.75)" }}>
                  <span className="font-mono text-[10px] uppercase tracking-wider mr-2" style={{ color: "rgba(242,237,230,0.4)" }}>Impact</span>
                  {p.potentialImpact}
                </p>
                <p style={{ color: "rgba(242,237,230,0.75)" }}>
                  <span className="font-mono text-[10px] uppercase tracking-wider mr-2" style={{ color: "rgba(242,237,230,0.4)" }}>Fix</span>
                  {p.howToImprove}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — Recommended upgrades */}
      <section className="rounded-lg p-5 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.5)" }}>
          3 · Recommended upgrades
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pkg.recommendedUpgrades.length === 0 && (
            <p className="text-xs col-span-full" style={{ color: "rgba(242,237,230,0.4)" }}>No upgrades needed — every dimension is already healthy.</p>
          )}
          {pkg.recommendedUpgrades.map((u, i) => (
            <div key={i} className="rounded-lg p-4 space-y-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #2A2420" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base" style={{ color: "#F2EDE6" }}>{u.title}</h3>
                <div className="flex gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: u.priority === 1 ? "rgba(248,113,113,0.15)" : u.priority === 2 ? "rgba(245,158,11,0.15)" : "rgba(156,163,175,0.15)", color: u.priority === 1 ? "#f87171" : u.priority === 2 ? "#f59e0b" : "#9ca3af" }}>
                    P{u.priority}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.55)" }}>
                    {DIFFICULTY_LABEL[u.difficulty]}
                  </span>
                </div>
              </div>
              <p className="text-xs" style={{ color: "rgba(242,237,230,0.7)" }}>{u.shortExplanation}</p>
              <p className="text-xs" style={{ color: "rgba(242,237,230,0.55)" }}>
                <span style={{ color: "#34d399" }}>Benefit:</span> {u.expectedBenefit}
              </p>
              <div className="flex items-center justify-between pt-1.5" style={{ borderTop: "1px solid #2A2420" }}>
                <span className="font-mono text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                  {u.estimatedHours.min}–{u.estimatedHours.max}h
                </span>
                {u.relatedOfferName && (
                  <span className="font-mono text-[10px]" style={{ color: "#f59e0b" }}>
                    {u.relatedOfferName} · {u.relatedOfferPrice}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 — Outreach email */}
      <section className="rounded-lg p-5 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.5)" }}>
          4 · Outreach
        </p>
        <EmailBlockControlled
          title={locale === "nl" ? "Eerste e-mail" : "Initial email"}
          email={pkg.outreachEmail}
          recipient={recipient}
          onRecipientChange={setRecipient}
          leadId={pkg.lead.id}
          locale={locale}
        />
        <EmailBlockControlled
          title={locale === "nl" ? "Vervolgmail" : "Follow-up email"}
          email={pkg.followUpEmail}
          recipient={recipient}
          onRecipientChange={setRecipient}
          leadId={pkg.lead.id}
          locale={locale}
        />
      </section>

      {/* Compliance reminder */}
      <p className="text-[11px] text-center" style={{ color: "rgba(242,237,230,0.35)" }}>
        Generated {new Date(pkg.generatedAt).toLocaleString()} · Based on visible website signals only · Always personalise before sending
      </p>
    </div>
  );
}
