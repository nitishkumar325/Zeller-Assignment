import React from 'react';
import { Pressable } from 'react-native';
import { colors } from '../theme';
import { SearchIcon } from './SearchIcon';
import { styles } from './SearchButton.styles';

type Props = {
  open: boolean;
  active: boolean;
  onPress: () => void;
};

export function SearchButton({ open, active, onPress }: Props) {
  return (
    <Pressable
      style={styles.searchButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={open ? 'Close search' : 'Search by name'}
    >
      <SearchIcon color={open || active ? colors.blue : colors.muted} />
    </Pressable>
  );
}
