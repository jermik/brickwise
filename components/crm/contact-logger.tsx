"use client";

import { useState, useTransition } from "react";
import { logContactAction } from "@/lib/crm/actions";
import type { ContactType } from "@/lib/crm/types";

const TYPES: { value: ContactType; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "call", label: "Call" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "visit", label: "Visit" },
  { value: "other", label: "Other" },
];

interface ContactLoggerProps {
  leadId: string;
}

export function ContactLogger({ leadId }: ContactLoggerProps) {
  const [pending, startTransition] = useTransition();
  const [type, setType] = useState<ContactType>("email");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);

  function handleLog() {
    if (!confirmed) {
      setError("Please confirm you have personalised this message before logging.");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        await logContactAction(leadId, type, message || undefined);
        setMessage("");
        setConfirmed(false);
        setDone(true);
        setTimeout(() => setDone(false), 3000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to log contact.");
      }
    });
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
    <div className="space-y-3 rounded-lg p-4" style={{ background: "#131109", border: "1px solid #2A2420" }}>
      <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
        Log outreach
      </p>

      <div className="flex gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className="px-3 py-1 rounded text-xs transition-colors"
            style={{
              background: type === t.value ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
              color: type === t.value ? "#f59e0b" : "rgba(242,237,230,0.55)",
              border: `1px solid ${type === t.value ? "rgba(245,158,11,0.3)" : "#2A2420"}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <textarea
        rows={2}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Brief note about this contact (optional)…"
        style={{ ...inputStyle, resize: "vertical" }}
      />

      <label className="flex items-center gap-2 cursor-pointer text-xs" style={{ color: "rgba(242,237,230,0.65)" }}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          style={{ accentColor: "#f59e0b" }}
        />
        I confirm this message has been personally reviewed and customised — it is NOT a bulk send.
      </label>

      {error && (
        <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>
      )}
      {done && (
        <p className="text-xs" style={{ color: "#10b981" }}>Contact logged. Follow-up scheduled for 3 days.</p>
      )}

      <button
        onClick={handleLog}
        disabled={pending}
        className="px-4 py-2 rounded text-xs font-medium transition-opacity"
        style={{ background: "#f59e0b", color: "#0A0907", opacity: pending ? 0.6 : 1 }}
      >
        {pending ? "Logging…" : "Log contact"}
      </button>
    </div>
  );
}
