import { describe, expect, it } from 'vitest';
import { estimate, eveningGuestLimit, formatGBP, type Choices } from '../src/lib/estimate';
import {
  DAYS,
  DRESSING_ROOM_NIGHT_BEFORE_PRICE,
  EVENING_GUEST_PRICE,
  EXTRA_DAY_GUEST_PRICE,
  GARDEN_CEREMONY_PRICE,
  INCLUDED_GUESTS,
  MAX_GUESTS,
  PRICING,
  SEASONS,
  type Day,
  type Season,
} from '../src/data/pricing';

/** Venue hire only: the included guests, nobody in the evening, no extras. */
const base = (season: Season, day: Day): Choices => ({
  season,
  day,
  dayGuests: INCLUDED_GUESTS,
  eveningGuests: 0,
  gardenCeremony: false,
  dressingRoom: false,
});

describe('venue hire: every season and day (client prices, 2026-10-27)', () => {
  const expected: Record<Season, Record<Day, number>> = {
    offPeak: { midweek: 4500, friSun: 6000, saturday: 8000 },
    shoulder: { midweek: 5500, friSun: 7500, saturday: 10000 },
    peak: { midweek: 6500, friSun: 9000, saturday: 12000 },
  };

  for (const season of SEASONS) {
    for (const day of DAYS) {
      it(`${season} / ${day}`, () => {
        const result = estimate(base(season, day));
        expect(result.venueHire).toBe(expected[season][day]);
        expect(result.total).toBe(expected[season][day]);
      });
    }
  }

  it('covers all nine combinations', () => {
    expect(SEASONS.length * DAYS.length).toBe(9);
  });
});

describe('day guests', () => {
  it(`includes ${INCLUDED_GUESTS} guests in the venue hire`, () => {
    const result = estimate(base('peak', 'saturday'));
    expect(result.dayGuests).toBe(INCLUDED_GUESTS);
    expect(result.extraDayGuests).toEqual({ count: 0, unit: EXTRA_DAY_GUEST_PRICE, total: 0 });
  });

  it('charges each guest beyond the included number', () => {
    for (const [guests, extra] of [
      [51, 1],
      [75, 25],
      [100, 50],
    ]) {
      const result = estimate({ ...base('shoulder', 'midweek'), dayGuests: guests });
      expect(result.extraDayGuests.count, `${guests} guests`).toBe(extra);
      expect(result.extraDayGuests.total).toBe(extra * EXTRA_DAY_GUEST_PRICE);
      expect(result.total).toBe(5500 + extra * EXTRA_DAY_GUEST_PRICE);
    }
  });

  it(`keeps the number between ${INCLUDED_GUESTS} and ${MAX_GUESTS}`, () => {
    expect(estimate({ ...base('peak', 'saturday'), dayGuests: 20 }).dayGuests).toBe(INCLUDED_GUESTS);
    expect(estimate({ ...base('peak', 'saturday'), dayGuests: 140 }).dayGuests).toBe(MAX_GUESTS);
    expect(estimate({ ...base('peak', 'saturday'), dayGuests: 140 }).extraDayGuests.count).toBe(MAX_GUESTS - INCLUDED_GUESTS);
  });

  it('treats fractions and nonsense sensibly', () => {
    expect(estimate({ ...base('peak', 'saturday'), dayGuests: 60.6 }).dayGuests).toBe(61);
    expect(estimate({ ...base('peak', 'saturday'), dayGuests: Number.NaN }).dayGuests).toBe(INCLUDED_GUESTS);
  });
});

describe('evening guests', () => {
  it('charges each evening guest', () => {
    for (const count of [0, 1, 20, 50]) {
      const result = estimate({ ...base('offPeak', 'friSun'), eveningGuests: count });
      expect(result.eveningGuests).toEqual({ count, unit: EVENING_GUEST_PRICE, total: count * EVENING_GUEST_PRICE });
      expect(result.total).toBe(6000 + count * EVENING_GUEST_PRICE);
    }
  });

  it('never goes below 0', () => {
    expect(estimate({ ...base('peak', 'saturday'), eveningGuests: -5 }).eveningGuests.count).toBe(0);
  });
});

