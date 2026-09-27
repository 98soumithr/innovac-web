import { test, expect, type Page } from '@playwright/test';

const form = (page: Page) => page.locator('#rfq-page');

test.describe('RFQ form', () => {
  test('shows inline errors for the three required fields', async ({ page }) => {
    await page.goto('/request-a-quote/');
    await form(page).getByRole('button', { name: 'Request quote' }).click();
    await expect(form(page).getByText('Choose a product.')).toBeVisible();
    await expect(form(page).getByText('Enter your name.')).toBeVisible();
    await expect(form(page).getByText(/at least 10 digits/)).toBeVisible();
    await expect(form(page).locator('select[name=product]')).toHaveAttribute('aria-invalid', 'true');
    await expect(form(page).locator('select[name=product]')).toBeFocused();
  });

  test('rejects a bad email but allows a blank one', async ({ page }) => {
    await page.goto('/request-a-quote/?product=tap-out-cones');
    await form(page).getByLabel('Name').fill('Test Buyer');
    await form(page).getByLabel('Phone').fill('+91 98765 43210');
    await form(page).getByLabel('Email').fill('not-an-email');
    await form(page).getByRole('button', { name: 'Request quote' }).click();
    await expect(form(page).getByText(/valid email/)).toBeVisible();
    await form(page).getByLabel('Email').fill('');
    await expect(form(page).getByText(/valid email/)).toBeHidden();
  });

  test('pre-fills the product from ?product=', async ({ page }) => {
    await page.goto('/request-a-quote/?product=crucibles');
    await expect(form(page).locator('select[name=product]')).toHaveValue('crucibles');
  });

  test('a successful submit sends the fields and lands on thank-you with the reference', async ({ page }) => {
    let payload: Record<string, string> = {};
    await page.route('https://api.web3forms.com/submit', async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await page.goto('/request-a-quote/?product=pouring-cups');
    await form(page).getByLabel('Name').fill('Test Buyer');
    await form(page).getByLabel('Company').fill('Test Foundry');
    await form(page).getByLabel('Phone').fill('+91 98765 43210');
    await form(page).getByLabel('Details').fill('SG iron, 1450 pour');
    await form(page).getByRole('button', { name: 'Request quote' }).click();

    await expect(page).toHaveURL(/\/thank-you\/\?ref=INV-\d{6}-[A-Z0-9]{4}$/);
    const ref = new URL(page.url()).searchParams.get('ref');
    await expect(page.locator('[data-ref]')).toHaveText(ref!);
    expect(payload.access_key).toBe('test-key');
    expect(payload.reference).toBe(ref);
    expect(payload.product).toBe('Pouring cups');
    expect(payload.name).toBe('Test Buyer');
    expect(payload.subject).toContain(ref);
    expect(payload.botcheck).toBeUndefined();
  });

  test('a failed submit keeps the data and offers WhatsApp', async ({ page }) => {
    await page.route('https://api.web3forms.com/submit', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{"success":false}' }),
    );
    await page.goto('/request-a-quote/?product=crucibles');
    await form(page).getByLabel('Name').fill('Test Buyer');
    await form(page).getByLabel('Phone').fill('9876543210');
    await form(page).getByRole('button', { name: 'Request quote' }).click();
    await expect(form(page).getByRole('alert')).toContainText('didn’t send');
    await expect(form(page).getByLabel('Name')).toHaveValue('Test Buyer');
    await expect(form(page).getByRole('button', { name: 'Request quote' })).toBeEnabled();
    await expect(page).toHaveURL(/request-a-quote/);
  });
});
