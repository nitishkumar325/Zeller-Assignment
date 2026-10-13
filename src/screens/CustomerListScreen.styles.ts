import { Platform, StatusBar, StyleSheet } from 'react-native';
import { colors } from '../theme';

const androidTop = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: androidTop,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
});
