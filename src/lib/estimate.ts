/**
 * The price estimate: pure functions, no DOM, so they're easy to test and reuse.
 * All figures come from src/data/pricing.ts.
 */
import { DAY_BY_WEEKDAY, DAYS, PRICING, SEASON_BY_MONTH, SEASONS, type Day, type Pricing, type Season } from '../data/pricing';

export interface Estimate {
  season: Season;
  day: Day;
  guests: number;
  venueHire: number;
  cateringPerGuest: number;
  catering: number;
  /** Venue hire plus catering, rounded to the nearest `pricing.roundTo`. */
  total: number;
}

export interface Selection {
  season: Season;
  day: Day;
}

/** Round to the nearest multiple of `step`; exact halves round up. */
export function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function estimate(season: Season, day: Day, pricing: Pricing = PRICING): Estimate {
  const venueHire = pricing.venueHire[season][day];
  const catering = pricing.cateringPerGuest * pricing.guestCount;
  return {
    season,
    day,
    guests: pricing.guestCount,
    venueHire,
    cateringPerGuest: pricing.cateringPerGuest,
    catering,
    total: roundToNearest(venueHire + catering, pricing.roundTo),
  };
}

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Whole pounds, e.g. "£19,000". */
export function formatGBP(amount: number): string {
  return gbp.format(amount);
}

export function isSeason(value: unknown): value is Season {
  return SEASONS.includes(value as Season);
}

export function isDay(value: unknown): value is Day {
  return DAYS.includes(value as Day);
}

/*
 * Hand-off to the enquiry form: the estimator writes the couple's choice into the URL
 * (?season=…&day=…) and the form reads it back to prefill its season and day fields.
 */

/** Read a season and day from a query string; null unless both are valid. */
export function selectionFromSearch(search: string): Selection | null {
  const params = new URLSearchParams(search);
  const season = params.get('season');
  const day = params.get('day');
  return isSeason(season) && isDay(day) ? { season, day } : null;
}

/** Add (or replace) the season and day in a query string, keeping any other parameters. */
export function selectionToSearch(selection: Selection, search = ''): string {
  const params = new URLSearchParams(search);
  params.set('season', selection.season);
  params.set('day', selection.day);
  return `?${params.toString()}`;
}

/**
 * The season and pricing day a calendar date falls in, from a yyyy-mm-dd string (as given by
 * <input type="date">). Null for anything that isn't a real date. Worked out in UTC, so the
 * visitor's time zone can't shift the day of the week.
 */
export function selectionFromDate(iso: string): Selection | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Rejects impossible dates such as 30 February, which Date would otherwise roll over.
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { season: SEASON_BY_MONTH[month - 1], day: DAY_BY_WEEKDAY[date.getUTCDay()] };
}
