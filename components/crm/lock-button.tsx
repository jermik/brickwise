"use client";

import { useState } from "react";

interface LockCrmButtonProps {
  className?: string;
  label?: string;
}

export function LockCrmButton({ className, label = "Lock CRM" }: LockCrmButtonProps) {
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/api/crm/logout", { method: "POST" });
    } catch {
      // Network errors are non-fatal — we still redirect
    } finally {
      window.location.href = "/crm/access";
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={className ?? "text-[11px] font-medium px-2.5 h-7 rounded-[6px] transition-colors"}
      style={{
        background: "rgba(255,255,255,0.05)",
        color: "rgba(255,255,255,0.6)",
        border: "1px solid rgba(255,255,255,0.08)",
        cursor: pending ? "wait" : "pointer",
      }}
      title="Clear CRM access cookie and require re-entry"
    >
      {pending ? "Locking..." : `🔒 ${label}`}
    </button>
  );
}
