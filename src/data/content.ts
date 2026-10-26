/**
 * All page copy lives here so it can be edited without touching components.
 * Facts we don't have yet are left out (Jan, 2026-10-22: no [TBC] placeholders on the page) and
 * listed under Open Questions in CLAUDE.md. Never fill a gap with an invented fact.
 *
 * Style (2026-10-22 redesign): image-led and restrained. Each section has one headline and a
 * short paragraph; detail lives in the FAQ. Calm and confident, never salesy.
 */
import { formatGBP } from '../lib/estimate';
import {
  DRESSING_ROOM_NIGHT_BEFORE_PRICE,
  EVENING_GUEST_PRICE,
  EXTRA_DAY_GUEST_PRICE,
  GARDEN_CEREMONY_PRICE,
  INCLUDED_GUESTS,
  MAX_GUESTS,
} from './pricing';

export const site = {
  name: 'Ashden Manor',
  title: 'Ashden Manor | Exclusive-use weddings in a Georgian manor',
  description: `A Georgian manor in the English countryside, yours alone for the day. Weddings for up to ${MAX_GUESTS} guests with in-house catering, from ceremony to evening party.`,
  locale: 'en_GB',
  ogImage: '/og-image.jpg',
  ogImageAlt: 'The Ashden Manor crest with the AM monogram, on warm linen',
} as const;

export interface Section {
  /** Anchor id, used in the URL fragment. */
  id: string;
  /** Short label for the menu, section labels and the progress counter. */
  label: string;
  /** Whether the section appears in the menu. */
  inNav: boolean;
}

/** Page sections in order. The menu and the 01, 02, 03 markers are built from this list. The enquiry lives inside Prices (#enquire is its last step). */
export const sections: readonly Section[] = [
  { id: 'top', label: 'Welcome', inNav: false },
  { id: 'exclusive-use', label: 'The manor', inNav: true },
  { id: 'spaces', label: 'The spaces', inNav: true },
  { id: 'food', label: 'The food', inNav: true },
  { id: 'why-100', label: `Why ${MAX_GUESTS}`, inNav: true },
  { id: 'your-day', label: 'Your day', inNav: true },
  { id: 'pets', label: 'Pets welcome', inNav: true },
  { id: 'not-a-hotel', label: 'Not a hotel', inNav: true },
  { id: 'estimate', label: 'Prices', inNav: true },
  { id: 'faq', label: 'Questions', inNav: true },
];

/** Two-digit marker for a section, counting from the first section after the hero: '01', '02', ... */
export function sectionNumber(id: string): string {
  const index = sections.findIndex((s) => s.id === id);
  return String(Math.max(index, 0)).padStart(2, '0');
}

export const header = {
  skipLink: 'Skip to content',
  homeLabel: 'Ashden Manor, back to the top',
  menuOpen: 'Menu',
  menuClose: 'Close',
  menuLabel: 'Site menu',
  /** The header's button goes to the price estimator. "Prices", not "quote": the figures are a guide. */
  cta: { label: 'See prices', href: '#estimate' },
  enquireHref: '#enquire',
  menuNote: 'Exclusive-use weddings in a Georgian manor.',
} as const;

export const preloader = {
  label: 'Loading Ashden Manor',
} as const;

// ---------------------------------------------------------------------------
// Section copy
// ---------------------------------------------------------------------------

export const hero = {
  logoAlt: 'Ashden Manor, established 2026',
  heading: 'The whole manor, for your whole day',
  lede: `A Georgian house in the English countryside, yours alone for up to ${MAX_GUESTS} guests, from the ceremony to the last dance.`,
  primaryCta: { label: 'See your estimate', href: '#estimate' },
  secondaryCta: { label: 'Explore the manor', href: '#exclusive-use' },
} as const;

export const exclusiveUse = {
  label: 'Exclusive use',
  heading: 'Nobody else checks in',
  body: 'Book Ashden Manor and you book all of it: the house, the gardens and the Georgian dining room. The only people here are the ones you invited.',
  points: [
    { title: 'No other weddings', body: 'One wedding that day, and it is yours.' },
    { title: 'No strangers', body: 'Nobody wandering through your photographs.' },
    { title: 'Room to get ready', body: 'A private dressing room for the morning.' },
  ],
  cta: { label: 'Explore the spaces', href: '#spaces' },
} as const;

