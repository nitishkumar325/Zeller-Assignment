import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../theme';
import type { Customer, ListTab } from '../types';
import { customersForTab, groupByLetter } from '../utils/customerList';
import { UserRow } from './UserRow';

type Props = {
  customers: Customer[];
  tab: ListTab;
  query: string;
  refreshing: boolean;
  onRefresh: () => void;
  onPressCustomer: (id: string) => void;
};

/**
 * The alphabetical list for one tab.
 * Filtering happens here so each pager page can keep its own scroll position.
 */
export function UserList({
  customers,
  tab,
  query,
  refreshing,
  onRefresh,
  onPressCustomer,
}: Props) {
  const sections = groupByLetter(customersForTab(customers, tab, query));
  const isEmpty = sections.length === 0;

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <UserRow customer={item} onPress={() => onPressCustomer(item.id)} />
      )}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={isEmpty ? styles.emptyGrow : styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.blue}
          colors={[colors.blue]}
        />
      }
      ListEmptyComponent={
        <EmptyState query={query} refreshing={refreshing} />
      }
      keyboardShouldPersistTaps="handled"
    />
  );
}

function EmptyState({
  query,
  refreshing,
}: {
  query: string;
  refreshing: boolean;
}) {
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

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 110,
  },
  emptyGrow: {
    flexGrow: 1,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    color: colors.section,
    fontSize: 13,
    fontWeight: '500',
    backgroundColor: colors.background,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 48,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 21,
  },
});
