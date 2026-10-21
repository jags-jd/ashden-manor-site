import { describe, expect, it } from 'vitest';
import { sections } from '../src/data/content';

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
