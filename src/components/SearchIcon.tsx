import React from 'react';
import { View } from 'react-native';
import { styles } from './SearchIcon.styles';

type Props = {
  color: string;
};

/** Small magnifying glass drawn with views, so we don't pull in an icon font. */
export function SearchIcon({ color }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.lens, { borderColor: color }]} />
      <View style={[styles.handle, { backgroundColor: color }]} />
    </View>
  );
}
