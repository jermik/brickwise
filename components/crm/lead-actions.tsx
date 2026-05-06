"use client";

import { useState, useTransition } from "react";
import { setManualOfferAction, deleteLeadAction } from "@/lib/crm/actions";
import { OFFER_TEMPLATES } from "@/lib/crm/types";

interface LeadActionsProps {
  leadId: string;
  currentOffer?: string;
}

export function LeadActions({ leadId, currentOffer }: LeadActionsProps) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleOfferChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    startTransition(() => setManualOfferAction(leadId, value));
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    startTransition(() => deleteLeadAction(leadId));
  }

  const inputStyle = {
    background: "#0A0907",
    border: "1px solid #2A2420",
    color: "#F2EDE6",
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 12,
    outline: "none",
    width: "100%",
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          Recommended offer
        </label>
        <select value={currentOffer ?? ""} onChange={handleOfferChange} disabled={pending} style={inputStyle}>
          <option value="">— auto-select from audit —</option>
          {OFFER_TEMPLATES.map((o) => (
            <option key={o.id} value={o.id}>{o.name}{o.price ? ` · ${o.price}` : ""}</option>
          ))}
        </select>
        <p className="text-[10px]" style={{ color: "rgba(242,237,230,0.35)" }}>
          Set to override the audit&apos;s automatic suggestion.
        </p>
      </div>

      <div className="pt-3" style={{ borderTop: "1px solid #2A2420" }}>
        <button
          onClick={handleDelete}
          disabled={pending}
          className="w-full px-3 py-2 rounded text-xs"
          style={{
            background: confirmDelete ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.04)",
            color: confirmDelete ? "#f87171" : "rgba(242,237,230,0.5)",
            border: `1px solid ${confirmDelete ? "rgba(248,113,113,0.3)" : "#2A2420"}`,
            opacity: pending ? 0.6 : 1,
          }}
        >
          {pending ? "Deleting…" : confirmDelete ? "Click again to confirm delete" : "Delete lead"}
        </button>
      </div>
    </div>
  );
}
