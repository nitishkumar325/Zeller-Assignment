import React from 'react';
import { RefreshControl, SectionList } from 'react-native';
import { colors } from '../theme';
import type { Customer, ListTab } from '../types';
import { customersForTab, groupByLetter } from '../utils/customerList';
import { EmptyState } from './EmptyState';
import { SectionHeader } from './SectionHeader';
import { UserRow } from './UserRow';
import { styles } from './UserList.styles';

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
  const empty = sections.length === 0;

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <UserRow customer={item} onPress={() => onPressCustomer(item.id)} />
      )}
      renderSectionHeader={({ section }) => (
        <SectionHeader title={section.title} />
      )}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={empty ? styles.emptyGrow : styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.blue}
          colors={[colors.blue]}
        />
      }
      ListEmptyComponent={<EmptyState query={query} refreshing={refreshing} />}
      keyboardShouldPersistTaps="handled"
    />
  );
}