describe(`day and evening guests together: no more than ${MAX_GUESTS} (client, 2026-10-27)`, () => {
  it('leaves room for whatever the day guests have not used', () => {
    expect(eveningGuestLimit(INCLUDED_GUESTS)).toBe(MAX_GUESTS - INCLUDED_GUESTS);
    expect(eveningGuestLimit(80)).toBe(MAX_GUESTS - 80);
    expect(eveningGuestLimit(MAX_GUESTS)).toBe(0);
  });

  it('works from the day guests as the estimate counts them', () => {
    expect(eveningGuestLimit(20)).toBe(MAX_GUESTS - INCLUDED_GUESTS);
    expect(eveningGuestLimit(140)).toBe(0);
    expect(eveningGuestLimit(Number.NaN)).toBe(MAX_GUESTS - INCLUDED_GUESTS);
  });

  it('trims evening guests so the total never passes the limit', () => {
    for (const [day, evening, kept] of [
      [50, 250, 50],
      [80, 30, 20],
      [100, 20, 0],
      [70, 30, 30],
    ]) {
      const result = estimate({ ...base('peak', 'saturday'), dayGuests: day, eveningGuests: evening });
      expect(result.eveningGuests.count, `${day} + ${evening}`).toBe(kept);
      expect(result.dayGuests + result.eveningGuests.count).toBeLessThanOrEqual(MAX_GUESTS);
    }
  });

  it('keeps the day guests as chosen and trims the evening', () => {
    expect(estimate({ ...base('peak', 'saturday'), dayGuests: 90, eveningGuests: 40 }).dayGuests).toBe(90);
  });
});

describe('extras', () => {
  it('adds the garden ceremony', () => {
    const result = estimate({ ...base('peak', 'midweek'), gardenCeremony: true });
    expect(result.gardenCeremony).toBe(GARDEN_CEREMONY_PRICE);
    expect(result.total).toBe(6500 + GARDEN_CEREMONY_PRICE);
  });

  it('adds the dressing room the night before', () => {
    const result = estimate({ ...base('peak', 'midweek'), dressingRoom: true });
    expect(result.dressingRoom).toBe(DRESSING_ROOM_NIGHT_BEFORE_PRICE);
    expect(result.total).toBe(6500 + DRESSING_ROOM_NIGHT_BEFORE_PRICE);
  });

  it('adds nothing when not chosen', () => {
    const result = estimate(base('peak', 'midweek'));
    expect(result.gardenCeremony).toBe(0);
    expect(result.dressingRoom).toBe(0);
  });
});

describe('a full wedding', () => {
  it('peak Saturday, 80 day guests, 20 evening guests and both extras comes to £16,900', () => {
    const result = estimate({ season: 'peak', day: 'saturday', dayGuests: 80, eveningGuests: 20, gardenCeremony: true, dressingRoom: true });
    // 12,000 venue + 30 × 95 + 20 × 45 + 750 + 400
    expect(result.total).toBe(16900);
  });

  it('totals exactly, without rounding', () => {
    expect(estimate({ ...base('offPeak', 'midweek'), dayGuests: 53, eveningGuests: 1 }).total).toBe(4500 + 3 * 95 + 45);
  });

  it('uses whatever pricing it is passed, so new prices drop straight in', () => {
    const result = estimate({ ...base('peak', 'saturday'), dayGuests: 60 }, { ...PRICING, extraDayGuestPrice: 100 });
    expect(result.total).toBe(12000 + 10 * 100);
  });
});

describe('formatGBP', () => {
  it('formats whole pounds in en-GB style, without pence', () => {
    expect(formatGBP(18800)).toBe('£18,800');
    expect(formatGBP(95)).toBe('£95');
  });
});
