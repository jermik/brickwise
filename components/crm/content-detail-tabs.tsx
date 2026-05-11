"use client";

import { useState, useTransition } from "react";
import { updateContentStatusAction, deleteContentIdeaAction } from "@/lib/crm/actions";
import {
  CONTENT_PLATFORMS,
  CONTENT_STATUS_CONFIG,
  type ContentIdea,
  type ContentStatus,
} from "@/lib/crm/content/types";

const TABS = [
  { id: "hook", label: "Hook" },
  { id: "script", label: "Script" },
  { id: "subtitles", label: "Subtitles" },
  { id: "caption", label: "Caption" },
  { id: "platform", label: "Platform pack" },
  { id: "notes", label: "Retention" },
] as const;

type Tab = (typeof TABS)[number]["id"];

interface Props {
  idea: ContentIdea;
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  async function handle() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }
  return (
    <button
      type="button"
      onClick={handle}
      className="px-3 py-1.5 rounded text-xs"
      style={{
        background: done ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)",
        color: done ? "#10b981" : "#F2EDE6",
        border: `1px solid ${done ? "rgba(16,185,129,0.3)" : "#2A2420"}`,
      }}
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}

const areaStyle = {
  background: "#0A0907",
  border: "1px solid #2A2420",
  color: "#F2EDE6",
  borderRadius: 8,
  padding: 16,
  fontSize: 13,
  lineHeight: 1.6,
  fontFamily: "var(--font-dm-mono)",
  width: "100%",
  minHeight: 280,
  resize: "vertical" as const,
  outline: "none",
};

