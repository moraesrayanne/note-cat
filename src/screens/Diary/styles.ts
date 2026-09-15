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
  headerTexts: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text,
    lineHeight: 28,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: colors.primaryBgInput,
    shadowOpacity: 0,
    elevation: 0,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text,
    flex: 1,
  },
  energyBadge: {
    marginRight: 6,
  },
  energyLabel: {
    fontSize: 13,
    fontFamily: fonts.semibold,
  },
  feedingText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  chipGreen: {
    backgroundColor: '#ECFFF0',
  },
  chipRed: {
    backgroundColor: '#FFF5F5',
  },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  chipTextGreen: {
    color: colors.success,
  },
  chipTextRed: {
    color: '#E57373',
  },
  notesText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 17,
    fontFamily: fonts.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: fonts.semibold,
  },
});
