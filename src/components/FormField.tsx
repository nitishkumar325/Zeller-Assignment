import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors } from '../theme';
import { styles } from './FormField.styles';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  autoCapitalize: 'none' | 'words';
  keyboardType?: 'default' | 'email-address';
};

export function FormField({
  label,
  value,
  onChangeText,
  error,
  autoCapitalize,
  keyboardType,
}: Props) {
  return (
    <View style={styles.field}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        keyboardType={keyboardType}
      />
      <View style={[styles.underline, error ? styles.underlineError : null]} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
