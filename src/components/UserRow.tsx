import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Customer } from '../types';
import { fullName, nameInitial } from '../utils/names';
import { styles } from './UserRow.styles';

type Props = {
  customer: Customer;
  onPress: () => void;
};

/** One person in the list. Tapping opens the edit form. */
export function UserRow({ customer, onPress }: Props) {
  const name = fullName(customer);

  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${customer.role}`}
      accessibilityHint="Opens the edit screen"
    >
      <View style={styles.avatar}>
        <Text style={styles.initial}>{nameInitial(customer)}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      {customer.role ? <Text style={styles.role}>{customer.role}</Text> : null}
    </Pressable>
  );
}
