"use client";

import { useState } from "react";
import { generateAuditReport, REPORT_FORMATS, type ReportFormat } from "@/lib/crm/audit/reports";
import type { Lead } from "@/lib/crm/types";

interface Props {
  lead: Lead;
}

export function AuditReports({ lead }: Props) {
  const [tab, setTab] = useState<ReportFormat>("dm");
  const [copied, setCopied] = useState(false);

  const text = generateAuditReport(tab, lead, lead.richAudit, lead.leadScoreData);

  async function copy() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (!lead.richAudit) {
    return (
      <div className="rounded-lg p-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
        <p className="font-mono text-[12px] tracking-widest uppercase mb-2" style={{ color: "rgba(242,237,230,0.4)" }}>
          Audit reports
        </p>
        <p className="text-sm" style={{ color: "rgba(242,237,230,0.5)" }}>
          Run the website audit to generate copy-ready outreach reports.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-4 space-y-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          Audit reports
        </p>
        <button
          onClick={copy}
          className="px-3 py-1 rounded text-xs"
          style={{
            background: copied ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)",
            color: copied ? "#10b981" : "#F2EDE6",
            border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "#2A2420"}`,
          }}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1 rounded-lg p-1" style={{ background: "#0A0907", border: "1px solid #2A2420" }}>
        {REPORT_FORMATS.map((f) => (
          <button
            key={f.id}
            onClick={() => setTab(f.id)}
            title={f.description}
            className="flex-1 min-w-[80px] rounded px-3 py-1.5 text-xs"
            style={{
              background: tab === f.id ? "rgba(245,158,11,0.15)" : "transparent",
              color: tab === f.id ? "#f59e0b" : "rgba(242,237,230,0.5)",
              border: tab === f.id ? "1px solid rgba(245,158,11,0.25)" : "1px solid transparent",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <textarea
        readOnly
        value={text}
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
          minHeight: 280,
          resize: "vertical",
          outline: "none",
        }}
      />

      <p className="text-[12px]" style={{ color: "rgba(242,237,230,0.35)" }}>
        Always personalise before sending. Use cautious wording — &ldquo;could&rdquo;, &ldquo;potential&rdquo;, &ldquo;based on visible signals&rdquo;.
      </p>
    </div>
  );
}
