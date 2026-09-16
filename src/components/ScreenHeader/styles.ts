import { StyleSheet } from 'react-native';
import { colors, fonts } from '@/theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 4,
  },
});
