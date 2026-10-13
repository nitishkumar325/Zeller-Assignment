import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './FormFooter.styles';

type Props = {
  submitLabel: string;
  onSubmit: () => void;
  onDelete?: () => void;
};

export function FormFooter({ submitLabel, onSubmit, onDelete }: Props) {
  return (
    <View style={styles.footer}>
      {onDelete ? (
        <Pressable onPress={onDelete} >
          <Text style={styles.deleteText}>Delete User</Text>
        </Pressable>
      ) : null}
      <Pressable
        style={styles.submit}
        onPress={onSubmit}
        accessibilityRole="button"
      >
        <Text style={styles.submitText}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
}
