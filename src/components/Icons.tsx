import React from 'react';
import { StyleSheet, View } from 'react-native';

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

export function PlusIcon() {
  return (
    <View style={styles.plusWrap}>
      <View style={styles.plusBar} />
      <View style={[styles.plusBar, styles.plusBarVertical]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 22,
    height: 22,
  },
  lens: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    marginTop: 1,
    marginLeft: 1,
  },
  handle: {
    position: 'absolute',
    width: 7,
    height: 2,
    borderRadius: 1,
    right: 1,
    bottom: 3,
    transform: [{ rotate: '45deg' }],
  },
  plusWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBar: {
    position: 'absolute',
    width: 18,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  plusBarVertical: {
    width: 2.5,
    height: 18,
  },
});
