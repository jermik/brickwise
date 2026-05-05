'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const NAV_LINKS = [
  { href: '/analyzer', label: 'Analyzer' },
  { href: '/learn', label: 'Learn' },
  { href: '/compare/realt-vs-lofty', label: 'Compare' },
  { href: '/rankings/highest-yield', label: 'Rankings' },
  { href: '/market', label: 'Market' },
];

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
            <div
              className="w-6 h-6 rounded-[5px] flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <svg width="11" height="9" viewBox="0 0 13 11" fill="none">
                <rect x="0" y="8" width="13" height="3" rx="0.75" fill="rgba(255,255,255,0.85)" />
                <rect x="0" y="4" width="9"  height="3" rx="0.75" fill="rgba(255,255,255,0.85)" />
                <rect x="0" y="0" width="5"  height="3" rx="0.75" fill="rgba(255,255,255,0.85)" />
              </svg>
            </div>
            <span className="text-[14px] font-bold tracking-[-0.3px]" style={{ color: '#F2EDE6' }}>
              Brickwise
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-5">
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

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#0A0907' }}>
      <PublicHeader />
      <main>{children}</main>
    </div>
  );
}
