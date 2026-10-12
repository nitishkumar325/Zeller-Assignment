import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../theme';
import type { Customer, CustomerInput, UserRole } from '../types';
import { USER_ROLES } from '../types';
import { fullName } from '../utils/names';
import { hasFieldErrors, validateCustomerForm } from '../utils/validation';

type Props = {
  title: string;
  submitLabel: string;
  initial?: Customer;
  onClose: () => void;
  onSubmit: (input: CustomerInput) => void;
  onDelete?: () => void;
};

/**
 * Add and edit share this form.
 * Nothing is written until Create / Save, and only after the checks pass.
 */
export function UserFormScreen({
  title,
  submitLabel,
  initial,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const [firstName, setFirstName] = useState(initial?.firstName ?? '');
  const [lastName, setLastName] = useState(initial?.lastName ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [role, setRole] = useState<UserRole>(startingRole(initial));
  const [showErrors, setShowErrors] = useState(false);

  const draft: CustomerInput = { firstName, lastName, email, role };
  const errors = showErrors ? validateCustomerForm(draft) : {};

  const handleSubmit = () => {
    const nextErrors = validateCustomerForm(draft);
    if (hasFieldErrors(nextErrors)) {
      setShowErrors(true);
      return;
    }
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      role,
    });
  };

  const confirmDelete = () => {
    if (!onDelete || !initial) {
      return;
    }
    const name = fullName(initial) || 'this user';
    Alert.alert('Delete user', `Remove ${name} from this device?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close"
            testID="close-form">
            <Text style={styles.close}>✕</Text>
          </Pressable>

          <Text style={styles.title}>{title}</Text>

          <Field
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            error={errors.firstName}
            autoCapitalize="words"
            testID="first-name-input"
          />
          <Field
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            error={errors.lastName}
            autoCapitalize="words"
            testID="last-name-input"
          />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
            testID="email-input"
          />

          <Text style={styles.roleLabel}>User Role</Text>
          <View style={styles.roleRow}>
            {USER_ROLES.map(option => {
              const selected = option === role;
              return (
                <Pressable
                  key={option}
                  style={[styles.roleButton, selected && styles.roleSelected]}
                  onPress={() => setRole(option)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  testID={`role-${option}`}>
                  <Text
                    style={[styles.roleText, selected && styles.roleTextSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {onDelete ? (
            <Pressable onPress={confirmDelete} testID="delete-user-button">
              <Text style={styles.deleteText}>Delete User</Text>
            </Pressable>
          ) : null}
          <Pressable
            style={styles.submit}
            onPress={handleSubmit}
            accessibilityRole="button"
            testID="submit-user-button">
            <Text style={styles.submitText}>{submitLabel}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  autoCapitalize: 'none' | 'words';
  keyboardType?: 'default' | 'email-address';
  testID: string;
};

function Field({
  label,
  value,
  onChangeText,
  error,
  autoCapitalize,
  keyboardType,
  testID,
}: FieldProps) {
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
        testID={testID}
      />
      <View style={[styles.underline, error ? styles.underlineError : null]} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function startingRole(customer?: Customer): UserRole {
  if (customer?.role === 'Admin' || customer?.role === 'Manager') {
    return customer.role;
  }
  // The empty form in the mock has Manager selected.
  return 'Manager';
}

const androidTop = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: androidTop,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  close: {
    color: colors.blue,
    fontSize: 26,
    marginTop: 8,
    marginBottom: 18,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 28,
  },
  field: {
    marginBottom: 26,
  },
  input: {
    fontSize: 17,
    color: colors.text,
    paddingVertical: 8,
  },
  underline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D5D5DA',
  },
  underlineError: {
    backgroundColor: colors.danger,
    height: 1,
  },
  error: {
    marginTop: 6,
    color: colors.danger,
    fontSize: 13,
  },
  roleLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.track,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  roleSelected: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.blue,
  },
  roleText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '600',
  },
  roleTextSelected: {
    color: colors.blue,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  submit: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
