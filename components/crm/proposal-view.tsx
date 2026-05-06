"use client";

import { useState, useTransition } from "react";
import { generateProposalAction } from "@/lib/crm/actions";
import { getOffer } from "@/lib/crm/types";
import type { Lead } from "@/lib/crm/types";

interface ProposalViewProps {
  lead: Lead;
}

const TABS = [
  { id: "email", label: "Initial email" },
  { id: "follow_up", label: "Follow-up email" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "call", label: "Call script" },
  { id: "bullets", label: "Bullets" },
] as const;

type Tab = (typeof TABS)[number]["id"];

export function ProposalView({ lead }: ProposalViewProps) {
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("email");
  const [copied, setCopied] = useState(false);

  const hasProposal = !!lead.proposalEmail;
  const offer = getOffer(lead.proposalOffer);

  const content: Record<Tab, string | undefined> = {
    email: lead.proposalEmail,
    follow_up: lead.proposalFollowUpEmail,
    linkedin: lead.proposalLinkedIn,
    call: lead.proposalCallScript,
    bullets: lead.proposalBullets,
  };

  async function handleGenerate() {
    startTransition(async () => {
      await generateProposalAction(lead.id);
    });
  }

  async function handleCopy() {
    const text = content[tab];
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const areaStyle = {
    background: "#0A0907",
    border: "1px solid #2A2420",
    color: "#F2EDE6",
    borderRadius: 8,
    padding: 16,
    fontSize: 13,
    lineHeight: 1.7,
    fontFamily: "var(--font-dm-mono)",
    resize: "vertical" as const,
    minHeight: 280,
    width: "100%",
    outline: "none",
  };

  return (
    <div className="space-y-5">
      {/* Score + offer summary */}
      {(lead.websiteScore != null || lead.seoScore != null || offer) && (
        <div className="flex flex-wrap gap-4 rounded-lg px-4 py-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
          {lead.websiteScore != null && (
            <div className="text-center">
              <p className="font-mono text-xs" style={{ color: "rgba(242,237,230,0.45)" }}>Site</p>
              <p className="font-display text-xl" style={{ color: lead.websiteScore >= 60 ? "#10b981" : "#f59e0b" }}>{lead.websiteScore}</p>
            </div>
          )}
          {lead.seoScore != null && (
            <div className="text-center">
              <p className="font-mono text-xs" style={{ color: "rgba(242,237,230,0.45)" }}>SEO</p>
              <p className="font-display text-xl" style={{ color: lead.seoScore >= 60 ? "#10b981" : "#f59e0b" }}>{lead.seoScore}</p>
            </div>
          )}
          {lead.conversionScore != null && (
            <div className="text-center">
              <p className="font-mono text-xs" style={{ color: "rgba(242,237,230,0.45)" }}>Conv.</p>
              <p className="font-display text-xl" style={{ color: lead.conversionScore >= 60 ? "#10b981" : "#f59e0b" }}>{lead.conversionScore}</p>
            </div>
          )}
          {lead.automationScore != null && (
            <div className="text-center">
              <p className="font-mono text-xs" style={{ color: "rgba(242,237,230,0.45)" }}>Auto</p>
              <p className="font-display text-xl" style={{ color: lead.automationScore >= 60 ? "#10b981" : "#f59e0b" }}>{lead.automationScore}</p>
            </div>
          )}
          {offer && (
            <div className="text-center min-w-[140px]">
              <p className="font-mono text-xs" style={{ color: "rgba(242,237,230,0.45)" }}>Suggested offer</p>
              <p className="text-sm font-medium" style={{ color: offer.color }}>{offer.name}</p>
              <p className="font-mono text-[10px]" style={{ color: "rgba(242,237,230,0.4)" }}>{offer.price}</p>
            </div>
          )}
          {lead.estimatedValue != null && (
            <div className="text-center">
              <p className="font-mono text-xs" style={{ color: "rgba(242,237,230,0.45)" }}>Est. value</p>
              <p className="font-display text-xl" style={{ color: "#34d399" }}>€{lead.estimatedValue.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      {/* Top-3 problems / improvements */}
      {((lead.topProblems?.length ?? 0) > 0 || (lead.topImprovements?.length ?? 0) > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lead.topProblems && lead.topProblems.length > 0 && (
            <div className="rounded-lg p-4 space-y-2" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#f87171" }}>
                Top 3 problems
              </p>
              <ol className="space-y-1.5 text-xs" style={{ color: "rgba(242,237,230,0.75)" }}>
                {lead.topProblems.map((p, i) => (<li key={i}>{i + 1}. {p}</li>))}
              </ol>
            </div>
          )}
          {lead.topImprovements && lead.topImprovements.length > 0 && (
            <div className="rounded-lg p-4 space-y-2" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#10b981" }}>
                Top 3 improvements
              </p>
              <ol className="space-y-1.5 text-xs" style={{ color: "rgba(242,237,230,0.75)" }}>
                {lead.topImprovements.map((p, i) => (<li key={i}>{i + 1}. {p}</li>))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Generate button */}
      {!hasProposal ? (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: "rgba(242,237,230,0.6)" }}>
            No proposal generated yet.{" "}
            {!lead.auditChecklist && (
              <span style={{ color: "#f59e0b" }}>Run the website audit first for best results.</span>
            )}
          </p>
          <button
            onClick={handleGenerate}
            disabled={pending}
            className="px-5 py-2.5 rounded text-sm font-medium"
            style={{ background: "#f59e0b", color: "#0A0907", opacity: pending ? 0.6 : 1 }}
          >
            {pending ? "Generating…" : "Generate proposal"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Compliance note */}
          <div className="rounded px-3 py-2 text-xs" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "rgba(242,237,230,0.65)" }}>
            ⚠ Review and personalise every message before sending. Never send automated or bulk messages. The opt-out line at the bottom is required — keep it in.
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 rounded-lg p-1" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="flex-1 min-w-[90px] rounded px-3 py-1.5 text-xs"
                style={{
                  background: tab === id ? "rgba(245,158,11,0.15)" : "transparent",
                  color: tab === id ? "#f59e0b" : "rgba(242,237,230,0.5)",
                  border: tab === id ? "1px solid rgba(245,158,11,0.25)" : "1px solid transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <textarea style={areaStyle} value={content[tab] ?? "(no content for this tab)"} readOnly />

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded text-sm"
              style={{ background: "rgba(255,255,255,0.06)", color: "#F2EDE6", border: "1px solid #2A2420" }}
            >
              {copied ? "Copied ✓" : "Copy to clipboard"}
            </button>
            <button
              onClick={handleGenerate}
              disabled={pending}
              className="px-4 py-2 rounded text-sm"
              style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)", opacity: pending ? 0.6 : 1 }}
            >
              {pending ? "Regenerating…" : "Regenerate"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
