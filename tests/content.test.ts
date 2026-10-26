import estimateSource from '../src/components/Estimate.astro?raw';
import contentSource from '../src/data/content.ts?raw';
import { describe, expect, it } from 'vitest';
import * as content from '../src/data/content';
import { footer, header, sections } from '../src/data/content';
import {
  DRESSING_ROOM_NIGHT_BEFORE_PRICE,
  EVENING_GUEST_PRICE,
  EXTRA_DAY_GUEST_PRICE,
  GARDEN_CEREMONY_PRICE,
  INCLUDED_GUESTS,
  MAX_GUESTS,
} from '../src/data/pricing';

/** Every string in the copy, however deeply nested. */
function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

// From "Avoid wedding clichés" in CLAUDE.md.
const CLICHES = [
  'bespoke',
  'fairytale',
  'fairy tale',
  'dream day',
  'magical',
  'once in a lifetime',
  'nestled',
  'picture-perfect',
  'picture perfect',
  'tie the knot',
  'say "i do"',
  'happily ever after',
  'breathtaking',
  'stunning',
  'unforgettable',
  'luxury',
  'luxurious',
];

describe('page copy', () => {
  const copy = allStrings(content).map((s) => s.toLowerCase());

  it('avoids the banned wedding clichés', () => {
    for (const phrase of CLICHES) {
      expect(copy.filter((s) => s.includes(phrase)), phrase).toEqual([]);
    }
  });

  it('takes guest numbers and prices from pricing.ts rather than typing them', () => {
    const source = contentSource
      // Identifiers, not copy: the section's anchor id and its export name.
      .replaceAll('why-100', '')
      .replaceAll('why100', '');
    for (const value of [MAX_GUESTS, INCLUDED_GUESTS, EXTRA_DAY_GUEST_PRICE, EVENING_GUEST_PRICE, GARDEN_CEREMONY_PRICE, DRESSING_ROOM_NIGHT_BEFORE_PRICE]) {
      expect(source, String(value)).not.toMatch(new RegExp(`\\b${value}\\b`));
    }
  });
});

describe('page sections', () => {
  it('have unique ids', () => {
    const ids = sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('have ids that are safe to use as URL fragments', () => {
    for (const { id } of sections) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("send every Enquire link to the pricing tool's last step (#enquire)", () => {
    expect(header.enquireHref).toBe('#enquire');
    expect(footer.cta.href).toBe('#enquire');
    expect(estimateSource).toContain('id="enquire"');
    // The enquiry is part of Prices now, not a section of its own.
    expect(sections.some((s) => s.id === 'enquire')).toBe(false);
  });
});
