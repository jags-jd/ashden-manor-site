/**
 * All page copy lives here so it can be edited without touching components.
 * Section copy is written in session 3; for now this holds site metadata and the section list.
 */

export const site = {
  name: 'Ashden Manor',
  title: 'Ashden Manor | Exclusive-use weddings in a Georgian manor',
  description:
    'A Georgian manor in the English countryside, yours alone for the day. Weddings for 100 guests with in-house catering, from ceremony to evening party.',
  locale: 'en_GB',
  ogImage: '/og-image.jpg',
  ogImageAlt: 'The Ashden Manor crest with the AM monogram, on warm linen',
} as const;

export interface Section {
  /** Anchor id, used in the URL fragment. */
  id: string;
  /** Short label for the header navigation and section stubs. */
  label: string;
  /** Whether the section appears in the header navigation. */
  inNav: boolean;
}

/** Page sections in order. The enquiry form is reached via the header's Enquire button. */
export const sections: readonly Section[] = [
  { id: 'top', label: 'Welcome', inNav: false },
  { id: 'exclusive-use', label: 'The manor', inNav: true },
  { id: 'spaces', label: 'The spaces', inNav: true },
  { id: 'food', label: 'The food', inNav: true },
  { id: 'why-100', label: 'Why 100', inNav: false },
  { id: 'your-day', label: 'Your day', inNav: false },
  { id: 'pets', label: 'Pets welcome', inNav: false },
  { id: 'not-a-hotel', label: 'Not a hotel', inNav: false },
  { id: 'estimate', label: 'Prices', inNav: true },
  { id: 'enquire', label: 'Enquire', inNav: false },
  { id: 'faq', label: 'Questions', inNav: true },
];

export const header = {
  skipLink: 'Skip to content',
  navLabel: 'Main',
  menuOpen: 'Menu',
  menuClose: 'Close',
  enquire: 'Enquire',
  enquireHref: '#enquire',
} as const;

export const notFound = {
  heading: 'Page not found',
  body: 'This page seems to have wandered off into the gardens.',
  link: 'Back to Ashden Manor',
} as const;
