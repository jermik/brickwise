import Link from "next/link";
import { readLeads } from "@/lib/crm/store";
import { PipelineOverview, StatCard } from "@/components/crm/pipeline-overview";
import { StatusBadge } from "@/components/crm/status-badge";
import type { Lead, LeadStatus } from "@/lib/crm/types";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function computeStats(leads: Lead[]) {
  const now = new Date();
  const todayStart = startOfToday();
  const todayEnd = endOfToday();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const byStatus: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const byCity: Record<string, number> = {};
  let contactedThisWeek = 0;
  let estimatedPipeline = 0;
  let followUpsDueToday = 0;
  let followUpsOverdue = 0;
  let newThisWeek = 0;

  for (const lead of leads) {
    byStatus[lead.status] = (byStatus[lead.status] ?? 0) + 1;
    byCategory[lead.category] = (byCategory[lead.category] ?? 0) + 1;
    byCity[lead.city] = (byCity[lead.city] ?? 0) + 1;
    if (lead.lastContactedAt && new Date(lead.lastContactedAt) >= weekAgo) {
      contactedThisWeek++;
    }
    if (lead.createdAt && new Date(lead.createdAt) >= weekAgo) {
      newThisWeek++;
    }
    if (lead.estimatedValue && ["replied", "meeting_booked", "proposal_sent", "won"].includes(lead.status)) {
      estimatedPipeline += lead.estimatedValue;
    }
    for (const f of lead.followUps) {
      if (f.completed) continue;
      const due = new Date(f.dueAt);
      if (due < todayStart) followUpsOverdue++;
      else if (due >= todayStart && due <= todayEnd) followUpsDueToday++;
    }
  }

  return {
    byStatus,
    byCategory,
    byCity,
    contactedThisWeek,
    estimatedPipeline,
    followUpsDueToday,
    followUpsOverdue,
    newThisWeek,
  };
}

