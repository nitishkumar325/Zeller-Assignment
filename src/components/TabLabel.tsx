import React, { useMemo } from 'react';
import { Animated } from 'react-native';
import { colors } from '../theme';
import { styles } from './TabLabel.styles';

type Props = {
  label: string;
  index: number;
  progress: Animated.Value;
};

export function TabLabel({ label, index, progress }: Props) {
  const color = useMemo(
    () =>
      progress.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [colors.muted, colors.blue, colors.muted],
        extrapolate: 'clamp',
      }),
    [progress, index],
  );

  return (
    <Animated.Text style={[styles.label, { color }]}>{label}</Animated.Text>
  );
}
