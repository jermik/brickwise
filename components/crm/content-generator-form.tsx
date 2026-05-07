"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateContentAction } from "@/lib/crm/actions";
import {
  CONTENT_ANGLES,
  CONTENT_AUDIENCES,
  CONTENT_PLATFORMS,
  type ContentAngle,
  type ContentPlatform,
} from "@/lib/crm/content/types";
import { BUSINESS_CATEGORIES } from "@/lib/crm/types";

const inputStyle = {
  background: "#0A0907",
  border: "1px solid #2A2420",
  color: "#F2EDE6",
  borderRadius: 6,
  padding: "8px 12px",
  fontSize: 13,
  outline: "none",
  width: "100%",
};

export function ContentGeneratorForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [platform, setPlatform] = useState<ContentPlatform>("tiktok");
  const [audience, setAudience] = useState<string>("Freelancers");
  const [niche, setNiche] = useState<string>("Gym");
  const [city, setCity] = useState<string>("Rotterdam");
  const [angle, setAngle] = useState<ContentAngle>("discovery_leads");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) {
      setError("Enter a city.");
      return;
    }
    setError("");
    startTransition(async () => {
      const res = await generateContentAction({
        platform,
        audience,
        niche,
        city: city.trim(),
        angle,
      });
      if ("error" in res) {
        setError(res.error);
        return;
      }
      router.push(`/crm/content/${res.id}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg p-4 space-y-3"
      style={{ background: "#131109", border: "1px solid #2A2420" }}
    >
      <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
        Generate content package
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="space-y-1">
          <label className="text-xs" style={{ color: "rgba(242,237,230,0.5)" }}>Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value as ContentPlatform)} style={inputStyle}>
            {CONTENT_PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>{p.label} · {p.lengthHint}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs" style={{ color: "rgba(242,237,230,0.5)" }}>Audience</label>
          <select value={audience} onChange={(e) => setAudience(e.target.value)} style={inputStyle}>
            {CONTENT_AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs" style={{ color: "rgba(242,237,230,0.5)" }}>Niche</label>
          <select value={niche} onChange={(e) => setNiche(e.target.value)} style={inputStyle}>
            {BUSINESS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs" style={{ color: "rgba(242,237,230,0.5)" }}>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Rotterdam"
            style={inputStyle}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs" style={{ color: "rgba(242,237,230,0.5)" }}>Angle / template</label>
          <select value={angle} onChange={(e) => setAngle(e.target.value as ContentAngle)} style={inputStyle}>
            {CONTENT_ANGLES.map((a) => (
              <option key={a.value} value={a.value}>{a.templateLabel}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm px-3 py-2 rounded" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-[11px]" style={{ color: "rgba(242,237,230,0.4)" }}>
          Honest framing only — no &ldquo;guaranteed clients&rdquo;, no spam instructions, no fake claims.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 rounded text-sm font-medium"
          style={{ background: "#f59e0b", color: "#0A0907", opacity: pending ? 0.6 : 1 }}
        >
          {pending ? "Generating…" : "Generate content package"}
        </button>
      </div>
    </form>
  );
}
