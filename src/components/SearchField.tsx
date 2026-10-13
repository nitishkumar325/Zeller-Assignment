import React from 'react';
import { TextInput } from 'react-native';
import { colors } from '../theme';
import { styles } from './SearchField.styles';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchField({ value, onChangeText }: Props) {
  return (
    <TextInput
      style={styles.searchInput}
      value={value}
      onChangeText={onChangeText}
      placeholder="Search by name"
      placeholderTextColor={colors.placeholder}
      autoFocus
      autoCorrect={false}
      autoCapitalize="none"
      clearButtonMode="while-editing"
    />
  );
}
