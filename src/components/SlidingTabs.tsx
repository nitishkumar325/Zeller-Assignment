import React, { useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

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
      onLayout={event => setTrackWidth(event.nativeEvent.layout.width)}>
      {tabWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.pill, { width: tabWidth - 8, transform: [{ translateX }] }]}
        />
      ) : null}
      {tabs.map((label, index) => (
        <Pressable
          key={label}
          style={styles.tab}
          onPress={() => onPress(index)}
          accessibilityRole="button"
          accessibilityLabel={label}
          testID={`tab-${label}`}>
          <TabLabel label={label} index={index} progress={progress} />
        </Pressable>
      ))}
    </View>
  );
}

type LabelProps = {
  label: string;
  index: number;
  progress: Animated.Value;
};

function TabLabel({ label, index, progress }: LabelProps) {
  const color = useMemo(
    () =>
      progress.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [colors.muted, colors.blue, colors.muted],
        extrapolate: 'clamp',
      }),
    [progress, index],
  );

  return <Animated.Text style={[styles.label, { color }]}>{label}</Animated.Text>;
}

const styles = StyleSheet.create({
  track: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.track,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 18,
    backgroundColor: colors.blueSoft,
    borderWidth: 1.5,
    borderColor: colors.blue,
  },
  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
