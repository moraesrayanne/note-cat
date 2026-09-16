import { StyleSheet } from 'react-native';
import { colors, fonts } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  photoContainer: {
    alignSelf: 'center',
    marginBottom: 12,
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.bold,
    textAlign: 'center',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginBottom: 32,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    fontFamily: fonts.regular,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primaryBgInput,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  switchText: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontFamily: fonts.medium,
  },
});
