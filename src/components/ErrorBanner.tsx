import React from 'react';
import { Text } from 'react-native';
import { styles } from './ErrorBanner.styles';

type Props = {
  message: string;
};

export function ErrorBanner({ message }: Props) {
  return <Text style={styles.errorBanner}>{message}</Text>;
}
