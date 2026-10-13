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
  const [trackWidth, setTrackWidth] = useState(0);
  const tabWidth = trackWidth > 0 ? trackWidth / tabs.length : 0;

  const translateX = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, Math.max(tabs.length - 1, 1)],
        outputRange: [0, tabWidth * Math.max(tabs.length - 1, 1)],
        extrapolate: 'clamp',
      }),
    [progress, tabWidth, tabs.length],
  );

  return (
    <View
      style={styles.track}
      onLayout={event => setTrackWidth(event.nativeEvent.layout.width)}
    >
      {tabWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            { width: tabWidth - 8, transform: [{ translateX }] },
          ]}
        />
      ) : null}
      {tabs.map((label, index) => (
        <Pressable
          key={label}
          style={styles.tab}
          onPress={() => onPress(index)}
          accessibilityRole="button"
          accessibilityLabel={label}
        >
          <TabLabel label={label} index={index} progress={progress} />
        </Pressable>
      ))}
    </View>
  );
}
