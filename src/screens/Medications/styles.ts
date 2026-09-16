import { StyleSheet } from 'react-native';
import { colors, fonts } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  medIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInactive: {
    opacity: 0.65,
  },
  medIconInactive: {
    backgroundColor: colors.mutedBg,
  },
  cardContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medName: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
    flexShrink: 1,
  },
  textInactive: {
    color: colors.textMuted,
  },
  statusTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: colors.successBg,
  },
  statusInactive: {
    backgroundColor: colors.mutedBg,
  },
  statusTagText: {
    fontSize: 10,
    fontFamily: fonts.bold,
  },
  statusActiveText: {
    color: colors.success,
  },
  statusInactiveText: {
    color: colors.textMuted,
  },
  medDose: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmDeleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  confirmDeleteText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  confirmCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.cancelBg,
  },
  confirmCancelText: {
    color: colors.text,
    fontSize: 11,
    fontFamily: fonts.semibold,
  },
  deleteIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
});
