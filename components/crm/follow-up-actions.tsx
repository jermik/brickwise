"use client";

import { useTransition } from "react";
import { completeFollowUpAction } from "@/lib/crm/actions";

interface FollowUpActionsProps {
  leadId: string;
  followUpId: string;
}

export function FollowUpActions({ leadId, followUpId }: FollowUpActionsProps) {
  const [pending, startTransition] = useTransition();

  function handleDone() {
    startTransition(() => completeFollowUpAction(leadId, followUpId));
  }

  return (
    <button
      onClick={handleDone}
      disabled={pending}
      className="shrink-0 px-3 py-1.5 rounded text-xs transition-opacity"
      style={{
        background: "rgba(16,185,129,0.1)",
        color: "#10b981",
        border: "1px solid rgba(16,185,129,0.2)",
        opacity: pending ? 0.6 : 1,
      }}
    >
      {pending ? "…" : "Mark done"}
    </button>
  );
}
