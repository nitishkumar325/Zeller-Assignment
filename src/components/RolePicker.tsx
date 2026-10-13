import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { UserRole } from '../types';
import { USER_ROLES } from '../types';
import { styles } from './RolePicker.styles';

type Props = {
  role: UserRole;
  onChange: (role: UserRole) => void;
};

export function RolePicker({ role, onChange }: Props) {
  return (
    <View>
      <Text style={styles.roleLabel}>User Role</Text>
      <View style={styles.roleRow}>
        {USER_ROLES.map(option => {
          const selected = option === role;
          return (
            <Pressable
              key={option}
              style={[styles.roleButton, selected && styles.roleSelected]}
              onPress={() => onChange(option)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text
                style={[styles.roleText, selected && styles.roleTextSelected]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
