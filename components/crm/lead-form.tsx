"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createLead, updateLeadAction } from "@/lib/crm/actions";
import { BUSINESS_CATEGORIES, STATUS_CONFIG, type Lead, type LeadStatus } from "@/lib/crm/types";

interface LeadFormProps {
  lead?: Lead;
  mode: "create" | "edit";
}

const inputCls = "w-full rounded px-3 py-2 text-sm outline-none transition-colors focus:border-amber-500/50";
const inputStyle = {
  background: "#0A0907",
  border: "1px solid #2A2420",
  color: "#F2EDE6",
};

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeWebsite(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return "https://" + v;
}

function socialsToText(arr: string[] | undefined): string {
  return (arr ?? []).join("\n");
}

function textToSocials(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function LeadForm({ lead, mode }: LeadFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    businessName: lead?.businessName ?? "",
    category: lead?.category ?? "Other",
    city: lead?.city ?? "",
    province: lead?.province ?? "",
    website: lead?.website ?? "",
    email: lead?.email ?? "",
    contactPageUrl: lead?.contactPageUrl ?? "",
    phone: lead?.phone ?? "",
    googleMapsUrl: lead?.googleMapsUrl ?? "",
    googleRating: lead?.googleRating != null ? String(lead.googleRating) : "",
    socialsText: socialsToText(lead?.socials),
    notes: lead?.notes ?? "",
    status: lead?.status ?? ("new" as LeadStatus),
    consentStatus: lead?.consentStatus ?? "none",
    doNotContact: lead?.doNotContact ?? false,
    unsubscribed: lead?.unsubscribed ?? false,
  });

  function set(key: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): { ok: true } | { ok: false; error: string } {
    if (!form.businessName.trim()) {
      return { ok: false, error: "Business name is required." };
    }
    if (!form.website.trim()) {
      return { ok: false, error: "Website is required." };
    }
    if (form.email.trim() && !EMAIL_RX.test(form.email.trim())) {
      return { ok: false, error: "Email is not valid." };
    }
    if (form.googleRating.trim()) {
      const n = Number(form.googleRating);
      if (!Number.isFinite(n) || n < 0 || n > 5) {
        return { ok: false, error: "Google rating must be a number between 0 and 5." };
      }
    }
    return { ok: true };
  }

  function buildPayload() {
    const websiteNormalized = normalizeWebsite(form.website);
    const ratingNum = form.googleRating.trim() ? Number(form.googleRating) : undefined;
    const socials = textToSocials(form.socialsText);
    return {
      businessName: form.businessName.trim(),
      category: form.category,
      city: form.city.trim(),
      province: form.province.trim(),
      website: websiteNormalized || undefined,
      email: form.email.trim() || undefined,
      contactPageUrl: form.contactPageUrl.trim() || undefined,
      phone: form.phone.trim() || undefined,
      googleMapsUrl: form.googleMapsUrl.trim() || undefined,
      googleRating: ratingNum,
      socials: socials.length > 0 ? socials : undefined,
      notes: form.notes.trim() || undefined,
      status: form.status,
      consentStatus: form.consentStatus as Lead["consentStatus"],
      doNotContact: form.doNotContact,
      unsubscribed: form.unsubscribed,
    };
  }

  function handleSubmit(e: React.FormEvent, options: { thenAudit?: boolean } = {}) {
    e.preventDefault();
    const v = validate();
    if (!v.ok) {
      setError(v.error);
      return;
    }
    setError("");
    const payload = buildPayload();

    startTransition(async () => {
      if (mode === "create") {
        const result = await createLead(payload);
        const dest = options.thenAudit
          ? `/crm/leads/${result.id}/audit`
          : `/crm/leads/${result.id}`;
        router.push(dest);
      } else {
        await updateLeadAction(lead!.id, payload);
        router.push(`/crm/leads/${lead!.id}`);
      }
    });
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
      {error && (
        <p className="text-sm px-3 py-2 rounded" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
          {error}
        </p>
      )}

      {/* Core info */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          Business info
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Business name *</label>
            <input
              className={inputCls}
              style={inputStyle}
              value={form.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Category / niche</label>
            <select
              className={inputCls}
              style={inputStyle}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {BUSINESS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>City</label>
            <input
              className={inputCls}
              style={inputStyle}
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Province / Region</label>
            <input
              className={inputCls}
              style={inputStyle}
              value={form.province}
              onChange={(e) => set("province", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Contact details */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          Contact details
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Website URL *</label>
            <input
              className={inputCls}
              style={inputStyle}
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              onBlur={(e) => set("website", normalizeWebsite(e.target.value))}
              placeholder="example.com or https://example.com"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Email</label>
            <input type="email" className={inputCls} style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Phone</label>
            <input type="tel" className={inputCls} style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Google rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              className={inputCls}
              style={inputStyle}
              value={form.googleRating}
              onChange={(e) => set("googleRating", e.target.value)}
              placeholder="e.g. 4.6"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Contact page URL</label>
            <input type="url" className={inputCls} style={inputStyle} value={form.contactPageUrl} onChange={(e) => set("contactPageUrl", e.target.value)} placeholder="https://" />
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Google Maps URL</label>
            <input type="url" className={inputCls} style={inputStyle} value={form.googleMapsUrl} onChange={(e) => set("googleMapsUrl", e.target.value)} placeholder="https://maps.google.com/…" />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>
              Socials <span style={{ color: "rgba(242,237,230,0.4)" }}>(one URL per line, or comma-separated)</span>
            </label>
            <textarea
              rows={3}
              className={inputCls}
              style={inputStyle}
              value={form.socialsText}
              onChange={(e) => set("socialsText", e.target.value)}
              placeholder={"https://instagram.com/example\nhttps://linkedin.com/company/example"}
            />
          </div>
        </div>
      </section>

      {/* CRM fields */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(242,237,230,0.4)" }}>
          CRM status
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Status</label>
            <select
              className={inputCls}
              style={inputStyle}
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {Object.entries(STATUS_CONFIG).map(([v, cfg]) => (
                <option key={v} value={v}>{cfg.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Consent status</label>
            <select
              className={inputCls}
              style={inputStyle}
              value={form.consentStatus}
              onChange={(e) => set("consentStatus", e.target.value)}
            >
              <option value="none">None</option>
              <option value="opted_in">Opted in</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "rgba(242,237,230,0.7)" }}>
            <input
              type="checkbox"
              checked={form.doNotContact}
              onChange={(e) => set("doNotContact", e.target.checked)}
              className="rounded"
              style={{ accentColor: "#f87171" }}
            />
            Do Not Contact
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "rgba(242,237,230,0.7)" }}>
            <input
              type="checkbox"
              checked={form.unsubscribed}
              onChange={(e) => set("unsubscribed", e.target.checked)}
              className="rounded"
              style={{ accentColor: "#f87171" }}
            />
            Unsubscribed
          </label>
        </div>
        <div className="space-y-1">
          <label className="text-xs" style={{ color: "rgba(242,237,230,0.6)" }}>Notes</label>
          <textarea
            rows={3}
            className={inputCls}
            style={inputStyle}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Internal notes about this lead…"
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-2">
        {mode === "create" ? (
          <>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, { thenAudit: true })}
              disabled={pending}
              className="px-5 py-2.5 rounded text-sm font-medium transition-opacity"
              style={{ background: "#f59e0b", color: "#0A0907", opacity: pending ? 0.6 : 1 }}
            >
              {pending ? "Saving…" : "Save and audit"}
            </button>
            <button
              type="submit"
              disabled={pending}
              className="px-5 py-2.5 rounded text-sm transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.85)", border: "1px solid #2A2420", opacity: pending ? 0.6 : 1 }}
            >
              Save lead
            </button>
          </>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="px-5 py-2.5 rounded text-sm font-medium transition-opacity"
            style={{ background: "#f59e0b", color: "#0A0907", opacity: pending ? 0.6 : 1 }}
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        )}
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded text-sm transition-colors"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,237,230,0.7)", border: "1px solid #2A2420" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
