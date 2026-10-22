/**
 * Enquiry form validation: pure functions that return error codes, not wording.
 * The messages for each code live in src/data/content.ts (enquire.errors).
 */

export type FieldError = 'required' | 'invalid' | 'past' | 'tooLong';

export interface EnquiryFields {
  names: string;
  email: string;
  phone: string;
  /** yyyy-mm-dd from <input type="date">, or empty. */
  date: string;
  flexible: boolean;
  season: string;
  day: string;
  message: string;
}

export type FieldName = keyof EnquiryFields;
export type EnquiryErrors = Partial<Record<FieldName, FieldError>>;

/** Longest message we accept, so a paste of a whole document doesn't get through. */
export const MESSAGE_MAX = 2000;

/** Something@something.something, no spaces. Deliberately loose: the real check is a reply. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Digits with the usual separators, 7–15 digits in all. */
const PHONE_CHARS = /^\+?[\d\s()-]+$/;

export function validateNames(value: string): FieldError | undefined {
  return value.trim() ? undefined : 'required';
}

export function validateEmail(value: string): FieldError | undefined {
  const email = value.trim();
  if (!email) return 'required';
  return EMAIL.test(email) ? undefined : 'invalid';
}

export function validatePhone(value: string): FieldError | undefined {
  const phone = value.trim();
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '').length;
  return PHONE_CHARS.test(phone) && digits >= 7 && digits <= 15 ? undefined : 'invalid';
}

/** Today's date as yyyy-mm-dd in the visitor's own time zone. */
export function todayISO(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function validateDate(value: string, today = todayISO()): FieldError | undefined {
  if (!value) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) return 'invalid';
  return value < today ? 'past' : undefined;
}

export function validateMessage(value: string): FieldError | undefined {
  return value.length > MESSAGE_MAX ? 'tooLong' : undefined;
}

/** Validate one field by name; optional fields that aren't checked always pass. */
export function validateField(name: FieldName, fields: EnquiryFields, today = todayISO()): FieldError | undefined {
  switch (name) {
    case 'names':
      return validateNames(fields.names);
    case 'email':
      return validateEmail(fields.email);
    case 'phone':
      return validatePhone(fields.phone);
    case 'date':
      return validateDate(fields.date, today);
    case 'message':
      return validateMessage(fields.message);
    default:
      return undefined;
  }
}

/** Every field's error, in form order; empty when the enquiry can be sent. */
export function validateEnquiry(fields: EnquiryFields, today = todayISO()): EnquiryErrors {
  const errors: EnquiryErrors = {};
  for (const name of Object.keys(fields) as FieldName[]) {
    const error = validateField(name, fields, today);
    if (error) errors[name] = error;
  }
  return errors;
}
