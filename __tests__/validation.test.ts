import { hasFieldErrors, validateCustomerForm } from '../src/utils/validation';
import type { CustomerInput } from '../src/types';

function draft(overrides: Partial<CustomerInput> = {}): CustomerInput {
  return {
    firstName: 'Barbara',
    lastName: 'Streider',
    email: 'barbara@zeller.com',
    role: 'Admin',
    ...overrides,
  };
}

describe('validateCustomerForm', () => {
  it('accepts a normal name and email', () => {
    const errors = validateCustomerForm(draft());
    expect(hasFieldErrors(errors)).toBe(false);
  });

  it('lets the email stay empty', () => {
    const errors = validateCustomerForm(draft({ email: '   ' }));
    expect(errors.email).toBeUndefined();
  });

  it('requires a first name', () => {
    const errors = validateCustomerForm(draft({ firstName: '   ' }));
    expect(errors.firstName).toBe('First name is required');
  });

  it('rejects numbers and symbols in a name', () => {
    const errors = validateCustomerForm(draft({ firstName: 'Ann3' }));
    expect(errors.firstName).toBe(
      'First name can only contain letters and spaces',
    );
  });

  it('rejects a name longer than 50 characters', () => {
    const errors = validateCustomerForm(
      draft({ firstName: 'A'.repeat(51), lastName: '' }),
    );
    expect(errors.firstName).toBe('First name must be 50 characters or fewer');
  });

  it('counts the first and last name together toward the 50 character limit', () => {
    const errors = validateCustomerForm(
      draft({ firstName: 'A'.repeat(30), lastName: 'B'.repeat(30) }),
    );
    expect(errors.firstName).toBe('Name must be 50 characters or fewer');
  });

  it('rejects a badly formed email', () => {
    const errors = validateCustomerForm(draft({ email: 'not-an-email' }));
    expect(errors.email).toBe('Enter a valid email address');
  });

  it('still checks the last name when it is filled in', () => {
    const errors = validateCustomerForm(draft({ lastName: 'Boyle-IV' }));
    expect(errors.lastName).toBe(
      'Last name can only contain letters and spaces',
    );
  });
});
