"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { importCSVAction } from "@/lib/crm/actions";
import { CSV_TEMPLATE_EXAMPLE } from "@/lib/crm/csv";

export function CSVImport() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setContent(String(ev.target?.result ?? ""));
    reader.readAsText(file);
  }

  function handleImport() {
    if (!content.trim()) return;
    startTransition(async () => {
      const res = await importCSVAction(content);
      setResult(res);
      if (res.imported > 0) {
        setTimeout(() => router.push("/crm/leads"), 1800);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Template download */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: "#131109", border: "1px solid #2A2420" }}>
        <p className="font-mono text-[12px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          CSV format
        </p>
        <p className="text-sm" style={{ color: "rgba(242,237,230,0.65)" }}>
          Your CSV must have these columns (header row required):
        </p>
        <pre className="text-xs rounded px-3 py-2 overflow-x-auto" style={{ background: "#0A0907", color: "#f59e0b", border: "1px solid #2A2420" }}>
          businessName, category, city, province, website, email, phone
        </pre>
        <button
          onClick={() => {
            const blob = new Blob([CSV_TEMPLATE_EXAMPLE], { type: "text/csv" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "crm-leads-template.csv";
            a.click();
          }}
          className="text-xs underline"
          style={{ color: "#f59e0b" }}
        >
          Download template CSV
        </button>
      </div>

      {/* Upload */}
      <div className="space-y-3">
        <label
          className="block rounded-lg border-2 border-dashed px-6 py-8 text-center cursor-pointer transition-colors"
          style={{ borderColor: "#2A2420", color: "rgba(242,237,230,0.4)" }}
        >
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={handleFile} />
          <span className="block text-3xl mb-2">↑</span>
          <span className="text-sm">Click to choose a CSV file</span>
          {content && <span className="block text-xs mt-1" style={{ color: "#10b981" }}>File loaded ({content.split("\n").length - 1} data rows)</span>}
        </label>

        <p className="text-xs" style={{ color: "rgba(242,237,230,0.4)" }}>
          Or paste CSV content directly:
        </p>
        <textarea
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={CSV_TEMPLATE_EXAMPLE}
          className="w-full rounded px-3 py-2 text-xs font-mono outline-none"
          style={{ background: "#0A0907", border: "1px solid #2A2420", color: "#F2EDE6", resize: "vertical" }}
        />
      </div>

      {/* Result */}
      {result && (
        <div
          className="rounded-lg px-4 py-3 space-y-1"
          style={{
            background: result.imported > 0 ? "rgba(16,185,129,0.08)" : "rgba(248,113,113,0.08)",
            border: `1px solid ${result.imported > 0 ? "rgba(16,185,129,0.25)" : "rgba(248,113,113,0.25)"}`,
          }}
        >
          {result.imported > 0 && (
            <p className="text-sm font-medium" style={{ color: "#10b981" }}>
              {result.imported} lead{result.imported !== 1 ? "s" : ""} imported. Redirecting…
            </p>
          )}
          {result.errors.map((err, i) => (
            <p key={i} className="text-xs" style={{ color: "#f87171" }}>{err}</p>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleImport}
          disabled={pending || !content.trim()}
          className="px-5 py-2.5 rounded text-sm font-medium transition-opacity"
          style={{ background: "#f59e0b", color: "#0A0907", opacity: pending || !content.trim() ? 0.5 : 1 }}
        >
          {pending ? "Importing…" : "Import leads"}
        </button>
      </div>

      {/* Compliance */}
      <p className="text-xs" style={{ color: "rgba(242,237,230,0.35)" }}>
        Only import leads you have a legitimate reason to contact. Do not import scraped or purchased lists.
      </p>
    </div>
  );
}
