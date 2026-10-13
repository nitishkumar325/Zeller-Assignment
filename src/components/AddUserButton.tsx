import React from 'react';
import { Pressable } from 'react-native';
import { PlusIcon } from './PlusIcon';
import { styles } from './AddUserButton.styles';

type Props = {
  onPress: () => void;
};

export function AddUserButton({ onPress }: Props) {
  return (
    <Pressable
      style={styles.fab}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add user"
    >
      <PlusIcon />
    </Pressable>
  );
}
