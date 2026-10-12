export type UserRole = 'Admin' | 'Manager';

export const USER_ROLES: UserRole[] = ['Admin', 'Manager'];

// The three pages the user can swipe between.
export type ListTab = 'All' | UserRole;

export const LIST_TABS: ListTab[] = ['All', 'Admin', 'Manager'];

// A user as we keep it on device. The screen only ever reads this shape.
export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  // True when this row was created in the app, not downloaded.
  isLocal: boolean;
  // True after a local edit, so a refresh does not overwrite it.
  editedLocally: boolean;
};

// What the add / edit form collects.
export type CustomerInput = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};

// One row from listZellerCustomers, before we split the name.
export type RemoteCustomer = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
};
