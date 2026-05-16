import { describe, it, expect, vi, beforeEach } from 'vitest';

// Vitest doesn't have a browser env; mock track and window
vi.mock('@vercel/analytics', () => ({ track: vi.fn() }));

const mockGtag = vi.fn();

beforeEach(() => {
  mockGtag.mockClear();
  // @ts-expect-error test global
  global.window = { gtag: mockGtag, location: { pathname: '/test' } };
});

const { track } = await import('@vercel/analytics');

const {
  trackPageView,
  trackPropertyViewed,
  trackAnalyzerUsed,
  trackAnalyzerFiltered,
  trackLearnPageViewed,
  trackComparisonViewed,
  trackCtaClick,
  trackEmailCapture,
  trackSignupStarted,
  trackSignupCompleted,
  trackError,
  track404,
} = await import('@/lib/analytics');

describe('analytics dual-fire', () => {
  it('trackPageView calls Vercel track', () => {
    trackPageView('/analyzer');
    expect(track).toHaveBeenCalledWith('page_view', expect.objectContaining({ page_path: '/analyzer' }));
  });

  it('trackPropertyViewed passes all params', () => {
    trackPropertyViewed('prop-1', 'Lofty', 'Detroit');
    expect(track).toHaveBeenCalledWith('property_viewed', { property_id: 'prop-1', platform: 'Lofty', city: 'Detroit' });
  });

  it('trackAnalyzerUsed serializes filters', () => {
    const filters = { minYield: 8, risk: 'Low' };
    trackAnalyzerUsed(filters);
    expect(track).toHaveBeenCalledWith('analyzer_used', expect.objectContaining({ filters: JSON.stringify(filters) }));
  });

  it('trackAnalyzerFiltered passes type and value', () => {
    trackAnalyzerFiltered('platform', 'Lofty');
    expect(track).toHaveBeenCalledWith('analyzer_filtered', { filter_type: 'platform', value: 'Lofty' });
  });

  it('trackLearnPageViewed passes slug', () => {
    trackLearnPageViewed('lofty-review');
    expect(track).toHaveBeenCalledWith('learn_page_viewed', { slug: 'lofty-review' });
  });

  it('trackComparisonViewed passes slug', () => {
    trackComparisonViewed('realt-vs-lofty');
    expect(track).toHaveBeenCalledWith('comparison_viewed', { slug: 'realt-vs-lofty' });
  });

  it('trackCtaClick passes label and destination', () => {
    trackCtaClick('Browse Properties', '/analyzer');
    expect(track).toHaveBeenCalledWith('cta_click', { label: 'Browse Properties', destination: '/analyzer' });
  });

  it('trackEmailCapture includes source', () => {
    trackEmailCapture('homepage_banner');
    expect(track).toHaveBeenCalledWith('email_captured', expect.objectContaining({ event_label: 'homepage_banner' }));
  });

  it('trackSignupStarted passes method', () => {
    trackSignupStarted('email');
    expect(track).toHaveBeenCalledWith('signup_started', { method: 'email' });
  });

  it('trackSignupCompleted passes method and category', () => {
    trackSignupCompleted('google');
    expect(track).toHaveBeenCalledWith('signup_completed', expect.objectContaining({ method: 'google' }));
  });

  it('trackError truncates long messages', () => {
    const longMsg = 'x'.repeat(200);
    trackError('react_boundary', longMsg);
    const call = (track as ReturnType<typeof vi.fn>).mock.calls.find(c => c[0] === 'frontend_error');
    expect(call).toBeDefined();
    expect(call![1].error_message.length).toBeLessThanOrEqual(150);
  });

  it('track404 fires with url and referrer', () => {
    track404('/missing', 'https://google.com');
    expect(track).toHaveBeenCalledWith('page_404', { url: '/missing', referrer: 'https://google.com' });
  });
});

describe('silent failure', () => {
  it('does not throw when window is undefined', () => {
    // @ts-expect-error test
    global.window = undefined;
    expect(() => trackPageView('/any')).not.toThrow();
  });
});
