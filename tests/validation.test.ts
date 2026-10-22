import { describe, expect, it } from 'vitest';
import {
  MESSAGE_MAX,
  todayISO,
  validateDate,
  validateEmail,
  validateEnquiry,
  validateMessage,
  validateNames,
  validatePhone,
  type EnquiryFields,
} from '../src/lib/validation';

const TODAY = '2026-10-22';

const valid: EnquiryFields = {
  names: 'Sam & Alex',
  email: 'sam@example.com',
  phone: '',
  date: '',
  flexible: false,
  season: '',
  day: '',
  message: '',
};

describe('names', () => {
  it('is required', () => {
    expect(validateNames('')).toBe('required');
    expect(validateNames('   ')).toBe('required');
    expect(validateNames('Sam & Alex')).toBeUndefined();
  });
});

describe('email', () => {
  it('is required', () => {
    expect(validateEmail('')).toBe('required');
    expect(validateEmail('  ')).toBe('required');
  });

  it('must look like an email address', () => {
    for (const bad of ['sam', 'sam@', 'sam@example', '@example.com', 'sam @example.com', 'sam@exa mple.com']) {
      expect(validateEmail(bad), bad).toBe('invalid');
    }
  });

  it('accepts ordinary addresses, ignoring surrounding spaces', () => {
    for (const good of ['sam@example.com', 'sam.alex+wedding@example.co.uk', '  sam@example.com  ']) {
      expect(validateEmail(good), good).toBeUndefined();
    }
  });
});

describe('phone (optional)', () => {
  it('may be left empty', () => {
    expect(validatePhone('')).toBeUndefined();
    expect(validatePhone('   ')).toBeUndefined();
  });

  it('accepts UK and international formats', () => {
    for (const good of ['01632 960 482', '+44 1632 960482', '(01632) 960-482', '07700900123']) {
      expect(validatePhone(good), good).toBeUndefined();
    }
  });

  it('rejects letters, and numbers too short or too long', () => {
    for (const bad of ['call me', '0163a 960482', '12345', '1234567890123456']) {
      expect(validatePhone(bad), bad).toBe('invalid');
    }
  });
});

describe('preferred date (optional)', () => {
  it('may be left empty', () => {
    expect(validateDate('', TODAY)).toBeUndefined();
  });

  it('cannot be in the past', () => {
    expect(validateDate('2026-10-21', TODAY)).toBe('past');
  });

  it('accepts today and later', () => {
    expect(validateDate(TODAY, TODAY)).toBeUndefined();
    expect(validateDate('2027-06-12', TODAY)).toBeUndefined();
  });

  it('rejects malformed dates', () => {
    expect(validateDate('12/06/2027', TODAY)).toBe('invalid');
    expect(validateDate('2027-13-45', TODAY)).toBe('invalid');
  });

  it("works out today in the visitor's own time zone", () => {
    expect(todayISO(new Date(2026, 9, 22, 23, 30))).toBe('2026-10-22');
  });
});

describe('message (optional)', () => {
  it(`allows up to ${MESSAGE_MAX} characters`, () => {
    expect(validateMessage('')).toBeUndefined();
    expect(validateMessage('a'.repeat(MESSAGE_MAX))).toBeUndefined();
    expect(validateMessage('a'.repeat(MESSAGE_MAX + 1))).toBe('tooLong');
  });
});

describe('validateEnquiry', () => {
  it('passes a complete enquiry with only the required fields', () => {
    expect(validateEnquiry(valid, TODAY)).toEqual({});
  });

  it('reports every problem at once', () => {
    expect(validateEnquiry({ ...valid, names: '', email: 'nope', phone: 'abc', date: '2020-01-01' }, TODAY)).toEqual({
      names: 'required',
      email: 'invalid',
      phone: 'invalid',
      date: 'past',
    });
  });

  it('lists errors in form order, so focus can go to the first', () => {
    const errors = validateEnquiry({ ...valid, names: '', email: '' }, TODAY);
    expect(Object.keys(errors)).toEqual(['names', 'email']);
  });

  it('ignores optional choices (season, day, flexible)', () => {
    expect(validateEnquiry({ ...valid, season: 'peak', day: 'saturday', flexible: true }, TODAY)).toEqual({});
  });
});
