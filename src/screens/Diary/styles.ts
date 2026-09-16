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

  // ── Entry group ───────────────────────────────────────────────
  entryGroup: {
    marginBottom: 20,
  },

  // ── Big white card (fully tappable) ──────────────────────────
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  // Date row inside the card
  cardDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    paddingBottom: 4,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionDateText: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  // ── Mini card: Alimentação (salmon) ───────────────────────────
  feedingMiniCard: {
    backgroundColor: colors.primaryBg,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  feedingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  feedingLabelText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  feedingText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
    lineHeight: 20,
  },

  // ── Grid row: Disposição + Caixinha ──────────────────────────
  gridRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // Each grid mini card
  gridMiniCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  disposicaoCard: {
    backgroundColor: colors.primaryBg,
  },
  caixinhaCardGreen: {
    backgroundColor: colors.successBg,
  },
  caixinhaCardRed: {
    backgroundColor: colors.errorBg,
  },

  gridEmoji: {
    fontSize: 26,
    lineHeight: 32,
  },
  gridCellLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  gridCellValue: {
    fontSize: 14,
    fontFamily: fonts.semibold,
  },
  gridCellValueGood: {
    color: colors.primary,
  },
  gridCellValueBad: {
    color: colors.error,
  },
  gridCellValueNormal: {
    color: colors.textMuted,
  },
  gridCellValueGreen: {
    color: colors.success,
  },

  // ── Mini card: Pressão ────────────────────────────────────────
  bpMiniCard: {
    backgroundColor: '#FFF5F2',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  bpLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bpValue: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.text,
  },

  // ── Mini card: Notas ──────────────────────────────────────────
  notesMiniCard: {
    backgroundColor: colors.primaryBg,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  notesText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.primary,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 18,
    opacity: 0.75,
  },

  // ── Empty state ───────────────────────────────────────────────
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
