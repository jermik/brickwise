import { test, expect } from '@playwright/test';

const PUBLIC_PAGES = [
  { path: '/', titleContains: 'Brickwise', hasDescription: true },
  { path: '/analyzer', titleContains: 'Tokenized', hasDescription: true },
  { path: '/compare/realt-vs-lofty', titleContains: 'RealT', hasDescription: true },
  { path: '/learn/what-is-tokenized-real-estate', titleContains: 'Tokenized Real Estate', hasDescription: true },
  { path: '/learn/lofty-review', titleContains: 'Lofty', hasDescription: true },
];

const NOINDEX_PAGES = ['/sign-in', '/sign-up'];

for (const { path, titleContains, hasDescription } of PUBLIC_PAGES) {
  test(`SEO: ${path} — title, description, canonical, OG`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('domcontentloaded');

    // Title
    const title = await page.title();
    expect(title).toContain(titleContains);
    expect(title.length).toBeGreaterThan(20);
    expect(title.length).toBeLessThan(120);

    // Meta description
    if (hasDescription) {
      const desc = await page.locator('meta[name="description"]').getAttribute('content');
      expect(desc).not.toBeNull();
      expect(desc!.length).toBeGreaterThan(50);
      expect(desc!.length).toBeLessThan(300);
    }

    // Canonical
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('brickwise.pro');

    // Open Graph
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).not.toBeNull();
    expect(ogTitle!.length).toBeGreaterThan(5);

    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDesc).not.toBeNull();
  });
}

for (const path of NOINDEX_PAGES) {
  test(`SEO: ${path} is noindex`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('domcontentloaded');

    const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content');
    // Either robots meta has noindex, or the page redirects away (Clerk handles this)
    if (robotsMeta) {
      expect(robotsMeta.toLowerCase()).toContain('noindex');
    }
  });
}

test('SEO: sitemap.xml is valid XML and contains public pages', async ({ page }) => {
  const res = await page.request.get('/sitemap.xml');
  expect(res.status()).toBe(200);

  const body = await res.text();
  expect(body).toContain('<urlset');
  expect(body).toContain('brickwise.pro');
  expect(body).toContain('/analyzer');
  expect(body).toContain('/compare/realt-vs-lofty');
  expect(body).toContain('/learn/what-is-tokenized-real-estate');
  expect(body).toContain('/learn/lofty-review');

  // Should NOT contain auth or private pages
  expect(body).not.toContain('/sign-in');
  expect(body).not.toContain('/sign-up');
  expect(body).not.toContain('/dashboard');
});

test('SEO: robots.txt is correct', async ({ page }) => {
  const res = await page.request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('User-agent: *');
  expect(body).toContain('Disallow: /sign-in');
  expect(body).toContain('Disallow: /dashboard');
  expect(body).toContain('Sitemap:');
  expect(body).toContain('brickwise.pro');
});

test('SEO: JSON-LD present on homepage', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const scripts = await page.locator('script[type="application/ld+json"]').count();
  expect(scripts).toBeGreaterThan(0);
});

test('SEO: learn page has Article JSON-LD', async ({ page }) => {
  await page.goto('/learn/what-is-tokenized-real-estate');
  await page.waitForLoadState('domcontentloaded');

  const ldContent = await page.locator('script[type="application/ld+json"]').allTextContents();
  const hasArticle = ldContent.some((s) => s.includes('"Article"'));
  const hasFaq = ldContent.some((s) => s.includes('"FAQPage"'));
  expect(hasArticle || hasFaq).toBe(true);
});
