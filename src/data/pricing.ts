/**
 * Pricing data. Every number used by the estimator, copy and form lives here, and nowhere else.
 * These are the client's prices (received 2026-10-27).
 */

/** True while the figures are placeholders; the estimator then shows an "Illustrative figures" note. */
export const IS_PLACEHOLDER = false;

/** Venue hire includes this many guests. */
export const INCLUDED_GUESTS = 50;
/** Most guests a wedding can have, day and evening guests together (client, 2026-10-27). Use this constant, never a typed number. */
export const MAX_GUESTS = 100;
/** Each day guest beyond the included number, in pounds. */
export const EXTRA_DAY_GUEST_PRICE = 95;

/** Evening guests join from 8pm, in pounds each. */
export const EVENING_GUEST_PRICE = 45;

/** Optional extras, in pounds. */
export const GARDEN_CEREMONY_PRICE = 750;
export const DRESSING_ROOM_NIGHT_BEFORE_PRICE = 400;

export const SEASONS = ['peak', 'shoulder', 'offPeak'] as const;
export type Season = (typeof SEASONS)[number];

export const DAYS = ['saturday', 'friSun', 'midweek'] as const;
export type Day = (typeof DAYS)[number];

/** Venue hire for a full day's exclusive use, in pounds, by season and day. Includes INCLUDED_GUESTS guests. */
export type VenueHireTable = Record<Season, Record<Day, number>>;

export const VENUE_HIRE: VenueHireTable = {
  peak: { saturday: 12000, friSun: 9000, midweek: 6500 },
  shoulder: { saturday: 10000, friSun: 7500, midweek: 5500 },
  offPeak: { saturday: 8000, friSun: 6000, midweek: 4500 },
};

export interface Pricing {
  venueHire: VenueHireTable;
  includedGuests: number;
  maxGuests: number;
  extraDayGuestPrice: number;
  eveningGuestPrice: number;
  gardenCeremonyPrice: number;
  dressingRoomPrice: number;
}

/** Everything the estimate needs, in one object (tests can pass their own). */
export const PRICING: Pricing = {
  venueHire: VENUE_HIRE,
  includedGuests: INCLUDED_GUESTS,
  maxGuests: MAX_GUESTS,
  extraDayGuestPrice: EXTRA_DAY_GUEST_PRICE,
  eveningGuestPrice: EVENING_GUEST_PRICE,
  gardenCeremonyPrice: GARDEN_CEREMONY_PRICE,
  dressingRoomPrice: DRESSING_ROOM_NIGHT_BEFORE_PRICE,
};

/** What the estimator shows before a couple chooses anything: the venue hire on its own. */
export const DEFAULT_SEASON: Season = 'peak';
export const DEFAULT_DAY: Day = 'saturday';
export const DEFAULT_DAY_GUESTS = INCLUDED_GUESTS;
export const DEFAULT_EVENING_GUESTS = 0;
