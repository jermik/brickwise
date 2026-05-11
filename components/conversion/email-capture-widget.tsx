'use client';
import { useState } from 'react';
import { trackEmailCapture } from '@/lib/analytics';

export function EmailCaptureWidget({ source = 'learn_page' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitted) return;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      if (res.ok) {
        trackEmailCapture(source);
        setSubmitted(true);
      }
      // On error: keep the form open so the user can retry. No UI flash needed.
    } catch {
      // Network errors: silent. Form stays open for retry.
    }
  }

  if (submitted) {
    return (
      <div
        className="rounded-[12px] px-5 py-4 text-center"
        style={{ background: '#131109', border: '1px solid #2A2420' }}
      >
        <div className="text-[13px] font-semibold mb-0.5" style={{ color: '#F2EDE6' }}>
          You're on the list
        </div>
        <div className="text-[11px]" style={{ color: 'rgba(242,237,230,0.45)' }}>
          We'll alert you when high-yield properties are listed.
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[12px] px-5 py-4"
      style={{ background: '#131109', border: '1px solid #2A2420' }}
    >
      <div className="text-[13px] font-semibold mb-0.5" style={{ color: '#F2EDE6' }}>
        Get high-yield property alerts
      </div>
      <div className="text-[11px] mb-3" style={{ color: 'rgba(242,237,230,0.45)' }}>
        New properties matching your filters, delivered weekly. No spam.
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="brickwise-property-alerts-email" className="sr-only">
          Email address for property alerts
        </label>
        <input
          id="brickwise-property-alerts-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-label="Email address for property alerts"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 min-w-0 rounded-[8px] px-3 py-2 text-[12px] outline-none"
          style={{
            background: '#0c0b08',
            border: '1px solid #2A2420',
            color: '#F2EDE6',
          }}
        />
        <button
          type="submit"
          className="flex-shrink-0 text-[12px] font-semibold px-4 py-2 rounded-[8px] transition-opacity hover:opacity-85"
          style={{ background: '#3b82f6', color: '#fff' }}
        >
          Notify me
        </button>
      </form>
    </div>
  );
}
