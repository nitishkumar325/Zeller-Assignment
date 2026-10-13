import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export const styles = StyleSheet.create({
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
});
