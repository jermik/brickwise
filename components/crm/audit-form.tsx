"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAuditAction } from "@/lib/crm/actions";
import {
  AUDIT_FIELDS_BY_DIMENSION,
  DIMENSION_LABELS,
  DIMENSION_COLORS,
  EMPTY_AUDIT_CHECKLIST,
  type AuditChecklist,
  type AuditChecklistKey,
  type AuditDimension,
  type Lead,
} from "@/lib/crm/types";
import {
  computeAllScores,
  computeTopProblems,
  computeTopImprovements,
} from "@/lib/crm/scoring";
import { ScoreBar } from "./score-bar";

interface AuditFormProps {
  lead: Lead;
}

const DIMS: AuditDimension[] = ["website", "seo", "conversion", "automation"];

export function AuditForm({ lead }: AuditFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState<AuditChecklist>(
    lead.auditChecklist ?? EMPTY_AUDIT_CHECKLIST,
  );

  const scores = computeAllScores(checklist);
  const topProblems = computeTopProblems(checklist);
  const topImprovements = computeTopImprovements(checklist);

  function toggle(key: AuditChecklistKey) {
    setChecklist((c) => ({ ...c, [key]: !c[key] }));
  }

  function setAllInDimension(dim: AuditDimension, value: boolean) {
    const updates: Partial<AuditChecklist> = {};
    for (const f of AUDIT_FIELDS_BY_DIMENSION[dim]) {
      updates[f.key] = value;
    }
    setChecklist((c) => ({ ...c, ...updates }));
  }

  function handleSave() {
    setError("");
    startTransition(async () => {
      try {
        await saveAuditAction(lead.id, checklist);
        router.push(`/crm/leads/${lead.id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save audit. Try again.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Live scores */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: "#131109", border: "1px solid #2A2420" }}
      >
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          Live scores
        </p>
        <ScoreBar label="Website basics" value={scores.websiteScore} color={DIMENSION_COLORS.website} />
        <ScoreBar label="Local SEO" value={scores.seoScore} color={DIMENSION_COLORS.seo} />
        <ScoreBar label="Conversion" value={scores.conversionScore} color={DIMENSION_COLORS.conversion} />
        <ScoreBar label="Automation opportunity" value={scores.automationScore} color={DIMENSION_COLORS.automation} />
      </div>

      {/* Top problems / improvements live preview */}
      {topProblems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg p-4 space-y-2" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#f87171" }}>
              Top 3 problems
            </p>
            <ol className="space-y-1.5 text-xs" style={{ color: "rgba(242,237,230,0.75)" }}>
              {topProblems.map((p, i) => (
                <li key={i}>{i + 1}. {p}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-lg p-4 space-y-2" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#10b981" }}>
              Top 3 improvements
            </p>
            <ol className="space-y-1.5 text-xs" style={{ color: "rgba(242,237,230,0.75)" }}>
              {topImprovements.map((p, i) => (
                <li key={i}>{i + 1}. {p}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Website link helper */}
      {lead.website && (
        <a
          href={lead.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs underline"
          style={{ color: "#f59e0b" }}
        >
          Open {lead.businessName} website ↗
        </a>
      )}

      {/* Checklist groups */}
      {DIMS.map((dim) => {
        const fields = AUDIT_FIELDS_BY_DIMENSION[dim];
        const passed = fields.filter((f) => checklist[f.key]).length;
        return (
          <section key={dim} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3
                className="font-mono text-[11px] tracking-widest uppercase flex items-center gap-2"
                style={{ color: DIMENSION_COLORS[dim] }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: DIMENSION_COLORS[dim] }} />
                {DIMENSION_LABELS[dim]}
                <span className="font-mono text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>
                  {passed}/{fields.length}
                </span>
              </h3>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setAllInDimension(dim, true)}
                  className="text-[10px] px-2 py-0.5 rounded"
                  style={{ background: "rgba(255,255,255,0.04)", color: "rgba(242,237,230,0.5)", border: "1px solid #2A2420" }}
                >
                  all
                </button>
                <button
                  type="button"
                  onClick={() => setAllInDimension(dim, false)}
                  className="text-[10px] px-2 py-0.5 rounded"
                  style={{ background: "rgba(255,255,255,0.04)", color: "rgba(242,237,230,0.5)", border: "1px solid #2A2420" }}
                >
                  none
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              {fields.map((field) => (
                <label
                  key={field.key}
                  className="flex items-center gap-3 cursor-pointer rounded-md px-3 py-2 transition-colors"
                  style={{
                    background: checklist[field.key] ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${checklist[field.key] ? "rgba(16,185,129,0.18)" : "#2A2420"}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checklist[field.key]}
                    onChange={() => toggle(field.key)}
                    style={{ accentColor: "#10b981", width: 14, height: 14 }}
                  />
                  <span className="text-sm flex-1" style={{ color: checklist[field.key] ? "#F2EDE6" : "rgba(242,237,230,0.6)" }}>
                    {field.label}
                  </span>
                  {field.impact === 3 && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
                      high
                    </span>
                  )}
                  <span className="font-mono text-[10px]" style={{ color: checklist[field.key] ? "#10b981" : "rgba(242,237,230,0.3)" }}>
                    {checklist[field.key] ? "✓" : "✗"}
                  </span>
                </label>
              ))}
            </div>
          </section>
        );
      })}

      {error && (
        <p className="text-sm px-3 py-2 rounded" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
          {error}
        </p>
      )}

      {/* Save + Make Proposal */}
      <div className="flex flex-wrap gap-3 pt-2 sticky bottom-0 py-3" style={{ background: "linear-gradient(to top, #0A0907 60%, transparent)" }}>
        <button
          onClick={handleSave}
          disabled={pending}
          className="px-5 py-2.5 rounded text-sm font-medium transition-opacity"
          style={{ background: "#f59e0b", color: "#0A0907", opacity: pending ? 0.6 : 1 }}
        >
          {pending ? "Saving audit…" : "Save audit"}
        </button>
        <a
          href={`/crm/leads/${lead.id}/proposal-package`}
          className="px-5 py-2.5 rounded text-sm font-medium"
          style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}
          title="Save the audit first if you've made changes — then generate the proposal package"
        >
          Make Proposal →
        </a>
        <button
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded text-sm"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.7)", border: "1px solid #2A2420" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
