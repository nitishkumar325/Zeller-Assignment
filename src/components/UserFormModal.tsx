import React from 'react';
import { Modal } from 'react-native';
import { UserFormScreen } from '../screens/UserFormScreen';
import type { Customer, CustomerInput } from '../types';

type Props = {
  visible: boolean;
  formKey: string;
  title: string;
  submitLabel: string;
  initial?: Customer;
  onClose: () => void;
  onSubmit: (input: CustomerInput) => void;
  onDelete?: () => void;
};

export function UserFormModal({
  visible,
  formKey,
  title,
  submitLabel,
  initial,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      {visible ? (
        <UserFormScreen
          key={formKey}
          title={title}
          submitLabel={submitLabel}
          initial={initial}
          onClose={onClose}
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      ) : null}
    </Modal>
  );
}
