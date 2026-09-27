// RFQ form island: ?product= pre-fill, inline validation, reference number, Web3Forms submit,
// redirect to /thank-you/?ref=…, and a WhatsApp fallback that keeps what the buyer typed.

const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';
const ALLOWED_FILES = /\.(pdf|dwg|dxf|step|stp|jpe?g|png)$/i;
const MAX_BYTES = 25 * 1024 * 1024;

type FieldName = 'product' | 'name' | 'phone' | 'email' | 'attachment';

/** INV-YYMMDD-XXXX (site-plan §3). */
export function makeReference(now = new Date()): string {
  const yymmdd = [now.getFullYear() % 100, now.getMonth() + 1, now.getDate()]
    .map((n) => String(n).padStart(2, '0'))
    .join('');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const suffix = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
  return `INV-${yymmdd}-${suffix}`;
}

function validate(form: HTMLFormElement): Partial<Record<FieldName, boolean>> {
  const data = new FormData(form);
  const text = (k: string) => String(data.get(k) ?? '').trim();
  const invalid: Partial<Record<FieldName, boolean>> = {};
  if (!text('product')) invalid.product = true;
  if (!text('name')) invalid.name = true;
  if (text('phone').replace(/\D/g, '').length < 10) invalid.phone = true;
  const email = text('email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid.email = true;
  const files = form.querySelector<HTMLInputElement>('[data-file-input]')?.files;
  if (files && files.length) {
    const total = Array.from(files).reduce((sum, f) => sum + f.size, 0);
    if (total > MAX_BYTES || Array.from(files).some((f) => !ALLOWED_FILES.test(f.name))) invalid.attachment = true;
  }
  return invalid;
}

function showErrors(form: HTMLFormElement, invalid: Partial<Record<FieldName, boolean>>) {
  form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => {
    const name = el.dataset.errorFor as FieldName;
    const bad = Boolean(invalid[name]);
    el.classList.toggle('hidden', !bad);
    const control = form.elements.namedItem(name);
    if (control instanceof HTMLElement) {
      if (bad) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
    }
  });
}

function whatsappWithRef(base: string, ref: string, product: string): string {
  if (!base || base.startsWith('#')) return base;
  const u = new URL(base);
  u.searchParams.set('text', `Hello Innovac, I'd like a quote for ${product}. Reference ${ref}.`);
  return u.href;
}

async function submit(form: HTMLFormElement, event: SubmitEvent) {
  event.preventDefault();
  const invalid = validate(form);
  showErrors(form, invalid);
  const first = (['product', 'name', 'phone', 'email', 'attachment'] as FieldName[]).find((k) => invalid[k]);
  if (first) {
    (form.elements.namedItem(first) as HTMLElement | null)?.focus();
    return;
  }

  const button = form.querySelector<HTMLButtonElement>('[data-submit]');
  const errorBox = form.querySelector<HTMLElement>('[data-form-error]');
  const fallback = form.querySelector<HTMLAnchorElement>('[data-whatsapp-fallback]');
  const select = form.elements.namedItem('product') as HTMLSelectElement;
  const productLabel = select.selectedOptions[0]?.textContent?.trim() ?? select.value;
  const ref = form.dataset.ref ?? (form.dataset.ref = makeReference());

  const data = new FormData(form);
  data.set('access_key', ACCESS_KEY);
  data.set('subject', `RFQ ${ref} · ${productLabel}`);
  data.set('from_name', 'innovacceramic.com');
  data.set('reference', ref);
  data.set('product', productLabel);
  data.set('page', location.href);
  if (!data.get('whatsapp_ok')) data.set('whatsapp_ok', 'No');
  const hasFiles = Boolean(form.querySelector<HTMLInputElement>('[data-file-input]')?.files?.length);
  if (!hasFiles) data.delete('attachment');

  if (button) {
    button.disabled = true;
    button.dataset.label = button.textContent ?? '';
    button.textContent = 'Sending…';
  }
  errorBox?.classList.add('hidden');

  try {
    if (!ACCESS_KEY) throw new Error('Web3Forms access key is not configured');
    const body = hasFiles ? data : JSON.stringify(Object.fromEntries(data.entries()));
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: hasFiles ? { Accept: 'application/json' } : { 'Content-Type': 'application/json', Accept: 'application/json' },
      body,
    });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean };
    if (!res.ok || !json.success) throw new Error(`Web3Forms responded ${res.status}`);
    (window as unknown as { innovacTrack?: (n: string) => void }).innovacTrack?.('rfq_submit');
    location.assign(`${form.dataset.thanks}?ref=${encodeURIComponent(ref)}`);
  } catch (err) {
    console.warn('RFQ send failed:', err);
    if (fallback) {
      const href = whatsappWithRef(form.dataset.whatsapp ?? '', ref, productLabel);
      fallback.hidden = !href;
      fallback.href = href || '#';
    }
    errorBox?.classList.remove('hidden');
    errorBox?.focus();
    if (button) {
      button.disabled = false;
      button.textContent = button.dataset.label || 'Request quote';
    }
  }
}

export function initRfqForms() {
  const wanted = new URLSearchParams(location.search).get('product');
  document.querySelectorAll<HTMLFormElement>('form[data-rfq-form]').forEach((form) => {
    const select = form.elements.namedItem('product') as HTMLSelectElement | null;
    if (wanted && select && Array.from(select.options).some((o) => o.value === wanted)) select.value = wanted;

    form.addEventListener('submit', (e) => submit(form, e as SubmitEvent));
    // Clear a field's error as soon as it is fixed.
    form.addEventListener('input', (e) => {
      const target = e.target as HTMLElement & { name?: string };
      if (target.getAttribute('aria-invalid') !== 'true' || !target.name) return;
      const invalid = validate(form);
      if (!invalid[target.name as FieldName]) showErrors(form, invalid);
    });
    const fileInput = form.querySelector<HTMLInputElement>('[data-file-input]');
    const summary = form.querySelector<HTMLElement>('[data-file-summary]');
    fileInput?.addEventListener('change', () => {
      if (summary && fileInput.files?.length) {
        summary.textContent = Array.from(fileInput.files, (f) => f.name).join(', ');
      }
    });
  });
}
