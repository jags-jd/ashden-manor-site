import contentSource from '../src/data/content.ts?raw';
import { describe, expect, it } from 'vitest';
import * as content from '../src/data/content';
import { sections } from '../src/data/content';
import { GUEST_COUNT } from '../src/data/pricing';

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

  it('takes the guest count from GUEST_COUNT rather than typing it', () => {
    const source = contentSource
      // Identifiers, not copy: the section's anchor id and its export name.
      .replaceAll('why-100', '')
      .replaceAll('why100', '');
    expect(source).not.toContain(String(GUEST_COUNT));
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

  it('include the enquiry form, which the header Enquire button links to', () => {
    expect(sections.some((s) => s.id === 'enquire')).toBe(true);
  });
});