function bestOpportunities(leads: Lead[]): Lead[] {
  return [...leads]
    .filter((l) => !l.doNotContact && !l.unsubscribed)
    .filter((l) => l.websiteScore != null && l.estimatedValue != null)
    .map((l) => ({
      lead: l,
      score:
        ((100 - (l.websiteScore ?? 50)) +
          (100 - (l.seoScore ?? 50)) +
          (100 - (l.automationScore ?? 50))) /
          3 *
          0.5 +
        (l.estimatedValue ?? 0) / 100,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((x) => x.lead);
}

export default async function CRMDashboard() {
  const leads = await readLeads();
  const stats = computeStats(leads);
  const opportunities = bestOpportunities(leads);

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const topCities = Object.entries(stats.byCity).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topCategories = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="px-8 py-8 space-y-8 max-w-6xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#F2EDE6" }}>
            Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(242,237,230,0.45)" }}>
            {leads.length} total leads · {stats.newThisWeek} new this week
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/crm/leads/new"
            className="px-4 py-2 rounded text-sm font-medium hover:opacity-90"
            style={{ background: "#f59e0b", color: "#0A0907" }}
          >
            + Add lead
          </Link>
          <Link
            href="/crm/leads/import"
            className="px-4 py-2 rounded text-sm"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.7)", border: "1px solid #2A2420" }}
          >
            Import CSV
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard label="Total" value={leads.length} />
        <StatCard label="New / wk" value={stats.newThisWeek} accent="#60a5fa" />
        <StatCard label="Contacted / wk" value={stats.contactedThisWeek} accent="#f59e0b" />
        <StatCard label="Replies" value={stats.byStatus["replied"] ?? 0} accent="#a78bfa" />
        <StatCard label="Meetings" value={stats.byStatus["meeting_booked"] ?? 0} accent="#34d399" />
        <StatCard label="Won" value={stats.byStatus["won"] ?? 0} accent="#10b981" />
        <StatCard
          label="Pipeline"
          value={stats.estimatedPipeline > 0 ? `€${(stats.estimatedPipeline / 1000).toFixed(0)}k` : "—"}
          accent="#f59e0b"
        />
      </div>

      {/* Follow-ups due today / overdue */}
      {(stats.followUpsDueToday > 0 || stats.followUpsOverdue > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stats.followUpsDueToday > 0 && (
            <Link
              href="/crm/follow-ups"
              className="flex items-center gap-3 rounded-lg px-4 py-3"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}
            >
              <span style={{ color: "#f59e0b" }}>◷</span>
              <span className="text-sm" style={{ color: "#f59e0b" }}>
                {stats.followUpsDueToday} follow-up{stats.followUpsDueToday !== 1 ? "s" : ""} due today
              </span>
              <span className="ml-auto text-xs" style={{ color: "rgba(245,158,11,0.7)" }}>View →</span>
            </Link>
          )}
          {stats.followUpsOverdue > 0 && (
            <Link
              href="/crm/follow-ups"
              className="flex items-center gap-3 rounded-lg px-4 py-3"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)" }}
            >
              <span style={{ color: "#f87171" }}>!</span>
              <span className="text-sm" style={{ color: "#f87171" }}>
                {stats.followUpsOverdue} follow-up{stats.followUpsOverdue !== 1 ? "s" : ""} overdue
              </span>
              <span className="ml-auto text-xs" style={{ color: "rgba(248,113,113,0.7)" }}>View →</span>
            </Link>
          )}
        </div>
      )}

      {/* Pipeline + breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg p-5 space-y-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
          <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
            Pipeline
          </h2>
          {leads.length === 0 ? (
            <p className="text-sm" style={{ color: "rgba(242,237,230,0.3)" }}>No leads yet.</p>
          ) : (
            <PipelineOverview byStatus={stats.byStatus} total={leads.length} />
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg p-5 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
              Top cities
            </h2>
            {topCities.length === 0 ? (
              <p className="text-xs" style={{ color: "rgba(242,237,230,0.3)" }}>—</p>
            ) : (
              <div className="space-y-1.5">
                {topCities.map(([city, count]) => (
                  <div key={city} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "rgba(242,237,230,0.75)" }}>{city}</span>
                    <span className="font-mono text-xs" style={{ color: "#f59e0b" }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-lg p-5 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
              Top categories
            </h2>
            {topCategories.length === 0 ? (
              <p className="text-xs" style={{ color: "rgba(242,237,230,0.3)" }}>—</p>
            ) : (
              <div className="space-y-1.5">
                {topCategories.map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "rgba(242,237,230,0.75)" }}>{cat}</span>
                    <span className="font-mono text-xs" style={{ color: "#f59e0b" }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Best opportunities */}
      {opportunities.length > 0 && (
        <div className="rounded-lg p-5 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#f59e0b" }}>
              ★ Best opportunities
            </h2>
            <Link href="/crm/leads" className="text-xs underline" style={{ color: "rgba(242,237,230,0.4)" }}>
              View all
            </Link>
          </div>
          <p className="text-xs" style={{ color: "rgba(242,237,230,0.45)" }}>
            Highest improvement potential × deal value, audit-completed leads only.
          </p>
          <div className="space-y-1">
            {opportunities.map((lead) => (
              <Link
                key={lead.id}
                href={`/crm/leads/${lead.id}`}
                className="flex items-center gap-3 rounded px-2 py-2 hover:bg-white/[0.02]"
              >
                <span className="flex-1 text-sm" style={{ color: "#F2EDE6" }}>{lead.businessName}</span>
                <span className="text-xs" style={{ color: "rgba(242,237,230,0.45)" }}>{lead.city}</span>
                <span className="font-mono text-xs" style={{ color: "#34d399" }}>
                  {lead.estimatedValue ? `€${(lead.estimatedValue / 1000).toFixed(1)}k` : "—"}
                </span>
                <StatusBadge status={lead.status as LeadStatus} size="sm" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentLeads.length > 0 && (
        <div className="rounded-lg p-5 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
              Recent activity
            </h2>
            <Link href="/crm/leads" className="text-xs underline" style={{ color: "#f59e0b" }}>
              View all
            </Link>
          </div>
          <div className="space-y-1">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/crm/leads/${lead.id}`}
                className="flex items-center gap-3 rounded px-2 py-2 hover:bg-white/[0.02]"
              >
                <span className="flex-1 text-sm" style={{ color: "#F2EDE6" }}>{lead.businessName}</span>
                <span className="text-xs" style={{ color: "rgba(242,237,230,0.45)" }}>{lead.city}</span>
                <StatusBadge status={lead.status as LeadStatus} size="sm" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {leads.length === 0 && (
        <div className="rounded-lg px-6 py-12 text-center space-y-4" style={{ border: "2px dashed #2A2420" }}>
          <p className="font-display text-xl" style={{ color: "rgba(242,237,230,0.5)" }}>No leads yet</p>
          <p className="text-sm" style={{ color: "rgba(242,237,230,0.35)" }}>
            Add your first lead manually or import a CSV file.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/crm/leads/new" className="px-4 py-2 rounded text-sm font-medium" style={{ background: "#f59e0b", color: "#0A0907" }}>
              Add first lead
            </Link>
            <Link href="/crm/leads/import" className="px-4 py-2 rounded text-sm" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.7)", border: "1px solid #2A2420" }}>
              Import CSV
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
