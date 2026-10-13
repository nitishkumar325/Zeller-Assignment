/**
 * Splits the API's single name field into the two boxes on the form.
 * "Cecil Boyle IV" becomes first "Cecil" and last "Boyle IV".
 */
export function splitName(name: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  const trimmed = (name ?? '').trim().replace(/\s+/g, ' ');
  if (!trimmed) {
    return { firstName: '', lastName: '' };
  }

  const space = trimmed.indexOf(' ');
  if (space === -1) {
    return { firstName: trimmed, lastName: '' };
  }

  return {
    firstName: trimmed.slice(0, space),
    lastName: trimmed.slice(space + 1),
  };
}

/** Full name shown in the list and used by the search box. */
export function fullName(customer: {
  firstName: string;
  lastName: string;
}): string {
  return `${customer.firstName} ${customer.lastName}`
    .replace(/\s+/g, ' ')
    .trim();
}

/** The letter drawn inside the blue square on each row. */
export function nameInitial(customer: {
  firstName: string;
  lastName: string;
}): string {
  const name = fullName(customer);
  return (name.charAt(0) || '?').toUpperCase();
}
