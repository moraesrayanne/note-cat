import { StyleSheet } from 'react-native';
import { colors, fonts } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  formContent: {
    flex: 1,
  },
  bottomButtons: {
    marginTop: 8,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primaryBgLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 28,
    marginTop: 8,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: fonts.regular,
    borderWidth: 2,
    borderColor: colors.primaryBgInput,
    color: colors.text,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.primaryBgInput,
  },
  switchControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 13,
    fontFamily: fonts.bold,
  },
  switchLabelActive: {
    color: colors.primary,
  },
  switchLabelInactive: {
    color: colors.textMuted,
  },
  switchDescription: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  timeInput: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    fontSize: 24,
    fontFamily: fonts.semibold,
    borderWidth: 2,
    borderColor: colors.primaryBgInput,
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 4,
  },
  cancelText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontFamily: fonts.medium,
  },
});
