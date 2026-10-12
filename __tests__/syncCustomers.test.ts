import type { Customer, RemoteCustomer } from '../src/types';
import { customersToUpsert, remoteToCustomer } from '../src/utils/syncCustomers';

function remote(overrides: Partial<RemoteCustomer> = {}): RemoteCustomer {
  return {
    id: '1',
    name: 'Barbara Streider',
    email: 'barbara@zeller.com',
    role: 'Admin',
    ...overrides,
  };
}

function local(overrides: Partial<Customer> = {}): Customer {
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

describe('customersToUpsert', () => {
  it('maps a server row into a local customer', () => {
    expect(remoteToCustomer(remote({ role: 'manager' }))).toMatchObject({
      firstName: 'Barbara',
      lastName: 'Streider',
      role: 'Manager',
      isLocal: false,
      editedLocally: false,
    });
  });

  it('inserts people we have not stored yet', () => {
    const upserts = customersToUpsert([], [], [remote()]);
    expect(upserts).toHaveLength(1);
    expect(upserts[0].id).toBe('1');
  });

  it('does not bring back a user the phone already deleted', () => {
    const upserts = customersToUpsert([], ['1'], [remote()]);
    expect(upserts).toHaveLength(0);
  });

  it('leaves a locally edited user alone', () => {
    const upserts = customersToUpsert(
      [local({ firstName: 'Barb', editedLocally: true })],
      [],
      [remote({ name: 'Barbara Streider' })],
    );
    expect(upserts).toHaveLength(0);
  });

  it('refreshes a server user that has not been touched', () => {
    const upserts = customersToUpsert([local()], [], [
      remote({ email: 'new@zeller.com' }),
    ]);
    expect(upserts[0].email).toBe('new@zeller.com');
  });
});
