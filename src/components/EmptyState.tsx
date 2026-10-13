import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '../theme';
import { styles } from './EmptyState.styles';

type Props = {
  query: string;
  refreshing: boolean;
};

export function EmptyState({ query, refreshing }: Props) {
  if (refreshing && !query.trim()) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator color={colors.blue} />
      </View>
    );
  }

  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>
        {query.trim() ? 'No matches' : 'No users yet'}
      </Text>
      <Text style={styles.emptyBody}>
        {query.trim()
          ? 'Try a different name.'
          : 'Pull down to refresh, or add someone with the + button.'}
      </Text>
    </View>
  );
}
