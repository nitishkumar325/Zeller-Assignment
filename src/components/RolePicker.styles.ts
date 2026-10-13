import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export const styles = StyleSheet.create({
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
});
