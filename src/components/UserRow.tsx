import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import type { Customer } from '../types';
import { fullName, nameInitial } from '../utils/names';

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
      accessibilityHint="Opens the edit screen">
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    backgroundColor: colors.background,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.avatar,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  initial: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: '600',
  },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  role: {
    marginLeft: 12,
    color: colors.section,
    fontSize: 15,
  },
});
