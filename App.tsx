import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type Realm from 'realm';
import { openCustomerRealm } from './src/db/openRealm';
import { CustomerListScreen } from './src/screens/CustomerListScreen';
import { UserFormScreen } from './src/screens/UserFormScreen';
import { CustomerProvider, useCustomers } from './src/state/CustomerProvider';
import { colors } from './src/theme';
import type { CustomerInput } from './src/types';

type Screen =
  | { name: 'list' }
  | { name: 'create' }
  | { name: 'edit'; customerId: string };

function App() {
  const [realm, setRealm] = useState<Realm | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setBootError(null);
    openCustomerRealm()
      .then(instance => {
        if (active) {
          setRealm(instance);
        }
      })
      .catch(error => {
        if (active) {
          const message =
            error instanceof Error
              ? error.message
              : 'Could not open the local database';
          setBootError(message);
        }
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {realm ? (
        <CustomerProvider realm={realm}>
          <Root />
        </CustomerProvider>
      ) : (
        <BootScreen
          message={bootError}
          onRetry={() => setAttempt(value => value + 1)}
        />
      )}
    </View>
  );
}

function Root() {
  const store = useCustomers();
  const [screen, setScreen] = useState<Screen>({ name: 'list' });

  const editing =
    screen.name === 'edit'
      ? store.customers.find(customer => customer.id === screen.customerId)
      : undefined;

  const close = () => setScreen({ name: 'list' });

  const submit = (input: CustomerInput) => {
    if (screen.name === 'create') {
      store.addCustomer(input);
    } else if (screen.name === 'edit') {
      store.updateCustomer(screen.customerId, input);
    }
    close();
  };

  return (
    <View style={styles.root}>
      <CustomerListScreen
        onAdd={() => setScreen({ name: 'create' })}
        onOpenCustomer={customerId => setScreen({ name: 'edit', customerId })}
      />
      <Modal
        visible={screen.name !== 'list'}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={close}>
        {screen.name === 'list' ? null : (
          <UserFormScreen
            key={screen.name === 'edit' ? screen.customerId : 'create'}
            title={screen.name === 'edit' ? 'Edit User' : 'New User'}
            submitLabel={
              screen.name === 'edit' ? 'Save Changes' : 'Create User'
            }
            initial={editing}
            onClose={close}
            onSubmit={submit}
            onDelete={
              editing
                ? () => {
                    store.deleteCustomer(editing.id);
                    close();
                  }
                : undefined
            }
          />
        )}
      </Modal>
    </View>
  );
}

function BootScreen({
  message,
  onRetry,
}: {
  message: string | null;
  onRetry: () => void;
}) {
  return (
    <View style={styles.boot}>
      {message ? (
        <>
          <Text style={styles.bootTitle}>Couldn't open saved users</Text>
          <Text style={styles.bootBody}>{message}</Text>
          <Pressable onPress={onRetry} style={styles.retry}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </>
      ) : (
        <ActivityIndicator color={colors.blue} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.background,
  },
  bootTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  bootBody: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
  },
  retry: {
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.blue,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default App;