export const spaces = {
  label: 'The spaces',
  heading: 'A room for every part of the day',
  body: 'The day moves from room to room, never from venue to venue.',
  tabsLabel: 'Spaces at Ashden Manor',
  items: [
    {
      id: 'ceremony-room',
      photo: 'panelledRoom',
      title: 'The ceremony room',
      body: 'An indoor room for your vows, so the weather never gets a vote.',
    },
    {
      id: 'dining-room',
      photo: 'candlelitToast',
      title: 'The dining room',
      body: 'Dinner in the Georgian dining room of a real house, not a function suite.',
    },
    {
      id: 'gardens',
      photo: 'gardenStaircase',
      title: 'The gardens',
      body: 'Manicured gardens for wandering and photographs between the ceremony and dinner.',
    },
    {
      id: 'dressing-room',
      photo: 'gettingReady',
      title: 'Your dressing room',
      body: 'A private room to get ready in, with only the people you want around you.',
    },
  ],
} as const;

export const food = {
  label: 'The food',
  heading: 'Cooked here, for you',
  body: 'Catering is in-house, and it is the centrepiece of the day rather than an afterthought. One team looks after the food from the first course to the evening party.',
  photos: ['crostini', 'hamCarving', 'canapes'],
  cta: { label: 'Ask about menus', href: '#enquire' },
} as const;

export const why100 = {
  label: `Why ${MAX_GUESTS}`,
  count: MAX_GUESTS,
  countLabel: 'guests',
  heading: 'Every one of them matters',
  body: `Weddings here are for up to ${MAX_GUESTS} guests. It isn't a limit we apologise for. It's the point.`,
  points: [
    { title: 'Time for everyone', body: 'You talk to every guest, not just wave across a room.' },
    { title: 'Nobody gets lost', body: 'No table at the back. Everyone is close to the speeches and to you.' },
    { title: 'A list worth writing', body: 'Everyone on it is someone you would miss.' },
  ],
} as const;

export const yourDay = {
  label: 'Your day',
  heading: 'From the ceremony to the last dance',
  body: 'Weddings here run the full day, all in one place. No packing up mid-afternoon.',
  steps: [
    {
      photo: 'ornateHall',
      title: 'The ceremony',
      body: 'Your vows in the ceremony room, with everyone you love in the same room.',
    },
    {
      photo: 'champagneFountain',
      title: 'Into the gardens',
      body: 'Time with your guests in the gardens while the dining room is made ready.',
    },
    {
      photo: 'sharingFeast',
      title: 'Dinner',
      body: 'Dinner from the in-house kitchen, served in the Georgian dining room.',
    },
    {
      photo: 'eveningDancing',
      title: 'The evening party',
      body: 'Same house, same guests, louder music.',
    },
  ],
  stepsLabel: 'Your day, step by step',
  cta: { label: 'See your estimate', href: '#estimate' },
} as const;

export const pets = {
  label: 'Pets welcome',
  heading: 'Four-legged guests welcome',
  body: 'Ashden Manor is pet-friendly. If your dog is part of the family, they can be part of the day. Ring-bearer duties optional.',
} as const;

export const notAHotel = {
  label: 'Not a hotel wedding',
  heading: 'A house, not a function suite',
  body: "Hotels do plenty of things well. Making a wedding feel like yours isn't always one of them.",
  columns: { topic: 'Compared', us: 'Ashden Manor', them: 'A typical hotel wedding', themShort: 'At a hotel' },
  rows: [
    { topic: 'Who else is there', us: 'Only the people you invited', them: 'Other guests, and sometimes another wedding' },
    { topic: 'The rooms', us: 'A Georgian house with its own character', them: 'Function rooms designed to suit any event' },
    { topic: 'The food', us: 'Cooked in-house, at the heart of the day', them: 'Often a set banqueting menu' },
    { topic: 'The day', us: 'Ceremony to evening party, all in one place', them: 'Shared spaces and other bookings to work around' },
  ],
  closing: 'Privacy, personality and food that matters.',
} as const;

