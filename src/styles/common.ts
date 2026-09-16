import { StyleSheet } from 'react-native';
import { colors, fonts } from '@/theme';

export const commonStyles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '300',
    marginTop: -2,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: colors.primaryBgInput,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  saveTextDisabled: {
    color: colors.textDisabled,
  },
});
