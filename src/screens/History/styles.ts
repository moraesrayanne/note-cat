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
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  sectionCount: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  logItem: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  checkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.successBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logContent: {
    flex: 1,
  },
  logMed: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  logDose: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  logTime: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  loadMore: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreText: {
    color: colors.primary,
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
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
    textAlign: 'center',
  },
});
