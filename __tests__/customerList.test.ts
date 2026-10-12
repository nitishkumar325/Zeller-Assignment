import type { Customer } from '../src/types';
import { customersForTab, groupByLetter } from '../src/utils/customerList';
import { fullName, nameInitial, splitName } from '../src/utils/names';

function customer(overrides: Partial<Customer> = {}): Customer {
  return {
    id: '1',
    firstName: 'Barbara',
    lastName: 'Streider',
    email: 'barbara@zeller.com',
    role: 'Admin',
    isLocal: false,
    editedLocally: false,
    ...overrides,
  };
}

describe('names', () => {
  it('splits a single API name into first and last', () => {
    expect(splitName('Cecil Boyle IV')).toEqual({
      firstName: 'Cecil',
      lastName: 'Boyle IV',
    });
  });

  it('keeps a one-word name in the first name field', () => {
    expect(splitName('Madonna')).toEqual({
      firstName: 'Madonna',
      lastName: '',
    });
  });

  it('builds the label and the avatar letter from both parts', () => {
    const person = customer();
    expect(fullName(person)).toBe('Barbara Streider');
    expect(nameInitial(person)).toBe('B');
  });
});

describe('customer list helpers', () => {
  const people = [
    customer(),
    customer({
      id: '2',
      firstName: 'Brad',
      lastName: 'Herman',
      role: 'Manager',
    }),
    customer({
      id: '3',
      firstName: 'Debra',
      lastName: 'Pfeffer',
      role: 'Admin',
    }),
  ];

  it('filters by role and leaves All alone', () => {
    expect(customersForTab(people, 'Admin', '').map(person => person.id)).toEqual([
      '1',
      '3',
    ]);
    expect(customersForTab(people, 'All', '')).toHaveLength(3);
  });

  it('searches by name without caring about case', () => {
    const matches = customersForTab(people, 'All', 'brad');
    expect(matches.map(person => person.firstName)).toEqual(['Brad']);
  });

  it('groups the visible rows under their first letter', () => {
    const sections = groupByLetter(customersForTab(people, 'All', ''));
    expect(sections.map(section => section.title)).toEqual(['B', 'D']);
    expect(sections[0].data.map(person => person.firstName)).toEqual([
      'Barbara',
      'Brad',
    ]);
  });
});
