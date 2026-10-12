import Realm from 'realm';
import { CustomerSchema, DeletedCustomerSchema } from './schema';

let opening: Promise<Realm> | null = null;

/**
 * Opens the on-device Realm, or returns the one we already opened.
 * Called once from App when the UI boots.
 */
export function openCustomerRealm(): Promise<Realm> {
  if (!opening) {
    opening = Realm.open({
      schema: [CustomerSchema, DeletedCustomerSchema],
      schemaVersion: 1,
    }).catch(error => {
      // Let the next attempt try again instead of caching the failure.
      opening = null;
      throw error;
    });
  }
  return opening;
}