/**
 * The pricing tool, which is also the enquiry: five numbered steps with an itemised total that
 * updates as you go, ending with names and email so the venue gets a lead.
 */
export const estimate = {
  label: 'Prices',
  /** The tool's name (Jan, 2026-10-27). The menu and header still say "Prices", so couples know what it is. */
  heading: 'The MatchMaker',
  intro: `An honest idea of cost, before you visit. Answer five quick questions and watch your price build as you go. Venue hire includes ${INCLUDED_GUESTS} guests, and you can welcome up to ${MAX_GUESTS} in all.`,
  formLabel: 'The MatchMaker: price estimate and enquiry',
  steps: {
    season: 'When would you like to marry?',
    day: 'Which day of the week?',
    guests: 'How many guests?',
    extras: 'Anything extra?',
    details: 'Happy with your match?',
  },
  seasons: {
    peak: { label: 'June to September' },
    shoulder: { label: 'April, May or October' },
    offPeak: { label: 'November to March' },
  },
  days: {
    saturday: { label: 'Saturday' },
    friSun: { label: 'Friday or Sunday' },
    midweek: { label: 'Monday to Thursday' },
  },
  dayGuests: {
    label: 'Day guests',
    hint: `${INCLUDED_GUESTS} included. ${formatGBP(EXTRA_DAY_GUEST_PRICE)} for each extra guest.`,
    min: INCLUDED_GUESTS,
    max: MAX_GUESTS,
  },
  eveningGuests: {
    label: 'Evening guests',
    hint: `Joining from 8pm. ${formatGBP(EVENING_GUEST_PRICE)} each.`,
    min: 0,
    /** The starting limit; the tool lowers it as day guests go up (see eveningGuestLimit). */
    max: MAX_GUESTS - INCLUDED_GUESTS,
  },
  /** Under the guest counters: the overall limit, then how many evening places are left ({count} is replaced). */
  guestLimit: `Up to ${MAX_GUESTS} guests in all, day and evening together.`,
  eveningLeft: { none: 'No evening places left.', one: '1 evening place left.', many: '{count} evening places left.' },
  /** Accessible names for the − and + buttons; {field} is replaced with the field's label. */
  fewer: 'Fewer {field}',
  more: 'More {field}',
  extras: {
    gardenCeremony: { label: 'Ceremony in the gardens', detail: `+${formatGBP(GARDEN_CEREMONY_PRICE)}, rather than the ceremony room` },
    dressingRoom: { label: 'Dressing room the night before', detail: `+${formatGBP(DRESSING_ROOM_NIGHT_BEFORE_PRICE)}` },
  },
  resultLabel: 'Your estimate',
  venueHire: 'Venue hire',
  /** {season}, {day} and {included} are replaced. */
  venueDetail: '{season}, {day}. Includes {included} guests',
  extraDayGuests: 'Additional day guests',
  eveningGuestsRow: 'Evening guests',
  /** {count} and {price} are replaced. */
  perGuestDetail: '{count} × {price}',
  gardenCeremony: 'Ceremony in the gardens',
  dressingRoom: 'Dressing room the night before',
  guide: "A guide, not a quote. We'll confirm your price when we reply.",
  placeholderNote: 'Illustrative figures: these are example prices, not our current rates.',
  /** Step 05: a button that opens the lead popup (names and email). */
  details: {
    body: "Send us your estimate and we'll be in touch about your wedding. No obligation, and no hard sell.",
    // Short: rolling-text buttons can't wrap.
    open: 'Enquire now',
    /** The popup. */
    title: 'Where should we reply?',
    dialogBody: "Leave your names and email, and we'll get back to you about your wedding and this estimate.",
    close: 'Close',
    names: { label: 'Your names', hint: 'Both of you, if you like.' },
    email: { label: 'Email' },
    /** Shown under a field when its check fails (codes from src/lib/validation.ts). */
    errors: {
      names: { required: 'Please tell us your names.' },
      email: {
        required: 'Please give us an email address, so we can reply.',
        invalid: 'Please check your email address, for example name@example.com.',
      },
    },
    /** Announced when a send finds problems; {count} is replaced with the number. */
    errorSummary: { one: 'There is 1 thing to check before sending.', many: 'There are {count} things to check before sending.' },
    // Short: rolling-text buttons can't wrap.
    submit: 'Send enquiry',
    sending: 'Sending',
    success: {
      heading: 'Thank you',
      /** {names} and {total} are replaced. */
      body: "Thank you, {names}. We've received your enquiry and your estimate of {total}, and we'll be in touch soon.",
      again: 'Done',
    },
    failure: "Sorry, your enquiry didn't go through. Please try again in a moment, or call us.",
    noScript: 'Sending needs JavaScript. You can also reach us on the details below.',
  },
} as const;

