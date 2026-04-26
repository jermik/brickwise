"use client";

import { useState } from "react";

const PLATFORMS = [
  {
    id: "discord",
    label: "Discord",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
    color: "#5865F2",
    envKey: "DISCORD_WEBHOOK_URL",
  },
  {
    id: "reddit",
    label: "Reddit",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
    color: "#FF4500",
    envKey: "REDDIT_CLIENT_ID",
  },
];

type Status = "idle" | "sending" | "done" | "error";

export default function AnnouncePage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [subreddit, setSubreddit] = useState("RealT");
  const [selected, setSelected] = useState<string[]>(["discord"]);
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const send = async () => {
    if (!title.trim() || !message.trim() || selected.length === 0) return;
    setStatus("sending");
    setResults({});
    setErrors({});

    try {
      const res = await fetch("/api/announce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, url, platforms: selected, subreddit }),
      });
      const data = await res.json();
      setResults(data.results ?? {});
      setErrors(data.errors ?? {});
      setStatus(Object.keys(data.errors ?? {}).length > 0 ? "error" : "done");
    } catch {
      setErrors({ general: "Network error — please try again" });
      setStatus("error");
    }
  };

  const reset = () => {
    setTitle("");
    setMessage("");
    setUrl("");
    setStatus("idle");
    setResults({});
    setErrors({});
  };

  const canSend = title.trim() && message.trim() && selected.length > 0 && status !== "sending";

  return (
    <div className="flex-1 min-h-screen" style={{ background: "#fafafa" }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1.5">
            <div
              className="w-8 h-8 rounded-[7px] flex items-center justify-center"
              style={{ background: "#f0fdf4" }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M1 8.5L5 4.5L8 7.5L11 3.5L14 6"
                  stroke="#16a34a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3.5h2v2"
                  stroke="#16a34a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1
              className="text-[22px] font-bold tracking-[-0.5px]"
              style={{ color: "#111" }}
            >
              Announce
            </h1>
          </div>
          <p className="text-[13px]" style={{ color: "#737373" }}>
            Post updates to Discord and Reddit in one click.
          </p>
        </div>

        {status === "done" && Object.keys(errors).length === 0 ? (
          /* Success state */
          <div
            className="rounded-[12px] p-8 text-center"
            style={{ background: "#fff", border: "1px solid #e5e5e5" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#f0fdf4" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10l4 4 8-8"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-[16px] font-semibold mb-1" style={{ color: "#111" }}>
              Posted successfully
            </h2>
            <p className="text-[13px] mb-1" style={{ color: "#737373" }}>
              {Object.keys(results)
                .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
                .join(" and ")}{" "}
              {Object.keys(results).length === 1 ? "was" : "were"} updated.
            </p>
            <button
              onClick={reset}
              className="mt-5 px-5 py-2 rounded-[7px] text-[13px] font-semibold transition-opacity hover:opacity-80"
              style={{ background: "#111", color: "#fff" }}
            >
              New post
            </button>
          </div>
        ) : (
          /* Form */
          <div
            className="rounded-[12px] overflow-hidden"
            style={{ background: "#fff", border: "1px solid #e5e5e5" }}
          >
            <div className="p-6 space-y-5">
              {/* Platform selector */}
              <div>
                <label
                  className="block text-[11px] font-semibold uppercase tracking-[0.6px] mb-2"
                  style={{ color: "#a3a3a3" }}
                >
                  Platforms
                </label>
                <div className="flex gap-2.5">
                  {PLATFORMS.map((p) => {
                    const on = selected.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggle(p.id)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-[13px] font-medium transition-all"
                        style={{
                          background: on ? p.color + "12" : "#f5f5f5",
                          border: `1.5px solid ${on ? p.color + "50" : "transparent"}`,
                          color: on ? p.color : "#737373",
                        }}
                      >
                        <span style={{ color: on ? p.color : "#a3a3a3" }}>{p.icon}</span>
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  className="block text-[11px] font-semibold uppercase tracking-[0.6px] mb-1.5"
                  style={{ color: "#a3a3a3" }}
                >
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New property analysis: 5035 Draper Ave"
                  className="w-full px-3.5 py-2.5 rounded-[8px] text-[13px] outline-none transition-all"
                  style={{
                    background: "#fafafa",
                    border: "1px solid #e5e5e5",
                    color: "#111",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  className="block text-[11px] font-semibold uppercase tracking-[0.6px] mb-1.5"
                  style={{ color: "#a3a3a3" }}
                >
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Write your update here..."
                  className="w-full px-3.5 py-2.5 rounded-[8px] text-[13px] outline-none transition-all resize-none"
                  style={{
                    background: "#fafafa",
                    border: "1px solid #e5e5e5",
                    color: "#111",
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
                />
              </div>

              {/* URL */}
              <div>
                <label
                  className="block text-[11px] font-semibold uppercase tracking-[0.6px] mb-1.5"
                  style={{ color: "#a3a3a3" }}
                >
                  Link{" "}
                  <span className="normal-case font-normal tracking-normal" style={{ color: "#c3c3c3" }}>
                    (optional — for Reddit this becomes a link post)
                  </span>
                </label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://brickwise.pro/property/1"
                  className="w-full px-3.5 py-2.5 rounded-[8px] text-[13px] outline-none transition-all"
                  style={{
                    background: "#fafafa",
                    border: "1px solid #e5e5e5",
                    color: "#111",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
                />
              </div>

              {/* Subreddit — only when Reddit selected */}
              {selected.includes("reddit") && (
                <div>
                  <label
                    className="block text-[11px] font-semibold uppercase tracking-[0.6px] mb-1.5"
                    style={{ color: "#a3a3a3" }}
                  >
                    Subreddit
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] select-none"
                      style={{ color: "#a3a3a3" }}
                    >
                      r/
                    </span>
                    <input
                      value={subreddit}
                      onChange={(e) => setSubreddit(e.target.value)}
                      placeholder="RealT"
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-[8px] text-[13px] outline-none transition-all"
                      style={{
                        background: "#fafafa",
                        border: "1px solid #e5e5e5",
                        color: "#111",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#FF4500")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
                    />
                  </div>
                </div>
              )}

              {/* Errors */}
              {Object.keys(errors).length > 0 && (
                <div
                  className="rounded-[8px] p-3.5 space-y-1"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                >
                  {Object.entries(errors).map(([k, v]) => (
                    <p key={k} className="text-[12px]" style={{ color: "#dc2626" }}>
                      <span className="font-semibold capitalize">{k}: </span>
                      {v}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderTop: "1px solid #f0f0f0", background: "#fafafa" }}
            >
              <p className="text-[11px]" style={{ color: "#c3c3c3" }}>
                {selected.length === 0
                  ? "Select at least one platform"
                  : `Posting to ${selected.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" + ")}`}
              </p>
              <button
                onClick={send}
                disabled={!canSend}
                className="flex items-center gap-2 px-5 py-2 rounded-[7px] text-[13px] font-semibold transition-all"
                style={{
                  background: canSend ? "#16a34a" : "#e5e5e5",
                  color: canSend ? "#fff" : "#a3a3a3",
                  cursor: canSend ? "pointer" : "not-allowed",
                }}
              >
                {status === "sending" ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                    >
                      <circle
                        cx="6.5"
                        cy="6.5"
                        r="5"
                        stroke="currentColor"
                        strokeOpacity="0.3"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M6.5 1.5a5 5 0 015 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path
                        d="M1 6.5L12 1L7.5 6.5L12 12L1 6.5z"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
