import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import type Realm from 'realm';
import { UserFormModal } from '../components/UserFormModal';
import { readCustomers, watchCustomers } from '../db/customerRepository';
import {
  addLocalCustomer,
  customersLoaded,
  editLocalCustomer,
  refreshCustomers,
  removeLocalCustomer,
} from '../store/customerSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setOpenRealm } from '../store/realmHolder';
import type { CustomerInput } from '../types';
import { CustomerListScreen } from './CustomerListScreen';
import { styles } from './Root.styles';

type Screen =
  | { name: 'list' }
  | { name: 'create' }
  | { name: 'edit'; customerId: string };

type Props = {
  realm: Realm;
};

export function Root({ realm }: Props) {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(state => state.customers.customers);
  const [screen, setScreen] = useState<Screen>({ name: 'list' });

  useEffect(() => {
    setOpenRealm(realm);
    dispatch(customersLoaded(readCustomers(realm)));
    const stopWatching = watchCustomers(realm, () => {
      dispatch(customersLoaded(readCustomers(realm)));
    });
    dispatch(refreshCustomers());
    return () => {
      stopWatching();
      setOpenRealm(null);
    };
  }, [realm, dispatch]);

  const editing =
    screen.name === 'edit'
      ? customers.find(customer => customer.id === screen.customerId)
      : undefined;

  const close = () => setScreen({ name: 'list' });

  const submit = (input: CustomerInput) => {
    if (screen.name === 'create') {
      dispatch(addLocalCustomer(input));
    } else if (screen.name === 'edit') {
      dispatch(editLocalCustomer(screen.customerId, input));
    }
    close();
  };

  const formOpen = screen.name !== 'list';

  return (
    <View style={styles.root}>
      <CustomerListScreen
        onAdd={() => setScreen({ name: 'create' })}
        onOpenCustomer={customerId => setScreen({ name: 'edit', customerId })}
      />
      <UserFormModal
        visible={formOpen}
        formKey={screen.name === 'edit' ? screen.customerId : 'create'}
        title={screen.name === 'edit' ? 'Edit User' : 'New User'}
        submitLabel={screen.name === 'edit' ? 'Save Changes' : 'Create User'}
        initial={editing}
        onClose={close}
        onSubmit={submit}
        onDelete={
          editing
            ? () => {
                dispatch(removeLocalCustomer(editing.id));
                close();
              }
            : undefined
        }
      />
    </View>
  );
}
