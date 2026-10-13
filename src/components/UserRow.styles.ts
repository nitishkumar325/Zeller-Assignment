import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    backgroundColor: colors.background,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.avatar,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  initial: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: '600',
  },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  role: {
    marginLeft: 12,
    color: colors.section,
    fontSize: 15,
  },
});
