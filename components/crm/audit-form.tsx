"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAuditAction } from "@/lib/crm/actions";
import { AUDIT_CHECKLIST_LABELS, type AuditChecklist, type Lead } from "@/lib/crm/types";
import { computeAllScores } from "@/lib/crm/scoring";
import { ScoreBar } from "./score-bar";

interface AuditFormProps {
  lead: Lead;
}

const DEFAULT_CHECKLIST: AuditChecklist = {
  hasModernDesign: false,
  isMobileFriendly: false,
  loadsFast: false,
  hasClearCTA: false,
  hasContactForm: false,
  hasGoogleMapsLink: false,
  hasLocalSEOTitle: false,
  hasMetaDescription: false,
  hasServicePages: false,
  hasCityLandingPage: false,
  hasAnalytics: false,
  hasBookingOpportunity: false,
};

export function AuditForm({ lead }: AuditFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [checklist, setChecklist] = useState<AuditChecklist>(
    lead.auditChecklist ?? DEFAULT_CHECKLIST
  );

  const scores = computeAllScores(checklist);

  function toggle(key: keyof AuditChecklist) {
    setChecklist((c) => ({ ...c, [key]: !c[key] }));
  }

  function handleSave() {
    startTransition(async () => {
      await saveAuditAction(lead.id, checklist);
      router.push(`/crm/leads/${lead.id}`);
    });
  }

  const groups: { title: string; keys: (keyof AuditChecklist)[] }[] = [
    {
      title: "Website quality",
      keys: ["hasModernDesign", "isMobileFriendly", "loadsFast", "hasClearCTA"],
    },
    {
      title: "Local SEO",
      keys: ["hasLocalSEOTitle", "hasMetaDescription", "hasServicePages", "hasCityLandingPage", "hasGoogleMapsLink"],
    },
    {
      title: "Automation & conversion",
      keys: ["hasContactForm", "hasAnalytics", "hasBookingOpportunity"],
    },
  ];

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
        <ScoreBar label="Website score" value={scores.websiteScore} />
        <ScoreBar label="SEO score" value={scores.seoScore} color="#60a5fa" />
        <ScoreBar label="Automation opportunity" value={scores.automationScore} color="#a78bfa" />
      </div>

      {/* Checklist groups */}
      {groups.map((group) => (
        <section key={group.title} className="space-y-3">
          <h3 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
            {group.title}
          </h3>
          <div className="space-y-2">
            {group.keys.map((key) => (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer rounded-md px-3 py-2.5 transition-colors"
                style={{
                  background: checklist[key] ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${checklist[key] ? "rgba(16,185,129,0.2)" : "#2A2420"}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={checklist[key]}
                  onChange={() => toggle(key)}
                  style={{ accentColor: "#10b981", width: 14, height: 14 }}
                />
                <span className="text-sm" style={{ color: checklist[key] ? "#F2EDE6" : "rgba(242,237,230,0.6)" }}>
                  {AUDIT_CHECKLIST_LABELS[key]}
                </span>
                <span className="ml-auto font-mono text-[10px]" style={{ color: checklist[key] ? "#10b981" : "rgba(242,237,230,0.3)" }}>
                  {checklist[key] ? "✓ present" : "✗ missing"}
                </span>
              </label>
            ))}
          </div>
        </section>
      ))}

      {/* Website link hint */}
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

      {/* Save */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={pending}
          className="px-5 py-2.5 rounded text-sm font-medium transition-opacity"
          style={{ background: "#f59e0b", color: "#0A0907", opacity: pending ? 0.6 : 1 }}
        >
          {pending ? "Saving audit…" : "Save audit"}
        </button>
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
