import { notFound } from "next/navigation";
import Link from "next/link";
import { findLead } from "@/lib/crm/store";
import { StatusBadge } from "@/components/crm/status-badge";
import { ScoreBar } from "@/components/crm/score-bar";
import { ContactLogger } from "@/components/crm/contact-logger";
import { StatusUpdater } from "@/components/crm/status-updater";
import { LeadActions } from "@/components/crm/lead-actions";

function fmt(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-ZA", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await findLead(id);
  if (!lead) notFound();

  const pendingFollowUps = lead.followUps
    .filter((f) => !f.completed)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  const contactHistory = [...lead.contacts].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  const TYPE_ICONS: Record<string, string> = {
    email: "✉",
    call: "☎",
    linkedin: "⌥",
    visit: "◈",
    other: "◎",
  };

  return (
    <div className="px-8 py-8 space-y-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(242,237,230,0.4)" }}>
        <Link href="/crm" className="hover:opacity-70">CRM</Link>
        <span>/</span>
        <Link href="/crm/leads" className="hover:opacity-70">Leads</Link>
        <span>/</span>
        <span style={{ color: "rgba(242,237,230,0.7)" }}>{lead.businessName}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start gap-4 justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl" style={{ color: "#F2EDE6" }}>
              {lead.businessName}
            </h1>
            {lead.doNotContact && (
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}>
                DO NOT CONTACT
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: "rgba(242,237,230,0.55)" }}>
              {lead.category} · {lead.city}
              {lead.province ? `, ${lead.province}` : ""}
            </span>
            <StatusBadge status={lead.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/crm/leads/${id}/audit`}
            className="px-3 py-2 rounded text-sm transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.7)", border: "1px solid #2A2420" }}
          >
            Website audit
          </Link>
          <Link
            href={`/crm/leads/${id}/proposal`}
            className="px-3 py-2 rounded text-sm font-medium"
            style={{ background: "#f59e0b", color: "#0A0907" }}
          >
            Proposal →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Business info */}
          <div className="rounded-lg p-5 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
              Contact details
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {lead.website && (
                <>
                  <span style={{ color: "rgba(242,237,230,0.45)" }}>Website</span>
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="underline truncate" style={{ color: "#f59e0b" }}>
                    {lead.website.replace(/^https?:\/\//, "")}
                  </a>
                </>
              )}
              {lead.email && (
                <>
                  <span style={{ color: "rgba(242,237,230,0.45)" }}>Email</span>
                  <a href={`mailto:${lead.email}`} className="font-mono text-xs" style={{ color: "#F2EDE6" }}>{lead.email}</a>
                </>
              )}
              {lead.phone && (
                <>
                  <span style={{ color: "rgba(242,237,230,0.45)" }}>Phone</span>
                  <span className="font-mono text-xs" style={{ color: "#F2EDE6" }}>{lead.phone}</span>
                </>
              )}
              {lead.googleMapsUrl && (
                <>
                  <span style={{ color: "rgba(242,237,230,0.45)" }}>Google Maps</span>
                  <a href={lead.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="underline text-xs" style={{ color: "#60a5fa" }}>View on Maps ↗</a>
                </>
              )}
              {lead.contactPageUrl && (
                <>
                  <span style={{ color: "rgba(242,237,230,0.45)" }}>Contact page</span>
                  <a href={lead.contactPageUrl} target="_blank" rel="noopener noreferrer" className="underline text-xs" style={{ color: "#60a5fa" }}>Open ↗</a>
                </>
              )}
              <span style={{ color: "rgba(242,237,230,0.45)" }}>Added</span>
              <span className="font-mono text-xs" style={{ color: "rgba(242,237,230,0.65)" }}>{fmt(lead.createdAt)}</span>
              <span style={{ color: "rgba(242,237,230,0.45)" }}>Last contact</span>
              <span className="font-mono text-xs" style={{ color: "rgba(242,237,230,0.65)" }}>{fmt(lead.lastContactedAt)}</span>
              <span style={{ color: "rgba(242,237,230,0.45)" }}>Consent</span>
              <span className="font-mono text-xs capitalize" style={{ color: "rgba(242,237,230,0.65)" }}>
                {lead.consentStatus.replace("_", " ")}
              </span>
            </div>
            {lead.notes && (
              <div className="pt-2" style={{ borderTop: "1px solid #2A2420" }}>
                <p className="text-xs mb-1" style={{ color: "rgba(242,237,230,0.45)" }}>Notes</p>
                <p className="text-sm" style={{ color: "rgba(242,237,230,0.75)" }}>{lead.notes}</p>
              </div>
            )}
            <div className="pt-2" style={{ borderTop: "1px solid #2A2420" }}>
              <Link href={`/crm/leads/${id}/edit`} className="text-xs underline" style={{ color: "rgba(242,237,230,0.4)" }}>
                Edit details
              </Link>
            </div>
          </div>

          {/* Audit scores */}
          {(lead.websiteScore != null || lead.seoScore != null || lead.automationScore != null) && (
            <div className="rounded-lg p-5 space-y-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
                  Website audit
                </h2>
                <Link href={`/crm/leads/${id}/audit`} className="text-xs underline" style={{ color: "#f59e0b" }}>
                  Edit audit
                </Link>
              </div>
              <ScoreBar label="Website" value={lead.websiteScore} color="#f59e0b" />
              <ScoreBar label="Local SEO" value={lead.seoScore} color="#60a5fa" />
              <ScoreBar label="Conversion" value={lead.conversionScore} color="#a78bfa" />
              <ScoreBar label="Automation opportunity" value={lead.automationScore} color="#34d399" />
              {lead.auditSummary && (
                <p className="text-xs pt-2" style={{ color: "rgba(242,237,230,0.6)", borderTop: "1px solid #2A2420" }}>
                  {lead.auditSummary}
                </p>
              )}
              {((lead.topProblems?.length ?? 0) > 0 || (lead.topImprovements?.length ?? 0) > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                  {lead.topProblems && lead.topProblems.length > 0 && (
                    <div className="rounded p-3 space-y-1" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.18)" }}>
                      <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#f87171" }}>Top problems</p>
                      <ol className="text-[11px] space-y-0.5" style={{ color: "rgba(242,237,230,0.7)" }}>
                        {lead.topProblems.map((p, i) => (<li key={i}>{i + 1}. {p}</li>))}
                      </ol>
                    </div>
                  )}
                  {lead.topImprovements && lead.topImprovements.length > 0 && (
                    <div className="rounded p-3 space-y-1" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.18)" }}>
                      <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#10b981" }}>Top improvements</p>
                      <ol className="text-[11px] space-y-0.5" style={{ color: "rgba(242,237,230,0.7)" }}>
                        {lead.topImprovements.map((p, i) => (<li key={i}>{i + 1}. {p}</li>))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Log contact */}
          {!lead.doNotContact && !lead.unsubscribed && (
            <ContactLogger leadId={id} />
          )}

          {(lead.doNotContact || lead.unsubscribed) && (
            <div className="rounded-lg px-4 py-3" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <p className="text-sm" style={{ color: "#f87171" }}>
                {lead.doNotContact ? "Do Not Contact flag is set." : "This lead has unsubscribed."} Outreach is blocked.
              </p>
            </div>
          )}

          {/* Contact history */}
          {contactHistory.length > 0 && (
            <div className="rounded-lg p-5 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
              <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
                Contact history
              </h2>
              <div className="space-y-2">
                {contactHistory.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <span className="mt-0.5 text-sm" style={{ color: "rgba(242,237,230,0.4)" }}>
                      {TYPE_ICONS[c.type] ?? "◎"}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs capitalize font-medium" style={{ color: "#F2EDE6" }}>{c.type}</span>
                        <span className="font-mono text-[10px]" style={{ color: "rgba(242,237,230,0.35)" }}>{fmtTime(c.sentAt)}</span>
                      </div>
                      {c.message && <p className="text-xs mt-0.5" style={{ color: "rgba(242,237,230,0.55)" }}>{c.message}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column — status, follow-ups */}
        <div className="space-y-5">
          {/* Status updater */}
          <div className="rounded-lg p-4 space-y-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <StatusUpdater lead={lead} />
          </div>

          {/* Manual offer override + delete */}
          <div className="rounded-lg p-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <LeadActions leadId={lead.id} currentOffer={lead.proposalOffer} />
          </div>

          {/* Follow-ups */}
          <div className="rounded-lg p-4 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
              Follow-ups
            </h2>
            {pendingFollowUps.length === 0 ? (
              <p className="text-xs" style={{ color: "rgba(242,237,230,0.35)" }}>No pending follow-ups.</p>
            ) : (
              <div className="space-y-2">
                {pendingFollowUps.map((f) => {
                  const isOverdue = new Date(f.dueAt) < new Date();
                  return (
                    <div
                      key={f.id}
                      className="rounded px-3 py-2 text-xs"
                      style={{
                        background: isOverdue ? "rgba(248,113,113,0.08)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isOverdue ? "rgba(248,113,113,0.2)" : "#2A2420"}`,
                      }}
                    >
                      <p className="font-mono" style={{ color: isOverdue ? "#f87171" : "rgba(242,237,230,0.65)" }}>
                        {fmt(f.dueAt)} {isOverdue && "— OVERDUE"}
                      </p>
                      {f.notes && <p className="mt-0.5" style={{ color: "rgba(242,237,230,0.45)" }}>{f.notes}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="space-y-1.5">
            {!lead.auditChecklist && (
              <Link
                href={`/crm/leads/${id}/audit`}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}
              >
                <span>◈</span> Run website audit
              </Link>
            )}
            {!lead.proposalEmail && (
              <Link
                href={`/crm/leads/${id}/proposal`}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors"
                style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa" }}
              >
                <span>◎</span> Generate proposal
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
