"use client";

import { useState } from "react";

interface EmailCaptureProps {
  source?: string;
  heading?: string;
  subtext?: string;
  compact?: boolean;
}

export function EmailCapture({
  source = "site",
  heading = "The Brickwise Brief",
  subtext = "3 buy candidates, 3 avoid signals. Every Monday. Free.",
  compact = false,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Connection failed. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-[10px] px-5 py-4 flex items-center gap-3"
        style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#16a34a" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5l2.5 2.5L8.5 2" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="text-[13px] font-semibold" style={{ color: "#15803d" }}>
            You're subscribed
          </div>
          <div className="text-[11px]" style={{ color: "#16a34a" }}>
            First Brief arrives Monday morning.
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="brickwise-email-compact" className="sr-only">
          Email address
        </label>
        <input
          id="brickwise-email-compact"
          name="email"
          type="email"
          autoComplete="email"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-2 rounded-[7px] text-[13px] outline-none"
          style={{
            border: "1px solid #e5e5e5",
            background: "#fff",
            color: "#111",
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 rounded-[7px] text-[12px] font-semibold transition-opacity hover:opacity-80"
          style={{
            background: "#111",
            color: "#fff",
            opacity: status === "loading" ? 0.6 : 1,
          }}
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
    );
  }

  return (
    <div
      className="rounded-[12px] p-6"
      style={{ background: "#fafafa", border: "1px solid #ebebeb" }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "#f0fdf4", border: "1px solid #d1fae5" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 3.5h12M1 7h12M1 10.5h8" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="text-[14px] font-bold" style={{ color: "#111" }}>
            {heading}
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: "#a3a3a3" }}>
            {subtext}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="brickwise-email-full" className="sr-only">
          Email address
        </label>
        <input
          id="brickwise-email-full"
          name="email"
          type="email"
          autoComplete="email"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-2.5 rounded-[8px] text-[13px] outline-none"
          style={{
            border: "1px solid #e5e5e5",
            background: "#fff",
            color: "#111",
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 rounded-[8px] text-[13px] font-semibold transition-opacity hover:opacity-80"
          style={{
            background: "#111",
            color: "#fff",
            opacity: status === "loading" ? 0.6 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {status === "loading" ? "..." : "Get the Brief"}
        </button>
      </form>

      {status === "error" && (
        <p className="text-[11px] mt-2" style={{ color: "#dc2626" }}>
          {errorMsg}
        </p>
      )}

      <p className="text-[12px] mt-2.5" style={{ color: "#c4c4c4" }}>
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
