import type { CustomerInput } from '../types';

const NAME_PATTERN = /^[A-Za-z ]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_LIMIT = 50;

export type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

/**
 * Checks the add / edit form.
 * Name is required, letters and spaces only, and 50 characters at most.
 * Email can be left blank, but if it is filled in it has to look like an email.
 */
export function validateCustomerForm(input: CustomerInput): FieldErrors {
  const errors: FieldErrors = {};
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email.trim();

  const firstNameError = checkName(firstName, 'First name', true);
  if (firstNameError) {
    errors.firstName = firstNameError;
  }

  const lastNameError = checkName(lastName, 'Last name', false);
  if (lastNameError) {
    errors.lastName = lastNameError;
  }

  // The brief limits "name", so the two fields together count as well.
  if (!errors.firstName && !errors.lastName) {
    const combined = `${firstName} ${lastName}`.trim();
    if (combined.length > NAME_LIMIT) {
      errors.firstName = 'Name must be 50 characters or fewer';
    }
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  return errors;
}

export function hasFieldErrors(errors: FieldErrors): boolean {
  return Boolean(errors.firstName || errors.lastName || errors.email);
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
