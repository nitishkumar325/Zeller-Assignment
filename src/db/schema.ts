import type { ObjectSchema } from 'realm';

export const CUSTOMER_SCHEMA = 'Customer';
export const DELETED_SCHEMA = 'DeletedCustomer';

// Plain schemas, so we don't need the Realm babel plugin.
export const CustomerSchema: ObjectSchema = {
  name: CUSTOMER_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    firstName: 'string',
    lastName: 'string',
    email: 'string',
    role: 'string',
    isLocal: { type: 'bool', default: false },
    editedLocally: { type: 'bool', default: false },
  },
};

// Ids the user deleted. Refresh uses this so the server copy stays gone.
export const DeletedCustomerSchema: ObjectSchema = {
  name: DELETED_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
  },
};
