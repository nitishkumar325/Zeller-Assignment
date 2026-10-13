import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
} from 'react-native';
import { CloseButton } from '../components/CloseButton';
import { FormField } from '../components/FormField';
import { FormFooter } from '../components/FormFooter';
import { RolePicker } from '../components/RolePicker';
import type { Customer, CustomerInput, UserRole } from '../types';
import { fullName } from '../utils/names';
import { hasFieldErrors, validateCustomerForm } from '../utils/validation';
import { styles } from './UserFormScreen.styles';

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

  const save = () => {
    const errs = validateCustomerForm(draft);
    if (hasFieldErrors(errs)) {
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <CloseButton onPress={onClose} />
          <Text style={styles.title}>{title}</Text>
          <FormField
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            error={errors.firstName}
            autoCapitalize="words"
          />
          <FormField
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            error={errors.lastName}
            autoCapitalize="words"
          />
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <RolePicker role={role} onChange={setRole} />
        </ScrollView>
        <FormFooter
          submitLabel={submitLabel}
          onSubmit={save}
          onDelete={onDelete ? confirmDelete : undefined}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function startingRole(customer?: Customer): UserRole {
  if (customer?.role === 'Admin' || customer?.role === 'Manager') {
    return customer.role;
  }
  // The empty form in the mock has Manager selected.
  return 'Manager';
}
