import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrap: {
    width: 22,
    height: 22,
  },
  lens: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    marginTop: 1,
    marginLeft: 1,
  },
  handle: {
    position: 'absolute',
    width: 7,
    height: 2,
    borderRadius: 1,
    right: 1,
    bottom: 3,
    transform: [{ rotate: '45deg' }],
  },
});
