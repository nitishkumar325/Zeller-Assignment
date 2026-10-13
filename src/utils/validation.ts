import type { CustomerInput } from '../types';

const NAME_PATTERN = /^[A-Za-z ]+$/;
const EMAIL_PATTERN =
  /^([A-Za-z0-9._%+-]+)@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*)\.([A-Za-z]{2,})$/;
const NAME_LIMIT = 50;

export type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

type ValidateOptions = {
  // New users must include an email. Edits may keep a blank one.
  requireEmail?: boolean;
};

/**
 * Checks the add / edit form.
 * Name is required, letters and spaces only, and 50 characters at most.
 * A new user's email is required and must be a normal address like name@domain.com.
 */
export function validateCustomerForm(
  input: CustomerInput,
  options: ValidateOptions = {},
): FieldErrors {
  const errors: FieldErrors = {};
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email.trim();

  const firstErr = checkName(firstName, 'First name', true);
  if (firstErr) {
    errors.firstName = firstErr;
  }

  const lastErr = checkName(lastName, 'Last name', false);
  if (lastErr) {
    errors.lastName = lastErr;
  }

  // The brief limits "name", so the two fields together count as well.
  if (!errors.firstName && !errors.lastName) {
    const full = `${firstName} ${lastName}`.trim();
    if (full.length > NAME_LIMIT) {
      errors.firstName = 'Name must be 50 characters or fewer';
    }
  }

  if (!email) {
    if (options.requireEmail) {
      errors.email = 'Email is required';
    }
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address';
  }

  return errors;
}

export function hasFieldErrors(errors: FieldErrors): boolean {
  return Boolean(errors.firstName || errors.lastName || errors.email);
}

function isValidEmail(value: string): boolean {
  const match = EMAIL_PATTERN.exec(value);
  if (!match) {
    return false;
  }
  const local = match[1];
  return (
    !local.startsWith('.') && !local.endsWith('.') && !local.includes('..')
  );
}

function checkName(
  value: string,
  label: string,
  required: boolean,
): string | undefined {
  if (!value) {
    return required ? `${label} is required` : undefined;
  }
  if (value.length > NAME_LIMIT) {
    return `${label} must be 50 characters or fewer`;
  }
  if (!NAME_PATTERN.test(value)) {
    return `${label} can only contain letters and spaces`;
  }
  return undefined;
}
