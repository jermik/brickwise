'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackCtaClick } from '@/lib/analytics';

export function StickyLearnCta({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function onScroll() {
      if (dismissed) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      setVisible(window.scrollY / total > 0.5);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <>
      <style>{`
        @keyframes bw-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
      <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div
          className="pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 max-w-sm w-full"
          style={{
            background: '#131109',
            border: '1px solid #2A2420',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            animation: 'bw-slide-up 0.35s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate" style={{ color: '#F2EDE6' }}>
              Analyze all properties — free
            </div>
            <div className="text-[11px]" style={{ color: 'rgba(242,237,230,0.4)' }}>
              Filter by yield, score & platform
            </div>
          </div>
          <Link
            href="/analyzer"
            onClick={() => trackCtaClick(label, '/analyzer')}
            className="flex-shrink-0 text-[12px] font-semibold px-4 py-2 rounded-[8px] no-underline transition-opacity hover:opacity-85"
            style={{ background: '#3b82f6', color: '#fff' }}
          >
            Open Analyzer →
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 text-[16px] leading-none"
            aria-label="Dismiss"
            style={{ color: 'rgba(242,237,230,0.4)' }}
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
}
