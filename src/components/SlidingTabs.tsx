import React, { useMemo, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { styles } from './SlidingTabs.styles';
import { TabLabel } from './TabLabel';

type Props = {
  tabs: readonly string[];
  // 0 is the first tab. A swipe reports values like 0.4 while the finger moves.
  progress: Animated.Value;
  onPress: (index: number) => void;
};

/**
 * The pill tab control from the mock.
 * `progress` is driven by the pager, so the highlight slides with the swipe.
 */
export function SlidingTabs({ tabs, progress, onPress }: Props) {
  const [width, setWidth] = useState(0);
  const tabWidth = width > 0 ? width / tabs.length : 0;
  const last = Math.max(tabs.length - 1, 1);

  const slide = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, last],
        outputRange: [0, tabWidth * last],
        extrapolate: 'clamp',
      }),
    [progress, tabWidth, last],
  );

  return (
    <View
      style={styles.track}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
    >
      {tabWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            { width: tabWidth - 8, transform: [{ translateX: slide }] },
          ]}
        />
      ) : null}
      {tabs.map((label, index) => (
        <Pressable
          key={label}
          style={styles.tab}
          onPress={() => onPress(index)}
        >
          <TabLabel label={label} index={index} progress={progress} />
        </Pressable>
      ))}
    </View>
  );
}
