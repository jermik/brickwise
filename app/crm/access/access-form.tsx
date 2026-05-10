"use client";

import { useState } from "react";

interface AccessFormProps {
  redirectTo: string;
}

export function AccessForm({ redirectTo }: AccessFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/crm/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        window.location.href = redirectTo || "/crm";
        return;
      }
      if (res.status === 401) {
        setError("Incorrect access code.");
      } else if (res.status === 500) {
        setError("Server not configured. Contact admin.");
      } else {
        setError("Unable to verify. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" autoComplete="off">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.6px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          CRM access code
        </span>
        <input
          type="password"
          name="crm-access-code"
          autoComplete="off"
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          aria-invalid={Boolean(error)}
          className="mt-2 w-full h-11 px-4 rounded-[10px] text-[14px] font-medium outline-none transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? "#EF4444" : "rgba(255,255,255,0.08)"}`,
            color: "#FFFFFF",
          }}
          placeholder="Enter access code"
        />
      </label>

      {error && (
        <div className="text-[12px]" style={{ color: "#FCA5A5" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending || !code}
        className="h-11 rounded-[10px] text-[13px] font-semibold transition-opacity"
        style={{
          background: pending || !code ? "rgba(59,130,246,0.4)" : "#3B82F6",
          color: "#FFFFFF",
          cursor: pending || !code ? "not-allowed" : "pointer",
        }}
      >
        {pending ? "Verifying..." : "Unlock CRM"}
      </button>
    </form>
  );
}
