import { describe, expect, it } from 'vitest';
import { splitTbc } from '../src/lib/tbc';

describe('splitTbc', () => {
  it('returns plain copy as a single segment', () => {
    expect(splitTbc('No placeholders here.')).toEqual([{ text: 'No placeholders here.', tbc: false }]);
  });

  it('separates placeholders from the copy around them', () => {
    expect(splitTbc('In the countryside, at [TBC: address].')).toEqual([
      { text: 'In the countryside, at ', tbc: false },
      { text: '[TBC: address]', tbc: true },
      { text: '.', tbc: false },
    ]);
  });

  it('handles copy that is only a placeholder', () => {
    expect(splitTbc('[TBC: phone]')).toEqual([{ text: '[TBC: phone]', tbc: true }]);
  });
});
