import React, { useRef, useState } from 'react';
import { Animated, SafeAreaView, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { AddUserButton } from '../components/AddUserButton';
import { ErrorBanner } from '../components/ErrorBanner';
import { SearchButton } from '../components/SearchButton';
import { SearchField } from '../components/SearchField';
import { SlidingTabs } from '../components/SlidingTabs';
import { UserList } from '../components/UserList';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { refreshCustomers } from '../store/customerSlice';
import { LIST_TABS } from '../types';
import { styles } from './CustomerListScreen.styles';

type Props = {
  onAdd: () => void;
  onOpenCustomer: (id: string) => void;
};

/**
 * Main screen. Three lists sit in a pager so a swipe moves All -> Admin -> Manager
 * and the tab pill follows the finger.
 */
export function CustomerListScreen({ onAdd, onOpenCustomer }: Props) {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(state => state.customers.customers);
  const refreshing = useAppSelector(state => state.customers.refreshing);
  const refreshError = useAppSelector(state => state.customers.refreshError);
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

  const errorMessage = refreshError
    ? customers.length === 0
      ? `Couldn't load users from the API. ${refreshError}`
      : `Showing saved users. ${refreshError}`
    : '';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <SlidingTabs tabs={LIST_TABS} progress={progress} onPress={goToPage} />
        <SearchButton
          open={searchOpen}
          active={query.length > 0}
          onPress={toggleSearch}
        />
      </View>

      {searchOpen ? (
        <SearchField value={query} onChangeText={setQuery} />
      ) : null}

      {refreshError ? <ErrorBanner message={errorMessage} /> : null}

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageScroll={event => {
          const { position, offset } = event.nativeEvent;
          progress.setValue(position + offset);
        }}
      >
        {LIST_TABS.map(tab => (
          <View key={tab} style={styles.page} collapsable={false}>
            <UserList
              customers={customers}
              tab={tab}
              query={query}
              refreshing={refreshing}
              onRefresh={() => {
                dispatch(refreshCustomers());
              }}
              onPressCustomer={onOpenCustomer}
            />
          </View>
        ))}
      </PagerView>

      <AddUserButton onPress={onAdd} />
    </SafeAreaView>
  );
}
