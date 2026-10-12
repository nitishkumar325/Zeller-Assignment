import React, { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { PlusIcon, SearchIcon } from '../components/Icons';
import { SlidingTabs } from '../components/SlidingTabs';
import { UserList } from '../components/UserList';
import { useCustomers } from '../state/CustomerProvider';
import { colors } from '../theme';
import { LIST_TABS } from '../types';

type Props = {
  onAdd: () => void;
  onOpenCustomer: (id: string) => void;
};

/**
 * Main screen. Three lists sit in a pager so a swipe moves All -> Admin -> Manager
 * and the tab pill follows the finger.
 */
export function CustomerListScreen({ onAdd, onOpenCustomer }: Props) {
  const { customers, refreshing, refreshError, refresh } = useCustomers();
  const pagerRef = useRef<PagerView>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const goToPage = (index: number) => {
    pagerRef.current?.setPage(index);
  };

  const toggleSearch = () => {
    setSearchOpen(open => {
      if (open) {
        setQuery('');
      }
      return !open;
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <SlidingTabs tabs={LIST_TABS} progress={progress} onPress={goToPage} />
        <Pressable
          style={styles.searchButton}
          onPress={toggleSearch}
          accessibilityRole="button"
          accessibilityLabel={searchOpen ? 'Close search' : 'Search by name'}
          testID="search-button">
          <SearchIcon color={searchOpen || query ? colors.blue : colors.muted} />
        </Pressable>
      </View>

      {searchOpen ? (
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name"
          placeholderTextColor={colors.placeholder}
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          testID="search-input"
        />
      ) : null}

      {refreshError ? (
        <Text style={styles.errorBanner}>
          Showing saved users. {refreshError}
        </Text>
      ) : null}

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageScroll={event => {
          const { position, offset } = event.nativeEvent;
          progress.setValue(position + offset);
        }}>
        {LIST_TABS.map(tab => (
          <View key={tab} style={styles.page} collapsable={false}>
            <UserList
              customers={customers}
              tab={tab}
              query={query}
              refreshing={refreshing}
              onRefresh={refresh}
              onPressCustomer={onOpenCustomer}
            />
          </View>
        ))}
      </PagerView>

      <Pressable
        style={styles.fab}
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel="Add user"
        testID="add-user-button">
        <PlusIcon />
      </Pressable>
    </SafeAreaView>
  );
}

const androidTop = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: androidTop,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchButton: {
    width: 40,
    height: 40,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 4,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    fontSize: 16,
    color: colors.text,
  },
  errorBanner: {
    marginHorizontal: 20,
    marginBottom: 4,
    color: colors.danger,
    fontSize: 13,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B4FD8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
});
