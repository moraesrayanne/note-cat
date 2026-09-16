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
  headerTexts: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.text,
    lineHeight: 24,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: fonts.regular,
    borderWidth: 2,
    borderColor: colors.primaryBgInput,
    color: colors.text,
  },
  notesInput: {
    minHeight: 90,
    paddingTop: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primaryBgInput,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
  },
  toggleButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  toggleButtonNo: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  toggleText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.textMuted,
  },
  toggleTextActive: {
    color: colors.primary,
  },
  toggleTextNo: {
    color: colors.error,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  emojiButton: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 56,
    borderRadius: 14,
    backgroundColor: colors.cardBg,
    borderWidth: 2,
    borderColor: colors.primaryBgInput,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  emojiText: {
    fontSize: 26,
  },
  bottomButtons: {
    marginTop: 8,
  },
  cancelText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 14,
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  deleteText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  deleteTextDisabled: {
    color: colors.textMuted,
  },
});
