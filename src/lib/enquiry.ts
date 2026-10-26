/**
 * Sending a lead from the pricing tool. Phase 1: NOTHING IS SENT. This is the single seam where a
 * real handler (e.g. a Vercel function and an email service, with spam protection) plugs in later.
 *
 * Until then submitEnquiry() waits briefly and reports success. It does not read, log, store or
 * transmit the data in any way: no fetch, no beacon, no console, no localStorage.
 */
import type { Choices } from './estimate';
import type { LeadFields } from './validation';

/** What the venue receives: who's asking, everything they chose, and the total they saw. */
export interface LeadData extends LeadFields {
  choices: Choices;
  total: number;
}

export type EnquiryResult = { ok: true } | { ok: false; reason: 'failed' };

export interface SubmitOptions {
  /** Force the error state, for testing and future use (?enquiry=error on the page). */
  fail?: boolean;
  /** How long the pretend send takes, in milliseconds. */
  delay?: number;
}

/** URL flag that triggers the error state: ?enquiry=error */
export function wantsErrorState(search: string): boolean {
  return new URLSearchParams(search).get('enquiry') === 'error';
}

export async function submitEnquiry(_data: LeadData, options: SubmitOptions = {}): Promise<EnquiryResult> {
  const { fail = false, delay = 1200 } = options;
  await new Promise((resolve) => setTimeout(resolve, delay));
  return fail ? { ok: false, reason: 'failed' } : { ok: true };
}
