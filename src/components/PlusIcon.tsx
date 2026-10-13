import React from 'react';
import { View } from 'react-native';
import { styles } from './PlusIcon.styles';

export function PlusIcon() {
  return (
    <View style={styles.plusWrap}>
      <View style={styles.plusBar} />
      <View style={[styles.plusBar, styles.plusBarVertical]} />
    </View>
  );
}
