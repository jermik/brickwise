import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('loads with correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Brickwise');
  });

  test('shows primary CTA linking to analyzer or signup', async ({ page }) => {
    const cta = page.locator('a[href="/analyzer"], a[href*="sign-up"], a[href*="signup"]').first();
    await expect(cta).toBeVisible();
  });

  test('navigation links are functional', async ({ page }) => {
    // Check that the analyzer link in nav works
    const analyzerLink = page.locator('a[href="/analyzer"]').first();
    if (await analyzerLink.count() > 0) {
      await analyzerLink.click();
      await page.waitForURL('**/analyzer**');
      expect(page.url()).toContain('/analyzer');
    }
  });

  test('has no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Filter out known third-party errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('gtag') && !e.includes('fonts.googleapis') && !e.includes('clerk')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('responsive: mobile viewport renders', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    expect(title).toContain('Brickwise');
  });
});

test('404 page renders for unknown routes', async ({ page }) => {
  await page.goto('/this-does-not-exist-xyz');
  await page.waitForLoadState('networkidle');
  // Next.js not-found.tsx should render
  const body = await page.textContent('body');
  expect(body).toMatch(/not found|404/i);
});
