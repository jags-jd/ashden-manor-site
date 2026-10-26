/**
 * The price estimate: pure functions, no DOM, so they're easy to test and reuse.
 * All figures come from src/data/pricing.ts. Totals are exact (real prices, no rounding).
 */
import { DAYS, PRICING, SEASONS, type Day, type Pricing, type Season } from '../data/pricing';

/** A season and pricing day. */
export interface Selection {
  season: Season;
  day: Day;
}

/** Everything a couple can choose in the estimator. */
export interface Choices extends Selection {
  dayGuests: number;
  eveningGuests: number;
  gardenCeremony: boolean;
  dressingRoom: boolean;
}

export interface Line {
  count: number;
  unit: number;
  total: number;
}

export interface Estimate {
  season: Season;
  day: Day;
  /** Day guests after keeping them within range. */
  dayGuests: number;
  /** Venue hire, which includes `pricing.includedGuests` guests. */
  venueHire: number;
  extraDayGuests: Line;
  eveningGuests: Line;
  /** The price of each extra, or 0 when it isn't chosen. */
  gardenCeremony: number;
  dressingRoom: number;
  /** Everything added up, exactly. */
  total: number;
}

/** A whole number between min and max; anything that isn't a number becomes `fallback`. */
export function clampCount(value: number, min: number, max: number, fallback = min): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(Math.round(value), min), max);
}

/** Most evening guests that still fit: day and evening guests together never pass `maxGuests`. */
export function eveningGuestLimit(dayGuests: number, pricing: Pricing = PRICING): number {
  return pricing.maxGuests - clampCount(dayGuests, pricing.includedGuests, pricing.maxGuests);
}

export function estimate(choices: Choices, pricing: Pricing = PRICING): Estimate {
  const dayGuests = clampCount(choices.dayGuests, pricing.includedGuests, pricing.maxGuests);
  // Day guests come first; evening guests are trimmed to whatever room is left.
  const evening = clampCount(choices.eveningGuests, 0, eveningGuestLimit(dayGuests, pricing));
  const venueHire = pricing.venueHire[choices.season][choices.day];
  const extraCount = dayGuests - pricing.includedGuests;

  const extraDayGuests = { count: extraCount, unit: pricing.extraDayGuestPrice, total: extraCount * pricing.extraDayGuestPrice };
  const eveningGuests = { count: evening, unit: pricing.eveningGuestPrice, total: evening * pricing.eveningGuestPrice };
  const gardenCeremony = choices.gardenCeremony ? pricing.gardenCeremonyPrice : 0;
  const dressingRoom = choices.dressingRoom ? pricing.dressingRoomPrice : 0;

  return {
    season: choices.season,
    day: choices.day,
    dayGuests,
    venueHire,
    extraDayGuests,
    eveningGuests,
    gardenCeremony,
    dressingRoom,
    total: venueHire + extraDayGuests.total + eveningGuests.total + gardenCeremony + dressingRoom,
  };
}

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Whole pounds, e.g. "£18,800". */
export function formatGBP(amount: number): string {
  return gbp.format(amount);
}

export function isSeason(value: unknown): value is Season {
  return SEASONS.includes(value as Season);
}

export function isDay(value: unknown): value is Day {
  return DAYS.includes(value as Day);
}
