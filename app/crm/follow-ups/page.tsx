import Link from "next/link";
import { readLeads } from "@/lib/crm/store";
import { FollowUpActions } from "@/components/crm/follow-up-actions";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    weekday: "short", day: "numeric", month: "short",
  });
}

export default async function FollowUpsPage() {
  const leads = await readLeads();
  const now = new Date();

  type EnrichedFollowUp = {
    id: string;
    leadId: string;
    leadName: string;
    city: string;
    dueAt: string;
    notes?: string;
    completed: boolean;
    isOverdue: boolean;
  };

  const pending: EnrichedFollowUp[] = leads
    .filter((l) => !l.doNotContact && !l.unsubscribed)
    .flatMap((l) =>
      l.followUps
        .filter((f) => !f.completed)
        .map((f) => ({
          ...f,
          leadId: l.id,
          leadName: l.businessName,
          city: l.city,
          isOverdue: new Date(f.dueAt) < now,
        }))
    )
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  const overdue = pending.filter((f) => f.isOverdue);
  const upcoming = pending.filter((f) => !f.isOverdue);

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl" style={{ color: "#F2EDE6" }}>
          Follow-ups
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.45)" }}>
          {overdue.length > 0
            ? `${overdue.length} overdue · ${upcoming.length} upcoming`
            : `${upcoming.length} upcoming follow-up${upcoming.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Compliance note */}
      <div className="rounded px-3 py-2 text-xs" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", color: "rgba(242,237,230,0.55)" }}>
        Stop after 2 follow-ups unless the lead has replied. Never contact do-not-contact leads.
      </div>

      {pending.length === 0 && (
        <div className="rounded-lg px-6 py-12 text-center" style={{ border: "2px dashed #2A2420" }}>
          <p className="text-xl font-display mb-1" style={{ color: "rgba(242,237,230,0.4)" }}>All clear</p>
          <p className="text-sm" style={{ color: "rgba(242,237,230,0.3)" }}>No pending follow-ups.</p>
        </div>
      )}

      {overdue.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#f87171" }}>
            Overdue ({overdue.length})
          </h2>
          <div className="space-y-2">
            {overdue.map((f) => (
              <FollowUpRow key={f.id} fu={f} overdue />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
            Upcoming ({upcoming.length})
          </h2>
          <div className="space-y-2">
            {upcoming.map((f) => (
              <FollowUpRow key={f.id} fu={f} overdue={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FollowUpRow({
  fu,
  overdue,
}: {
  fu: { id: string; leadId: string; leadName: string; city: string; dueAt: string; notes?: string };
  overdue: boolean;
}) {
  return (
    <div
      className="rounded-lg px-4 py-3 flex items-center gap-4"
      style={{
        background: overdue ? "rgba(248,113,113,0.06)" : "#131109",
        border: `1px solid ${overdue ? "rgba(248,113,113,0.2)" : "#2A2420"}`,
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/crm/leads/${fu.leadId}`}
            className="text-sm font-medium hover:underline"
            style={{ color: "#F2EDE6" }}
          >
            {fu.leadName}
          </Link>
          <span className="text-xs" style={{ color: "rgba(242,237,230,0.4)" }}>{fu.city}</span>
        </div>
        <p className="font-mono text-xs mt-0.5" style={{ color: overdue ? "#f87171" : "rgba(242,237,230,0.5)" }}>
          {fmt(fu.dueAt)} {overdue && "— OVERDUE"}
        </p>
        {fu.notes && <p className="text-xs mt-1" style={{ color: "rgba(242,237,230,0.45)" }}>{fu.notes}</p>}
      </div>
      <FollowUpActions leadId={fu.leadId} followUpId={fu.id} />
    </div>
  );
}
