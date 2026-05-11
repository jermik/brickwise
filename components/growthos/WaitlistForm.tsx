"use client";

import { useState, useTransition } from "react";
import { joinWaitlistAction } from "@/lib/growthos/actions";

const ACCENT = "#f59e0b";
const BORDER = "#2A2420";
const SURFACE = "#131109";

interface WaitlistFormProps {
  /** Optional source tag (e.g. "ig" / "tiktok" / "linkedin"). */
  source?: string;
}

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

const NICHE_OPTIONS = [
  "Web design / development",
  "SEO / content",
  "Branding / design",
  "Marketing agency",
  "Solo freelancer",
  "Other",
];

export function WaitlistForm({ source = "direct" }: WaitlistFormProps) {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<State>({ kind: "idle" });
  const [email, setEmail] = useState("");
  const [niche, setNiche] = useState("");
  const [country, setCountry] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state.kind === "submitting") return;
    setState({ kind: "submitting" });
    startTransition(async () => {
      const result = await joinWaitlistAction({ email, niche, country, source });
      if (result.ok) {
        setState({ kind: "ok" });
      } else {
        setState({ kind: "error", message: result.error ?? "Something went wrong." });
      }
    });
  }

  if (state.kind === "ok") {
    return (
      <div
        className="rounded-lg p-5"
        style={{
          background: "rgba(16,185,129,0.06)",
          border: "1px solid rgba(16,185,129,0.3)",
          color: "#10b981",
        }}
      >
        <p className="font-display text-lg" style={{ color: "#10b981" }}>
          You're on the list ✓
        </p>
        <p className="text-sm mt-1" style={{ color: "rgba(242,237,230,0.7)" }}>
          I&rsquo;ll DM / email you within a few days when your access is ready. No spam, no automated funnels — one personal message, then you&rsquo;re in.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    background: "#0A0907",
    border: `1px solid ${BORDER}`,
    color: "#F2EDE6",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    width: "100%",
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-lg p-5 space-y-3"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: ACCENT }}>
        Early access waitlist
      </p>
      <p className="text-sm" style={{ color: "rgba(242,237,230,0.7)" }}>
        Building this for web design agencies and freelancers. Drop your email and I&rsquo;ll send you in.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@agency.com"
          style={inputStyle}
          autoComplete="email"
        />
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country (optional)"
          style={inputStyle}
          autoComplete="country-name"
        />
      </div>

      <select
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        style={inputStyle}
      >
        <option value="">What do you do? (optional)</option>
        {NICHE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {state.kind === "error" && (
        <p
          className="text-xs px-3 py-2 rounded"
          style={{
            background: "rgba(248,113,113,0.08)",
            color: "#f87171",
            border: "1px solid rgba(248,113,113,0.2)",
          }}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || state.kind === "submitting"}
        className="w-full sm:w-auto px-5 py-3 rounded text-sm font-medium transition-opacity"
        style={{
          background: ACCENT,
          color: "#0A0907",
          opacity: pending || state.kind === "submitting" ? 0.6 : 1,
        }}
      >
        {pending || state.kind === "submitting" ? "Joining…" : "Get early access"}
      </button>

      <p className="font-mono text-[12px]" style={{ color: "rgba(242,237,230,0.4)" }}>
        No spam. No newsletter funnels. One message when access is ready.
      </p>
    </form>
  );
}
