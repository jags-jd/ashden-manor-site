/**
 * Pricing data. Every number used by the estimator, copy and form lives here, and nowhere else.
 *
 * THESE ARE PLACEHOLDER FIGURES, not the client's prices (see CLAUDE.md, Open Questions 1 and 8).
 * While IS_PLACEHOLDER is true the estimator shows an "Illustrative figures" note.
 */

/** Every wedding is for this many guests through the day. Use this constant, never a typed number. */
export const GUEST_COUNT = 100;

/** True until the client confirms real prices. Never ship to the live domain while true without Jan's OK. */
export const IS_PLACEHOLDER = true;

export const SEASONS = ['peak', 'shoulder', 'offPeak'] as const;
export type Season = (typeof SEASONS)[number];

export const DAYS = ['saturday', 'friSun', 'midweek'] as const;
export type Day = (typeof DAYS)[number];

/** Season for each month, January first: peak May–Sep, shoulder Apr and Oct, off-peak Nov–Mar. */
export const SEASON_BY_MONTH: readonly Season[] = [
  'offPeak', 'offPeak', 'offPeak', // Jan, Feb, Mar
  'shoulder', // Apr
  'peak', 'peak', 'peak', 'peak', 'peak', // May–Sep
  'shoulder', // Oct
  'offPeak', 'offPeak', // Nov, Dec
];

/** Pricing day for each day of the week, Sunday first (as Date.getDay()). */
export const DAY_BY_WEEKDAY: readonly Day[] = [
  'friSun', // Sunday
  'midweek', 'midweek', 'midweek', 'midweek', // Monday–Thursday
  'friSun', // Friday
  'saturday', // Saturday
];

/** Venue hire in pounds, by season and day. */
export type VenueHireTable = Record<Season, Record<Day, number>>;

export const VENUE_HIRE: VenueHireTable = {
  peak: { saturday: 9500, friSun: 8000, midweek: 6000 },
  shoulder: { saturday: 8000, friSun: 6750, midweek: 5000 },
  offPeak: { saturday: 6500, friSun: 5500, midweek: 4000 },
};

/** In-house catering, in pounds per guest. */
export const CATERING_PER_GUEST = 95;

/** Estimated totals are rounded to the nearest this many pounds. */
export const ROUND_TO = 250;

export interface Pricing {
  guestCount: number;
  venueHire: VenueHireTable;
  cateringPerGuest: number;
  roundTo: number;
}

/** Everything the estimate needs, in one object (tests can pass their own). */
export const PRICING: Pricing = {
  guestCount: GUEST_COUNT,
  venueHire: VENUE_HIRE,
  cateringPerGuest: CATERING_PER_GUEST,
  roundTo: ROUND_TO,
};

/** The selection shown before a couple chooses anything: the most asked-about combination. */
export const DEFAULT_SEASON: Season = 'peak';
export const DEFAULT_DAY: Day = 'saturday';
