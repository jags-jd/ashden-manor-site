import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { submitEnquiry, wantsErrorState, type EnquiryData } from '../src/lib/enquiry';

const data: EnquiryData = {
  names: 'Sam & Alex',
  email: 'sam@example.com',
  phone: '01632 960 482',
  date: '2027-06-12',
  flexible: true,
  season: 'peak',
  day: 'saturday',
  message: 'A June wedding, please.',
};

describe('submitEnquiry (phase 1 stub)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('waits, then reports success', async () => {
    let settled = false;
    const pending = submitEnquiry(data).then((result) => {
      settled = true;
      return result;
    });
    await vi.advanceTimersByTimeAsync(1000);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(300);
    await expect(pending).resolves.toEqual({ ok: true });
  });

  it('can be made to fail, for the error state', async () => {
    const pending = submitEnquiry(data, { fail: true });
    await vi.runAllTimersAsync();
    await expect(pending).resolves.toEqual({ ok: false, reason: 'failed' });
  });

  it('sends, logs and stores nothing', async () => {
    const fetchSpy = vi.fn();
    const beacon = vi.fn();
    const storage = { setItem: vi.fn(), getItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn(), key: vi.fn(), length: 0 };
    vi.stubGlobal('fetch', fetchSpy);
    vi.stubGlobal('navigator', { sendBeacon: beacon });
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('sessionStorage', storage);
    const consoleSpies = (['log', 'info', 'debug', 'warn', 'error', 'table', 'dir'] as const).map((method) =>
      vi.spyOn(console, method).mockImplementation(() => undefined),
    );

    const before = structuredClone(data);
    const pending = submitEnquiry(data);
    await vi.runAllTimersAsync();
    await pending;

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(beacon).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
    for (const spy of consoleSpies) expect(spy).not.toHaveBeenCalled();
    expect(data).toEqual(before);
  });
});

describe('wantsErrorState', () => {
  it('is on only with ?enquiry=error', () => {
    expect(wantsErrorState('?enquiry=error')).toBe(true);
    expect(wantsErrorState('?season=peak&enquiry=error')).toBe(true);
    expect(wantsErrorState('')).toBe(false);
    expect(wantsErrorState('?enquiry=ok')).toBe(false);
  });
});
