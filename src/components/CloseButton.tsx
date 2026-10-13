import React from 'react';
import { Pressable, Text } from 'react-native';
import { styles } from './CloseButton.styles';

type Props = {
  onPress: () => void;
};

export function CloseButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Close"
    >
      <Text style={styles.close}>✕</Text>
    </Pressable>
  );
}
