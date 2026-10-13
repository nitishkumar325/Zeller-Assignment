import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { Provider } from 'react-redux';
import type Realm from 'realm';
import { styles } from './App.styles';
import { BootScreen } from './src/components/BootScreen';
import { openCustomerRealm } from './src/db/openRealm';
import { Root } from './src/screens/Root';
import { store } from './src/store';
import { colors } from './src/theme';

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
    <Provider store={store}>
      <View style={styles.root}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        {realm ? (
          <Root realm={realm} />
        ) : (
          <BootScreen
            message={bootError}
            onRetry={() => setAttempt(value => value + 1)}
          />
        )}
      </View>
    </Provider>
  );
}

export default App;
