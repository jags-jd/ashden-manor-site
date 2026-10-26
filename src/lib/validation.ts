/**
 * Lead validation for the pricing tool's last step: pure functions that return error codes,
 * not wording. The messages for each code live in src/data/content.ts (estimate.details.errors).
 */

export type FieldError = 'required' | 'invalid';

export interface LeadFields {
  names: string;
  email: string;
}

export type FieldName = keyof LeadFields;
export type LeadErrors = Partial<Record<FieldName, FieldError>>;

/** Something@something.something, no spaces. Deliberately loose: the real check is a reply. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateNames(value: string): FieldError | undefined {
  return value.trim() ? undefined : 'required';
}

export function validateEmail(value: string): FieldError | undefined {
  const email = value.trim();
  if (!email) return 'required';
  return EMAIL.test(email) ? undefined : 'invalid';
}

export function validateField(name: FieldName, fields: LeadFields): FieldError | undefined {
  return name === 'names' ? validateNames(fields.names) : validateEmail(fields.email);
}

/** Every field's error, in form order; empty when the lead can be sent. */
export function validateLead(fields: LeadFields): LeadErrors {
  const errors: LeadErrors = {};
  for (const name of ['names', 'email'] as const) {
    const error = validateField(name, fields);
    if (error) errors[name] = error;
  }
  return errors;
}
