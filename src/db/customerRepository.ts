import Realm from 'realm';
import { fetchAllCustomers } from '../api/fetchCustomers';
import type { Customer, CustomerInput, RemoteCustomer } from '../types';
import { customersToUpsert } from '../utils/syncCustomers';
import { CUSTOMER_SCHEMA, DELETED_SCHEMA } from './schema';

// Fields we read off a live Realm object. Copied out before React sees them.
type CustomerRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isLocal: boolean;
  editedLocally: boolean;
};

/**
 * Reads every customer out of Realm as plain objects.
 * The list is rendered from this, never straight from the network response.
 */
export function readCustomers(realm: Realm): Customer[] {
  const rows = realm.objects<CustomerRow>(CUSTOMER_SCHEMA);
  const customers: Customer[] = [];
  for (let i = 0; i < rows.length; i++) {
    customers.push(toPlain(rows[i]));
  }
  return customers;
}

export function readDeletedIds(realm: Realm): string[] {
  const rows = realm.objects<{ id: string }>(DELETED_SCHEMA);
  const ids: string[] = [];
  for (let i = 0; i < rows.length; i++) {
    ids.push(rows[i].id);
  }
  return ids;
}

/**
 * Subscribes to table changes so the list updates after a write.
 * Returns the unsubscribe function for the effect cleanup.
 */
export function watchCustomers(realm: Realm, onChange: () => void): () => void {
  const rows = realm.objects(CUSTOMER_SCHEMA);
  const listener = () => onChange();
  rows.addListener(listener);
  return () => {
    rows.removeListener(listener);
  };
}

/**
 * Initial load and pull-to-refresh.
 * Asks the GraphQL API for listZellerCustomers, then writes those people into Realm.
 * The screen reads the table after this returns, so the first list is the API's list.
 */
export async function loadCustomersFromApi(realm: Realm): Promise<Customer[]> {
  const remoteCustomers = await fetchAllCustomers();
  saveRemoteCustomers(realm, remoteCustomers);
  return readCustomers(realm);
}

/**
 * Merges a GraphQL page into Realm.
 * Local adds, edits and deletes are left alone. See customersToUpsert.
 */
export function saveRemoteCustomers(
  realm: Realm,
  remoteCustomers: RemoteCustomer[],
): void {
  const rows = customersToUpsert(
    readCustomers(realm),
    readDeletedIds(realm),
    remoteCustomers,
  );

  if (rows.length === 0) {
    return;
  }

  realm.write(() => {
    for (const customer of rows) {
      realm.create(CUSTOMER_SCHEMA, customer, Realm.UpdateMode.Modified);
    }
  });
}

/** Saves a user typed into the form. They only exist in the local database. */
export function createCustomer(realm: Realm, input: CustomerInput): void {
  const customer: Customer = {
    id: createLocalId(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim(),
    role: input.role,
    isLocal: true,
    editedLocally: true,
  };

  realm.write(() => {
    realm.create(CUSTOMER_SCHEMA, customer);
  });
}

/** Updates a row in place and marks it so the next refresh won't revert it. */
export function updateCustomer(
  realm: Realm,
  id: string,
  input: CustomerInput,
): void {
  const current = realm.objectForPrimaryKey<CustomerRow>(CUSTOMER_SCHEMA, id);
  if (!current) {
    return;
  }

  realm.write(() => {
    realm.create(
      CUSTOMER_SCHEMA,
      {
        id,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: input.email.trim(),
        role: input.role,
        isLocal: current.isLocal,
        editedLocally: true,
      },
      Realm.UpdateMode.Modified,
    );
  });
}

/**
 * Removes a user from the local list.
 * Server-sourced rows also get a tombstone, otherwise refresh would bring them back.
 */
export function deleteCustomer(realm: Realm, id: string): void {
  realm.write(() => {
    const current = realm.objectForPrimaryKey<CustomerRow>(CUSTOMER_SCHEMA, id);
    if (!current) {
      return;
    }
    const wasLocal = current.isLocal;
    realm.delete(current);
    if (!wasLocal) {
      realm.create(DELETED_SCHEMA, { id });
    }
  });
}

function toPlain(row: CustomerRow): Customer {
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    role: row.role,
    isLocal: row.isLocal,
    editedLocally: row.editedLocally,
  };
}

function createLocalId(): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `local-${time}-${random}`;
}
