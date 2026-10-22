import { describe, expect, it } from 'vitest';
import {
  estimate,
  formatGBP,
  roundToNearest,
  selectionFromDate,
  selectionFromSearch,
  selectionToSearch,
} from '../src/lib/estimate';
import { DAYS, GUEST_COUNT, PRICING, SEASONS, type Day, type Pricing, type Season } from '../src/data/pricing';

describe('estimate: every season and day (placeholder pricing)', () => {
  // Venue hire from CLAUDE.md plus catering at £95 × 100 guests (£9,500).
  const expected: Record<Season, Record<Day, number>> = {
    peak: { saturday: 19000, friSun: 17500, midweek: 15500 },
    shoulder: { saturday: 17500, friSun: 16250, midweek: 14500 },
    offPeak: { saturday: 16000, friSun: 15000, midweek: 13500 },
  };

  for (const season of SEASONS) {
    for (const day of DAYS) {
      it(`${season} / ${day}`, () => {
        const result = estimate(season, day);
        expect(result.venueHire).toBe(PRICING.venueHire[season][day]);
        expect(result.catering).toBe(9500);
        expect(result.total).toBe(expected[season][day]);
      });
    }
  }

  it('covers all nine combinations', () => {
    expect(SEASONS.length * DAYS.length).toBe(9);
  });
});

describe('estimate: breakdown', () => {
  it('prices catering for the fixed guest count', () => {
    const result = estimate('peak', 'saturday');
    expect(result.guests).toBe(GUEST_COUNT);
    expect(result.cateringPerGuest).toBe(PRICING.cateringPerGuest);
    expect(result.catering).toBe(PRICING.cateringPerGuest * GUEST_COUNT);
  });

  it('echoes the selection it was given', () => {
    const result = estimate('shoulder', 'midweek');
    expect(result.season).toBe('shoulder');
    expect(result.day).toBe('midweek');
  });

  it('uses whatever pricing it is passed, so real prices drop straight in', () => {
    const custom: Pricing = { ...PRICING, guestCount: 80, cateringPerGuest: 110 };
    const result = estimate('offPeak', 'midweek', custom);
    expect(result.guests).toBe(80);
    expect(result.catering).toBe(8800);
    expect(result.total).toBe(roundToNearest(4000 + 8800, PRICING.roundTo));
  });
});

describe('estimate: rounding to the nearest £250', () => {
  // £97 a head makes catering £9,700, so the total is no longer a round number.
  const odd: Pricing = { ...PRICING, cateringPerGuest: 97 };

  it('rounds the total, not the breakdown', () => {
    const result = estimate('peak', 'saturday', odd);
    expect(result.catering).toBe(9700);
    expect(result.total).toBe(19250); // 9,500 + 9,700 = 19,200 → 19,250
  });

  it('rounds down below the halfway point', () => {
    const result = estimate('offPeak', 'midweek', { ...PRICING, cateringPerGuest: 96.2 }); // 4,000 + 9,620 = 13,620
    expect(result.total).toBe(13500);
  });

  it('rounds up from the halfway point', () => {
    const result = estimate('offPeak', 'midweek', { ...PRICING, cateringPerGuest: 96.25 }); // 4,000 + 9,625 = 13,625
    expect(result.total).toBe(13750);
  });

  it('honours a different rounding step', () => {
    const result = estimate('peak', 'saturday', { ...odd, roundTo: 1000 });
    expect(result.total).toBe(19000);
  });
});

describe('roundToNearest', () => {
  it('leaves exact multiples alone', () => {
    expect(roundToNearest(17500, 250)).toBe(17500);
  });

  it('rounds to the nearest step, halves up', () => {
    expect(roundToNearest(19124, 250)).toBe(19000);
    expect(roundToNearest(19125, 250)).toBe(19250);
    expect(roundToNearest(19126, 250)).toBe(19250);
  });

  it('handles zero', () => {
    expect(roundToNearest(0, 250)).toBe(0);
  });
});

describe('formatGBP', () => {
  it('formats whole pounds in en-GB style, without pence', () => {
    expect(formatGBP(19000)).toBe('£19,000');
    expect(formatGBP(95)).toBe('£95');
  });
});

describe('selection handed to the enquiry form', () => {
  it('round-trips through the query string', () => {
    const search = selectionToSearch({ season: 'shoulder', day: 'friSun' });
    expect(selectionFromSearch(search)).toEqual({ season: 'shoulder', day: 'friSun' });
  });

  it('ignores unknown or missing values', () => {
    expect(selectionFromSearch('?season=winter&day=saturday')).toBeNull();
    expect(selectionFromSearch('?season=peak')).toBeNull();
    expect(selectionFromSearch('')).toBeNull();
  });

  it('keeps other query parameters', () => {
    const search = selectionToSearch({ season: 'peak', day: 'midweek' }, '?enquiry=error');
    const params = new URLSearchParams(search);
    expect(params.get('enquiry')).toBe('error');
    expect(params.get('season')).toBe('peak');
    expect(params.get('day')).toBe('midweek');
  });
});

describe('selectionFromDate (preferred date fills in season and day)', () => {
  it('maps every month to its season', () => {
    const seasons = Array.from({ length: 12 }, (_, i) => selectionFromDate(`2027-${String(i + 1).padStart(2, '0')}-15`)?.season);
    expect(seasons).toEqual([
      'offPeak', 'offPeak', 'offPeak', 'shoulder', 'peak', 'peak', 'peak', 'peak', 'peak', 'shoulder', 'offPeak', 'offPeak',
    ]);
  });

  it('maps every day of the week to its pricing day', () => {
    // 7–13 June 2027 runs Monday to Sunday.
    const days = ['07', '08', '09', '10', '11', '12', '13'].map((d) => selectionFromDate(`2027-06-${d}`)?.day);
    expect(days).toEqual(['midweek', 'midweek', 'midweek', 'midweek', 'friSun', 'saturday', 'friSun']);
  });

  it('handles season boundaries', () => {
    expect(selectionFromDate('2027-04-30')).toEqual({ season: 'shoulder', day: 'friSun' });
    expect(selectionFromDate('2027-05-01')).toEqual({ season: 'peak', day: 'saturday' });
    expect(selectionFromDate('2027-10-31')).toEqual({ season: 'shoulder', day: 'friSun' });
    expect(selectionFromDate('2027-11-01')).toEqual({ season: 'offPeak', day: 'midweek' });
  });

  it('ignores empty or malformed dates', () => {
    expect(selectionFromDate('')).toBeNull();
    expect(selectionFromDate('12/06/2027')).toBeNull();
    expect(selectionFromDate('2027-13-01')).toBeNull();
    expect(selectionFromDate('2027-02-30')).toBeNull();
  });
});
