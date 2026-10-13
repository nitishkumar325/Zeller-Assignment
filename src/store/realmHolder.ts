import type Realm from 'realm';

// Realm itself is not serializable, so it stays outside the Redux store.
// Thunks call getOpenRealm() when they need to read or write.
let openRealm: Realm | null = null;

/** Called once the database has opened, and again when it is closed. */
export function setOpenRealm(realm: Realm | null) {
  openRealm = realm;
}

/** Used by the customer thunks. Throws if a screen dispatches before boot finishes. */
export function getOpenRealm(): Realm {
  if (!openRealm) {
    throw new Error('The local database is not open yet');
  }
  return openRealm;
}
