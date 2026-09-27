import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';

const slugs = (dir: string) => readdirSync(`src/content/${dir}`).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3));
const routes = [
  '/', '/products/', '/custom-ceramic-fibre-shapes/', '/plant-and-quality/', '/industries/', '/about/', '/downloads/',
  '/request-a-quote/', '/contact/', '/privacy/', '/thank-you/', '/styleguide/',
  ...slugs('families').map((s) => `/products/${s}/`),
  ...slugs('products').map((s) => `/products/${s}/`),
  ...slugs('industries').map((s) => `/industries/${s}/`),
];

for (const route of routes) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    const res = await page.goto(route, { waitUntil: 'networkidle' });
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(errors).toEqual([]);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.nodes[0]?.target.join(' ')}`)).toEqual([]);
  });
}

test('unknown paths return the 404 page', async ({ page }) => {
  const res = await page.goto('/no-such-page/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText(/isn’t here/);
});

test('old Hostinger URLs redirect to the new pages', async ({ page }) => {
  await page.goto('/sleeves/');
  await page.waitForURL('**/products/insulating-exothermic-sleeves/');
  await page.goto('/high-temp-ceramic-insulation-products/');
  await page.waitForURL('**/products/thermal-insulation/');
});

test('downloads filter hides other families without JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/downloads/');
  const rows = page.locator('.downloads-list li');
  const total = await rows.count();
  await page.locator('.downloads-filter').getByText('Hot gas filtration', { exact: true }).click();
  await expect(rows.filter({ visible: true })).toHaveCount(2); // company profile + candle datasheet
  expect(total).toBeGreaterThan(2);
  await ctx.close();
});

test('keyboard: RFQ fields are reachable in order', async ({ page }) => {
  await page.goto('/request-a-quote/');
  await page.locator('#rfq-page-product').focus();
  const order: string[] = [];
  for (let i = 0; i < 8; i++) {
    order.push(await page.evaluate(() => (document.activeElement as HTMLInputElement).name));
    await page.keyboard.press('Tab');
  }
  expect(order).toEqual(['product', 'quantity', 'name', 'company', 'phone', 'whatsapp_ok', 'email', 'delivery']);
});
