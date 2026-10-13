import React from 'react';
import { Text } from 'react-native';
import { styles } from './SectionHeader.styles';

type Props = {
  title: string;
};

export function SectionHeader({ title }: Props) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}
