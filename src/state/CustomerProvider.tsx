import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type Realm from 'realm';
import { fetchAllCustomers } from '../api/fetchCustomers';
import {
  createCustomer,
  deleteCustomer,
  readCustomers,
  saveRemoteCustomers,
  updateCustomer,
  watchCustomers,
} from '../db/customerRepository';
import type { Customer, CustomerInput } from '../types';

type CustomerStore = {
  customers: Customer[];
  refreshing: boolean;
  refreshError: string | null;
  refresh: () => Promise<void>;
  addCustomer: (input: CustomerInput) => void;
  updateCustomer: (id: string, input: CustomerInput) => void;
  deleteCustomer: (id: string) => void;
};

const CustomerContext = createContext<CustomerStore | null>(null);

type ProviderProps = {
  realm: Realm;
  children: React.ReactNode;
};

/**
 * Holds the customer list for the screens.
 * Network data is written into Realm first. `customers` is always the local copy.
 */
export function CustomerProvider({ realm, children }: ProviderProps) {
  const [customers, setCustomers] = useState<Customer[]>(() =>
    readCustomers(realm),
  );
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  useEffect(() => {
    return watchCustomers(realm, () => {
      setCustomers(readCustomers(realm));
    });
  }, [realm]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const remoteCustomers = await fetchAllCustomers();
      saveRemoteCustomers(realm, remoteCustomers);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not refresh users';
      setRefreshError(message);
    } finally {
      setRefreshing(false);
    }
  }, [realm]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const store = useMemo<CustomerStore>(
    () => ({
      customers,
      refreshing,
      refreshError,
      refresh,
      addCustomer: input => createCustomer(realm, input),
      updateCustomer: (id, input) => updateCustomer(realm, id, input),
      deleteCustomer: id => deleteCustomer(realm, id),
    }),
    [customers, refreshing, refreshError, refresh, realm],
  );

  return (
    <CustomerContext.Provider value={store}>{children}</CustomerContext.Provider>
  );
}

export function useCustomers(): CustomerStore {
  const store = useContext(CustomerContext);
  if (!store) {
    throw new Error('useCustomers must be used inside CustomerProvider');
  }
  return store;
}
