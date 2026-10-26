import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { submitEnquiry, wantsErrorState, type LeadData } from '../src/lib/enquiry';

const lead: LeadData = {
  names: 'Sam & Alex',
  email: 'sam@example.com',
  choices: { season: 'peak', day: 'saturday', dayGuests: 80, eveningGuests: 20, gardenCeremony: true, dressingRoom: true },
  total: 16900,
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
    const pending = submitEnquiry(lead).then((result) => {
      settled = true;
      return result;
    });
    await vi.advanceTimersByTimeAsync(1000);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(300);
    await expect(pending).resolves.toEqual({ ok: true });
  });

  it('can be made to fail, for the error state', async () => {
    const pending = submitEnquiry(lead, { fail: true });
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

    const before = structuredClone(lead);
    const pending = submitEnquiry(lead);
    await vi.runAllTimersAsync();
    await pending;

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(beacon).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
    for (const spy of consoleSpies) expect(spy).not.toHaveBeenCalled();
    expect(lead).toEqual(before);
  });
});

describe('wantsErrorState', () => {
  it('is on only with ?enquiry=error', () => {
    expect(wantsErrorState('?enquiry=error')).toBe(true);
    expect(wantsErrorState('?enquiry=error&other=1')).toBe(true);
    expect(wantsErrorState('')).toBe(false);
    expect(wantsErrorState('?enquiry=ok')).toBe(false);
  });
});