export const faq = {
  label: 'Questions',
  heading: 'Questions couples ask',
  items: [
    {
      question: `Is ${MAX_GUESTS} guests enough?`,
      answer: `For most couples it's the right number. Weddings here are for up to ${MAX_GUESTS} guests through the day, which is enough for everyone who matters and few enough that you'll talk to all of them.`,
    },
    {
      question: 'Will it feel too formal?',
      answer:
        "Ashden Manor is elegant, but it isn't stuffy. It's a house rather than a function suite, and with exclusive use your guests treat it like one: wandering the gardens, settling in and making themselves at home.",
    },
    {
      question: 'Is exclusive use worth it?',
      answer:
        'It means the whole manor, gardens and dining room are yours. No other weddings, no strangers in your photographs and no guests checking in at a front desk. Couples tend to notice it most in how relaxed everyone is.',
    },
    {
      question: 'How is this different from a hotel wedding?',
      answer:
        'Privacy, personality and food. Nobody else is here, the rooms have the character of a Georgian house, and the in-house kitchen makes dinner a centrepiece rather than a set menu.',
    },
    {
      question: `Can we have fewer than ${MAX_GUESTS} guests?`,
      answer: `Yes. Venue hire includes ${INCLUDED_GUESTS} guests, and each additional day guest is ${formatGBP(EXTRA_DAY_GUEST_PRICE)}. Evening guests joining from 8pm are ${formatGBP(EVENING_GUEST_PRICE)} each. Day and evening guests together come to no more than ${MAX_GUESTS}.`,
    },
    {
      question: 'Where is Ashden Manor?',
      answer: "In the English countryside. We'll send you full directions when you get in touch.",
    },
    {
      question: 'Can you cater for dietary requirements?',
      answer: 'Catering is in-house, so tell us about any dietary requirements when you get in touch.',
    },
    {
      question: 'Can we bring our dog?',
      answer: 'Yes, Ashden Manor is pet-friendly.',
    },
  ],
} as const;

/**
 * Contact details are MADE-UP PLACEHOLDERS (Jan's call, 2026-10-22), not the client's. They must be
 * replaced before launch (Open Questions 2). The phone number is in Ofcom's range reserved for
 * fiction (01632 960xxx), so it can never reach a real person. Nothing is linked (no tel: or
 * mailto:) until the real details arrive.
 */
export const footer = {
  heading: 'Come and see it for yourself',
  body: "Tell us your plans, or simply ask a question. We'd be glad to hear from you.",
  cta: { label: 'Make an enquiry', href: '#enquire' },
  phoneLabel: 'Call us',
  phone: '01632 960 482',
  emailLabel: 'Email',
  email: 'hello@ashdenmanor.co.uk',
  addressLabel: 'Find us',
  address: 'Ashden Manor, Ashden Lane, Ashden, England',
  backToTop: 'Back to the top',
  smallPrint: 'Prices on this site are a guide, not a quote.',
} as const;

export const notFound = {
  heading: 'Page not found',
  body: 'This page seems to have wandered off into the gardens.',
  link: 'Back to Ashden Manor',
} as const;