export function ContentDetailTabs({ idea }: Props) {
  const [tab, setTab] = useState<Tab>("hook");
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const platform = CONTENT_PLATFORMS.find((p) => p.value === idea.platform);

  function setStatus(status: ContentStatus) {
    startTransition(() => updateContentStatusAction(idea.id, status));
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    startTransition(() => deleteContentIdeaAction(idea.id));
  }

  const scriptText = idea.scriptScenes
    .map(
      (s) =>
        `Scene ${s.scene} — ${s.startSeconds}s → ${s.endSeconds}s\n` +
        `On-screen: ${s.onscreenText}\n` +
        `Voiceover: ${s.voiceover}\n` +
        `B-roll: ${s.bRoll}`,
    )
    .join("\n\n");

  return (
    <div className="space-y-5">
      {/* Status row */}
      <div className="space-y-2">
        <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          Status
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(CONTENT_STATUS_CONFIG) as [ContentStatus, (typeof CONTENT_STATUS_CONFIG)[ContentStatus]][]).map(([val, cfg]) => (
            <button
              key={val}
              onClick={() => setStatus(val)}
              disabled={pending || idea.status === val}
              className="px-2.5 py-1 rounded text-xs font-mono"
              style={{
                background: idea.status === val ? cfg.bg : "rgba(255,255,255,0.04)",
                color: idea.status === val ? cfg.color : "rgba(242,237,230,0.45)",
                border: `1px solid ${idea.status === val ? cfg.color + "44" : "#2A2420"}`,
                opacity: pending ? 0.6 : 1,
              }}
            >
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg p-1" style={{ background: "#131109", border: "1px solid #2A2420" }}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 min-w-[90px] rounded px-3 py-1.5 text-xs"
            style={{
              background: tab === id ? "rgba(245,158,11,0.15)" : "transparent",
              color: tab === id ? "#f59e0b" : "rgba(242,237,230,0.5)",
              border: tab === id ? "1px solid rgba(245,158,11,0.25)" : "1px solid transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "hook" && (
        <div className="space-y-3">
          <div className="rounded-lg p-4" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "#f59e0b" }}>3-second hook</p>
            <p className="font-display text-xl mt-2" style={{ color: "#F2EDE6" }}>{idea.hook}</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
              Thumbnail text · CTA · Pinned comment
            </p>
            <textarea readOnly style={areaStyle} value={
              `THUMBNAIL TEXT\n${idea.thumbnailText}\n\nCTA\n${idea.cta}\n\nPINNED COMMENT\n${idea.pinnedComment}`
            } />
            <CopyButton text={idea.hook} label="Copy hook" />
          </div>
        </div>
      )}

      {tab === "script" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
              Scene-by-scene script · {idea.scriptScenes.length} scenes · ~{idea.durationSeconds}s
            </p>
            <CopyButton text={scriptText} label="Copy script" />
          </div>
          <textarea readOnly style={{ ...areaStyle, minHeight: 400 }} value={scriptText} />
          <details className="rounded-lg" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <summary className="cursor-pointer p-3 text-xs flex justify-between" style={{ color: "rgba(242,237,230,0.6)" }}>
              <span>Continuous voiceover (TTS-ready)</span>
              <span style={{ color: "#f59e0b" }}>+</span>
            </summary>
            <div className="p-3 pt-0 space-y-2">
              <textarea readOnly style={{ ...areaStyle, minHeight: 200 }} value={idea.voiceover} />
              <CopyButton text={idea.voiceover} label="Copy voiceover" />
            </div>
          </details>
        </div>
      )}

      {tab === "subtitles" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
              SRT subtitles
            </p>
            <CopyButton text={idea.subtitlesSrt} label="Copy SRT" />
          </div>
          <textarea readOnly style={{ ...areaStyle, minHeight: 360 }} value={idea.subtitlesSrt} />
          <details className="rounded-lg" style={{ background: "#131109", border: "1px solid #2A2420" }}>
            <summary className="cursor-pointer p-3 text-xs flex justify-between" style={{ color: "rgba(242,237,230,0.6)" }}>
              <span>Plain text captions</span>
              <span style={{ color: "#f59e0b" }}>+</span>
            </summary>
            <div className="p-3 pt-0 space-y-2">
              <textarea readOnly style={areaStyle} value={idea.captionsPlain} />
              <CopyButton text={idea.captionsPlain} label="Copy plain captions" />
            </div>
          </details>
        </div>
      )}

      {tab === "caption" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
              {platform?.label} caption · {idea.caption.length}/{platform?.captionMaxChars} chars
            </p>
            <CopyButton text={`${idea.caption}\n\n${idea.hashtags}`} label="Copy caption + tags" />
          </div>
          <textarea readOnly style={areaStyle} value={idea.caption} />
          <div>
            <p className="font-mono text-[12px] tracking-widest uppercase mb-1" style={{ color: "rgba(242,237,230,0.4)" }}>
              Hashtags
            </p>
            <p className="text-sm font-mono p-3 rounded" style={{ background: "#0A0907", border: "1px solid #2A2420", color: "#60a5fa" }}>
              {idea.hashtags}
            </p>
          </div>
        </div>
      )}

      {tab === "platform" && (
        <div className="space-y-2">
          <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
            {platform?.label} platform pack
          </p>
          {[
            { label: "Title", v: idea.title },
            { label: "Caption", v: idea.caption },
            { label: "Hashtags", v: idea.hashtags },
            { label: "CTA", v: idea.cta },
            { label: "Pinned comment", v: idea.pinnedComment },
            { label: "Thumbnail text", v: idea.thumbnailText },
            { label: "Recommended length", v: `${idea.durationSeconds}s (${platform?.lengthHint})` },
          ].map((row) => (
            <div key={row.label} className="rounded-lg p-3 flex items-start gap-3" style={{ background: "#131109", border: "1px solid #2A2420" }}>
              <span className="font-mono text-[12px] tracking-widest uppercase shrink-0 w-32 pt-0.5" style={{ color: "rgba(242,237,230,0.4)" }}>
                {row.label}
              </span>
              <span className="flex-1 text-sm" style={{ color: "#F2EDE6", whiteSpace: "pre-wrap" }}>{row.v}</span>
              <CopyButton text={row.v} label="Copy" />
            </div>
          ))}
        </div>
      )}

      {tab === "notes" && (
        <div className="rounded-lg p-4" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.2)" }}>
          <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "#a78bfa" }}>Retention notes</p>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: "rgba(242,237,230,0.85)" }}>
            {idea.retentionNotes}
          </p>
        </div>
      )}

      {/* Delete */}
      <div className="pt-4" style={{ borderTop: "1px solid #2A2420" }}>
        <button
          onClick={handleDelete}
          disabled={pending}
          className="px-3 py-2 rounded text-xs"
          style={{
            background: confirmDelete ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.04)",
            color: confirmDelete ? "#f87171" : "rgba(242,237,230,0.45)",
            border: `1px solid ${confirmDelete ? "rgba(248,113,113,0.3)" : "#2A2420"}`,
            opacity: pending ? 0.6 : 1,
          }}
        >
          {pending ? "Deleting…" : confirmDelete ? "Click again to confirm delete" : "Delete content idea"}
        </button>
      </div>
    </div>
  );
}
