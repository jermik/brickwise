"use client";

import { useTransition } from "react";
import { updateStatusAction, toggleDoNotContact } from "@/lib/crm/actions";
import { STATUS_CONFIG, type Lead, type LeadStatus } from "@/lib/crm/types";

interface StatusUpdaterProps {
  lead: Lead;
}

export function StatusUpdater({ lead }: StatusUpdaterProps) {
  const [pending, startTransition] = useTransition();

  function setStatus(status: LeadStatus) {
    startTransition(() => updateStatusAction(lead.id, status));
  }

  function toggleDNC(value: boolean) {
    startTransition(() => toggleDoNotContact(lead.id, value));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          Pipeline status
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(STATUS_CONFIG) as [LeadStatus, (typeof STATUS_CONFIG)[LeadStatus]][]).map(([val, cfg]) => (
            <button
              key={val}
              onClick={() => setStatus(val)}
              disabled={pending || lead.status === val}
              className="px-2.5 py-1 rounded text-xs font-mono transition-all"
              style={{
                background: lead.status === val ? cfg.bg : "rgba(255,255,255,0.04)",
                color: lead.status === val ? cfg.color : "rgba(242,237,230,0.45)",
                border: `1px solid ${lead.status === val ? cfg.color + "44" : "#2A2420"}`,
                opacity: pending ? 0.6 : 1,
              }}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="flex items-center justify-between rounded-lg px-3 py-3"
        style={{ background: lead.doNotContact ? "rgba(248,113,113,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${lead.doNotContact ? "rgba(248,113,113,0.3)" : "#2A2420"}` }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: lead.doNotContact ? "#f87171" : "#F2EDE6" }}>
            Do Not Contact
          </p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(242,237,230,0.45)" }}>
            Permanently block outreach to this lead
          </p>
        </div>
        <button
          onClick={() => toggleDNC(!lead.doNotContact)}
          disabled={pending}
          className="px-3 py-1.5 rounded text-xs font-medium transition-opacity"
          style={{
            background: lead.doNotContact ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.06)",
            color: lead.doNotContact ? "#f87171" : "rgba(242,237,230,0.65)",
            border: `1px solid ${lead.doNotContact ? "rgba(248,113,113,0.3)" : "#2A2420"}`,
            opacity: pending ? 0.6 : 1,
          }}
        >
          {lead.doNotContact ? "Remove DNC" : "Mark DNC"}
        </button>
      </div>
    </div>
  );
}
