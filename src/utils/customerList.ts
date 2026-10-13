import type { Customer, ListTab } from '../types';
import { fullName } from './names';

export type CustomerSection = {
  title: string;
  data: Customer[];
};

/**
 * Used by each pager page.
 * Drops users that don't match the tab, then the name search.
 */
export function customersForTab(
  customers: Customer[],
  tab: ListTab,
  query: string,
): Customer[] {
  const search = query.trim().toLowerCase();

  return customers.filter(customer => {
    if (tab !== 'All' && customer.role !== tab) {
      return false;
    }
    if (!search) {
      return true;
    }
    return fullName(customer).toLowerCase().includes(search);
  });
  
}

/**
 * Groups an already filtered list under A, B, C... headers.
 * Sort is case-insensitive so "brad" and "Barbara" share a section.
 */
export function groupByLetter(customers: Customer[]): CustomerSection[] {
  const sorted = [...customers].sort((a, b) =>
    fullName(a).localeCompare(fullName(b), undefined, { sensitivity: 'base' }),
  );

  const sections: CustomerSection[] = [];
  for (const customer of sorted) {
    const letter = (fullName(customer).charAt(0) || '#').toUpperCase();
    const current = sections[sections.length - 1];
    if (!current || current.title !== letter) {
      sections.push({ title: letter, data: [customer] });
    } else {
      current.data.push(customer);
    }
  }

  return sections;
}
