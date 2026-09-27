import { site, SHOW_TODOS } from '../data/site';

export const DEFAULT_WHATSAPP_TEXT = "Hello Innovac, I'd like a quote.";

export function whatsappText(productName?: string): string {
  return productName
    ? `Hello Innovac, I'd like a quote for ${productName}.`
    : DEFAULT_WHATSAPP_TEXT;
}

/**
 * wa.me link for the configured number. Until the number is supplied it returns a harmless
 * placeholder on the preview (so the layout can be reviewed) and `null` in the launch build, where
 * callers hide the WhatsApp action.
 */
export function whatsappHref(text: string = DEFAULT_WHATSAPP_TEXT): string | null {
  if (site.whatsappE164) {
    const number = site.whatsappE164.replace(/\D/g, '');
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }
  return SHOW_TODOS ? '#todo-whatsapp-number' : null;
}
