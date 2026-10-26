import { describe, expect, it } from 'vitest';
import { validateEmail, validateLead, validateNames, type LeadFields } from '../src/lib/validation';

const valid: LeadFields = { names: 'Sam & Alex', email: 'sam@example.com' };

describe('names', () => {
  it('are required', () => {
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

describe('validateLead', () => {
  it('passes names and a valid email', () => {
    expect(validateLead(valid)).toEqual({});
  });

  it('reports both problems at once, in form order, so focus can go to the first', () => {
    const errors = validateLead({ names: '', email: 'nope' });
    expect(errors).toEqual({ names: 'required', email: 'invalid' });
    expect(Object.keys(errors)).toEqual(['names', 'email']);
  });
});
