/** Splits copy into plain text and `[TBC: ...]` placeholders, so placeholders can be styled visibly. */
export interface CopySegment {
  text: string;
  tbc: boolean;
}

const TBC = /(\[TBC:[^\]]*\])/;

export function splitTbc(copy: string): CopySegment[] {
  return copy
    .split(TBC)
    .filter((part) => part !== '')
    .map((part) => ({ text: part, tbc: TBC.test(part) }));
}
