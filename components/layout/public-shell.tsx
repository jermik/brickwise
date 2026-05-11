'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { BrickwiseMark } from '@/components/brand/brickwise-mark';

const NAV_LINKS = [
  { href: '/analyzer', label: 'Analyzer' },
  { href: '/learn', label: 'Learn' },
  { href: '/compare/realt-vs-lofty', label: 'Compare' },
  { href: '/rankings/highest-yield', label: 'Rankings' },
  { href: '/market', label: 'Market' },
];

const FOOTER_PRODUCT = [
  { href: '/analyzer', label: 'Analyzer' },
  { href: '/rankings/highest-yield', label: 'Highest yield' },
  { href: '/rankings/buy-signals', label: 'Buy signals' },
  { href: '/rankings/undervalued', label: 'Undervalued' },
  { href: '/market', label: 'Market updates' },
];

const FOOTER_LEARN = [
  { href: '/learn/what-is-tokenized-real-estate', label: 'What is tokenized real estate?' },
  { href: '/learn/how-to-invest-in-tokenized-real-estate', label: 'How to invest' },
  { href: '/learn/realt-review', label: 'RealT review' },
  { href: '/compare/realt-vs-lofty', label: 'RealT vs Lofty' },
  { href: '/algorand', label: 'Algorand ecosystem' },
];

const FOOTER_COMPANY = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
];

const SITE_LAUNCHED = '2026-01-15';

function PublicHeader() {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: '#120F0A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2 no-underline flex-shrink-0">
            <BrickwiseMark size={24} variant="dark" />
            <span className="text-[14px] font-bold tracking-[-0.3px]" style={{ color: '#F2EDE6' }}>
              Brickwise
            </span>
          </Link>
          <nav aria-label="Primary" className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[12px] no-underline transition-colors"
                  style={{ color: active ? '#F2EDE6' : 'rgba(242,237,230,0.45)' }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {isLoaded && (
          <Link
            href={isSignedIn ? '/' : '/sign-in'}
            className="flex-shrink-0 text-[12px] font-semibold px-4 py-1.5 rounded-[7px] no-underline transition-opacity hover:opacity-85"
            style={{
              background: isSignedIn ? 'rgba(255,255,255,0.08)' : '#22c55e',
              color: isSignedIn ? 'rgba(255,255,255,0.7)' : '#0A0907',
            }}
          >
            {isSignedIn ? 'Dashboard →' : 'Sign in'}
          </Link>
        )}
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer
      className="mt-16"
      style={{ background: '#0F0D09', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 no-underline mb-3">
              <BrickwiseMark size={22} variant="dark" />
              <span className="text-[13px] font-bold" style={{ color: '#F2EDE6' }}>
                Brickwise
              </span>
            </Link>
            <p className="text-[12px] leading-[1.55] max-w-[280px]" style={{ color: 'rgba(242,237,230,0.45)' }}>
              Independent yield, risk and fair-value analytics for tokenized real estate on Lofty and RealT.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://x.com/brickwisepro"
                rel="me noopener"
                aria-label="Brickwise on X"
                className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] no-underline"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" fill="rgba(242,237,230,0.7)">
                  <path d="M18.244 2H21.5l-7.5 8.567L23 22h-6.844l-5.36-7.014L4.5 22H1.244l8.029-9.171L1 2h7.018l4.847 6.41L18.244 2zm-1.2 18h1.9L7.04 4H5.04l12.004 16z" />
                </svg>
              </a>
            </div>
          </div>

          <FooterColumn title="Product" links={FOOTER_PRODUCT} />
          <FooterColumn title="Learn" links={FOOTER_LEARN} />
          <FooterColumn title="Company" links={FOOTER_COMPANY} />
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-[11px] leading-[1.6]" style={{ color: 'rgba(242,237,230,0.4)' }}>
            &copy; <time dateTime={SITE_LAUNCHED.slice(0, 4)}>{new Date().getFullYear()}</time> Brickwise &middot;
            Operating since <time dateTime={SITE_LAUNCHED}>Jan 2026</time> &middot; Not financial advice.
            Tokenized real estate carries property, platform and liquidity risk.
          </p>
          <p className="text-[11px]" style={{ color: 'rgba(242,237,230,0.35)' }}>
            <a href="mailto:hello@brickwise.pro" style={{ color: 'inherit' }}>
              hello@brickwise.pro
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <div
        className="text-[12px] font-semibold uppercase tracking-[0.6px] mb-3"
        style={{ color: 'rgba(242,237,230,0.55)' }}
      >
        {title}
      </div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[12px] no-underline transition-colors"
              style={{ color: 'rgba(242,237,230,0.45)' }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0907' }}>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
