import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export const styles = StyleSheet.create({
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 4,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    fontSize: 16,
    color: colors.text,
  },
});
