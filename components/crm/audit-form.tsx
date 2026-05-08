"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveAuditAction, runAutoAuditAction } from "@/lib/crm/actions";
import {
  AUDIT_FIELDS_BY_DIMENSION,
  AUDIT_FIELDS,
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
import type {
  AutoAuditResult,
  AutoAuditConfidence,
} from "@/lib/crm/audit/auto-audit";
import { ScoreBar } from "./score-bar";

interface AuditFormProps {
  lead: Lead;
}

const DIMS: AuditDimension[] = ["website", "seo", "conversion", "automation"];

const CONFIDENCE_STYLE: Record<AutoAuditConfidence, { bg: string; color: string; label: string }> = {
  high: { bg: "rgba(16,185,129,0.14)", color: "#10b981", label: "high" },
  medium: { bg: "rgba(245,158,11,0.14)", color: "#f59e0b", label: "medium" },
  low: { bg: "rgba(96,165,250,0.14)", color: "#60a5fa", label: "low" },
  unknown: { bg: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.5)", label: "manual" },
};

const FIELD_LABEL = new Map<AuditChecklistKey, string>(
  AUDIT_FIELDS.map((f) => [f.key, f.label]),
);

const FIELD_DIMENSION = new Map<AuditChecklistKey, AuditDimension>(
  AUDIT_FIELDS.map((f) => [f.key, f.dimension]),
);

export function AuditForm({ lead }: AuditFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [autoBusy, startAuto] = useTransition();
  const [error, setError] = useState("");
  const [autoError, setAutoError] = useState("");
  const [auto, setAuto] = useState<AutoAuditResult | null>(null);
  const [autoFromDiscovery, setAutoFromDiscovery] = useState(false);
  const autoTriggeredRef = useRef(false);
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

  function runAuto() {
    setAutoError("");
    startAuto(async () => {
      const result = await runAutoAuditAction(lead.id);
      if (!result.ok) {
        setAutoError(result.error ?? "Auto-audit failed.");
        setAuto(result);
        return;
      }
      setAuto(result);
    });
  }

  function applyAutoSuggestions() {
    if (!auto) return;
    const next: AuditChecklist = { ...checklist };
    let applied = 0;
    for (const [key, field] of Object.entries(auto.fields) as [AuditChecklistKey, AutoAuditResult["fields"][AuditChecklistKey]][]) {
      if (field && typeof field.value === "boolean") {
        next[key] = field.value;
        applied++;
      }
    }
    setChecklist(next);
    console.log("[auto-audit.ui] applied", { leadId: lead.id, applied });
  }

  function dismissAuto() {
    setAuto(null);
    setAutoError("");
    setAutoFromDiscovery(false);
  }

  // ── Auto-run when arriving from Discovery with ?auto=1 ────────────────
  // Strips the query param so a refresh doesn't trigger another run.
  // Guards against React StrictMode double-effect via a ref.
  useEffect(() => {
    if (autoTriggeredRef.current) return;
    if (searchParams?.get("auto") !== "1") return;
    if (!lead.website) return;
    autoTriggeredRef.current = true;
    setAutoFromDiscovery(true);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("auto");
      const cleaned = `${url.pathname}${url.search}${url.hash}`;
      window.history.replaceState(null, "", cleaned);
    }

    runAuto();
    // We intentionally only depend on searchParams — runAuto and lead are
    // stable for this page lifetime, and we never want to fire twice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const noWebsite = !lead.website;

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

      {/* Auto-audit launcher + preview */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: "#131109", border: "1px solid #2A2420" }}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#f59e0b" }}>
              Auto-audit
            </p>
            <p className="text-xs mt-1" style={{ color: "rgba(242,237,230,0.55)" }}>
              {noWebsite
                ? "This lead has no website yet. Add one on the Edit page first."
                : "Inspect the homepage and prefill the checklist with high-confidence detections."}
            </p>
          </div>
          <button
            type="button"
            onClick={runAuto}
            disabled={autoBusy || noWebsite}
            className="px-4 py-2 rounded text-sm font-medium transition-opacity"
            style={{
              background: "#f59e0b",
              color: "#0A0907",
              opacity: autoBusy || noWebsite ? 0.5 : 1,
            }}
          >
            {autoBusy ? "Auditing…" : "Auto-audit website"}
          </button>
        </div>

        {autoFromDiscovery && (
          <p
            className="text-xs px-3 py-2 rounded"
            style={{ background: "rgba(96,165,250,0.08)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.25)" }}
          >
            Auto-audit ran from discovery. Review the suggestions before saving.
          </p>
        )}

        {autoError && (
          <p
            className="text-xs px-3 py-2 rounded"
            style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}
          >
            {autoError}
          </p>
        )}

        {auto && auto.ok && <AutoAuditPanel result={auto} onApply={applyAutoSuggestions} onDismiss={dismissAuto} />}
      </div>

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
              {fields.map((field) => {
                const detected = auto?.fields[field.key];
                return (
                  <label
                    key={field.key}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 cursor-pointer rounded-md px-3 py-2 transition-colors"
                    style={{
                      background: checklist[field.key] ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${checklist[field.key] ? "rgba(16,185,129,0.18)" : "#2A2420"}`,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checklist[field.key]}
                      onChange={() => toggle(field.key)}
                      style={{ accentColor: "#10b981", width: 16, height: 16, flexShrink: 0 }}
                    />
                    <span className="text-sm flex-1 min-w-0 break-words" style={{ color: checklist[field.key] ? "#F2EDE6" : "rgba(242,237,230,0.6)" }}>
                      {field.label}
                    </span>
                    {detected && (
                      <span
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          background: CONFIDENCE_STYLE[detected.confidence].bg,
                          color: CONFIDENCE_STYLE[detected.confidence].color,
                        }}
                        title={detected.note ?? ""}
                      >
                        {CONFIDENCE_STYLE[detected.confidence].label}
                      </span>
                    )}
                    {field.impact === 3 && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
                        high
                      </span>
                    )}
                    <span className="font-mono text-[10px]" style={{ color: checklist[field.key] ? "#10b981" : "rgba(242,237,230,0.3)" }}>
                      {checklist[field.key] ? "✓" : "✗"}
                    </span>
                  </label>
                );
              })}
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

interface AutoAuditPanelProps {
  result: AutoAuditResult;
  onApply: () => void;
  onDismiss: () => void;
}

function AutoAuditPanel({ result, onApply, onDismiss }: AutoAuditPanelProps) {
  const decided: Array<[AuditChecklistKey, AutoAuditResult["fields"][AuditChecklistKey]]> = [];
  const manual: Array<[AuditChecklistKey, AutoAuditResult["fields"][AuditChecklistKey]]> = [];
  for (const [key, field] of Object.entries(result.fields) as [AuditChecklistKey, AutoAuditResult["fields"][AuditChecklistKey]][]) {
    if (!field) continue;
    if (typeof field.value === "boolean") decided.push([key, field]);
    else manual.push([key, field]);
  }

  // Group decided by dimension for cleaner reading.
  const byDim: Partial<Record<AuditDimension, typeof decided>> = {};
  for (const entry of decided) {
    const dim = FIELD_DIMENSION.get(entry[0]) ?? "website";
    (byDim[dim] ??= []).push(entry);
  }
  const tools = result.detectedTools;
  const totalTools =
    tools.booking.length + tools.payments.length + tools.emailAutomation.length + tools.analytics.length;

  return (
    <div
      className="rounded-md p-3 space-y-3 text-xs"
      style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.2)" }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p style={{ color: "rgba(242,237,230,0.7)" }}>
          Detected{" "}
          <span className="font-mono" style={{ color: "#F2EDE6" }}>
            {decided.length}
          </span>{" "}
          fields in{" "}
          <span className="font-mono" style={{ color: "#F2EDE6" }}>
            {result.fetchMs ?? "?"}
          </span>{" "}
          ms{result.finalUrl ? ` · ${new URL(result.finalUrl).hostname}` : ""}.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onApply}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: "#f59e0b", color: "#0A0907" }}
          >
            Apply suggestions
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="px-3 py-1.5 rounded text-xs"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.7)", border: "1px solid #2A2420" }}
          >
            Ignore
          </button>
        </div>
      </div>

      {totalTools > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tools.booking.map((t) => (
            <span key={`b-${t}`} className="px-2 py-0.5 rounded font-mono text-[10px]" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
              booking · {t}
            </span>
          ))}
          {tools.payments.map((t) => (
            <span key={`p-${t}`} className="px-2 py-0.5 rounded font-mono text-[10px]" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
              payments · {t}
            </span>
          ))}
          {tools.emailAutomation.map((t) => (
            <span key={`e-${t}`} className="px-2 py-0.5 rounded font-mono text-[10px]" style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}>
              email · {t}
            </span>
          ))}
          {tools.analytics.map((t) => (
            <span key={`a-${t}`} className="px-2 py-0.5 rounded font-mono text-[10px]" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
              analytics · {t}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {DIMS.map((dim) => {
          const rows = byDim[dim] ?? [];
          if (rows.length === 0) return null;
          return (
            <div key={dim} className="space-y-1">
              <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: DIMENSION_COLORS[dim] }}>
                {DIMENSION_LABELS[dim]}
              </p>
              <ul className="space-y-1">
                {rows.map(([key, field]) => (
                  <li
                    key={key}
                    className="flex items-start gap-2 px-2 py-1.5 rounded"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #2A2420" }}
                  >
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: field?.value ? "#10b981" : "#f87171", marginTop: 1 }}
                    >
                      {field?.value ? "✓" : "✗"}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block" style={{ color: "rgba(242,237,230,0.85)" }}>
                        {FIELD_LABEL.get(key) ?? key}
                      </span>
                      {(field?.note || field?.evidence) && (
                        <span className="block text-[10px] truncate" style={{ color: "rgba(242,237,230,0.45)" }}>
                          {field?.note}
                          {field?.evidence && (
                            <>
                              {field?.note ? " · " : ""}
                              <span style={{ color: "rgba(242,237,230,0.55)" }}>{field.evidence}</span>
                            </>
                          )}
                        </span>
                      )}
                    </span>
                    {field && (
                      <span
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          background: CONFIDENCE_STYLE[field.confidence].bg,
                          color: CONFIDENCE_STYLE[field.confidence].color,
                        }}
                      >
                        {CONFIDENCE_STYLE[field.confidence].label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {manual.length > 0 && (
        <p className="text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>
          {manual.length} field{manual.length === 1 ? "" : "s"} need a human eye
          ({manual.map(([k]) => FIELD_LABEL.get(k) ?? k).join(", ")}).
        </p>
      )}
    </div>
  );
}
