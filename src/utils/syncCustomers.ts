import type { Customer, RemoteCustomer } from '../types';
import { splitName } from './names';

/**
 * Turns one GraphQL customer into the shape we store in Realm.
 * Returns null when the row has no id, because we can't key it.
 */
export function remoteToCustomer(remote: RemoteCustomer): Customer | null {
  if (!remote.id) {
    return null;
  }

  const { firstName, lastName } = splitName(remote.name);
  return {
    id: remote.id,
    firstName: firstName || 'Unknown',
    lastName,
    email: (remote.email ?? '').trim(),
    role: normaliseRole(remote.role),
    isLocal: false,
    editedLocally: false,
  };
}

/**
 * Decides which server rows are safe to write.
 * Skips people the user deleted, and people they edited on this phone,
 * so a pull-to-refresh does not undo local work.
 */
export function customersToUpsert(
  existing: Customer[],
  deletedIds: string[],
  remoteCustomers: RemoteCustomer[],
): Customer[] {
  const deleted = new Set(deletedIds);
  const localById = new Map(existing.map(customer => [customer.id, customer]));
  const upserts: Customer[] = [];

  console.log("remoteCustomers",remoteCustomers,deletedIds)

  for (const remote of remoteCustomers) {
    if (!remote.hasOwnProperty('id') || deleted.has(remote.id)) {
      continue;
    }

    const current = localById.get(remote.id);
    if (current?.editedLocally || current?.isLocal) {
      continue;
    }

    const next = remoteToCustomer(remote);
    if (next) {
      upserts.push(next);
    }
  }
  console.log("upserts",upserts)

  return upserts;
}

// The API is a free-form string. The tabs only know Admin and Manager.
function normaliseRole(role: string | null | undefined): string {
  const value = (role ?? '').trim();
  if (/^admin$/i.test(value)) {
    return 'Admin';
  }
  if (/^manager$/i.test(value)) {
    return 'Manager';
  }
  return value || 'Manager';
}
