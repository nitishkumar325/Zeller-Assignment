import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { colors } from '../theme';
import { styles } from './BootScreen.styles';

type Props = {
  message: string | null;
  onRetry: () => void;
};

export function BootScreen({ message, onRetry }: Props) {
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
