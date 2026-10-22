/**
 * Sending an enquiry. Phase 1: NOTHING IS SENT. This is the single seam where a real handler
 * (e.g. a Vercel function and an email service, with spam protection) plugs in later.
 *
 * Until then submitEnquiry() waits briefly and reports success. It does not read, log, store
 * or transmit the data in any way: no fetch, no beacon, no console, no localStorage.
 */
import type { EnquiryFields } from './validation';

export type EnquiryData = EnquiryFields;

export type EnquiryResult = { ok: true } | { ok: false; reason: 'failed' };

export interface SubmitOptions {
  /** Force the error state, for testing and future use (?enquiry=error on the page). */
  fail?: boolean;
  /** How long the pretend send takes, in milliseconds. */
  delay?: number;
}

/**
 * When true, the form shows a visible "Preview: this form isn't connected yet" note. Off at Jan's
 * request (2026-10-22), although enquiries still go nowhere until a real handler is wired in.
 */
export const IS_PREVIEW = false;

/** URL flag that triggers the error state: ?enquiry=error */
export function wantsErrorState(search: string): boolean {
  return new URLSearchParams(search).get('enquiry') === 'error';
}

export async function submitEnquiry(_data: EnquiryData, options: SubmitOptions = {}): Promise<EnquiryResult> {
  const { fail = false, delay = 1200 } = options;
  await new Promise((resolve) => setTimeout(resolve, delay));
  return fail ? { ok: false, reason: 'failed' } : { ok: true };
}
