import { Dimensions, StyleSheet } from 'react-native';
import { colors, fonts } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STRIP_H_PADDING = 24;
export const ITEM_GAP = 5;
export const ITEM_WIDTH = (SCREEN_WIDTH - STRIP_H_PADDING - ITEM_GAP * 2) / 7;

export const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: STRIP_H_PADDING,
    gap: ITEM_GAP,
  },
  item: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 1,
  },
  itemEnabled: {
    borderColor: colors.primaryBorder,
  },
  itemDisabled: {
    opacity: 0.4,
  },
  itemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  weekday: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  day: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  month: {
    fontSize: 9,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  textSelected: {
    color: '#FFFFFF',
  },
  dots: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 3,
    height: 6,
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  dotTaken: {
    backgroundColor: colors.success,
  },
  dotMissed: {
    backgroundColor: colors.primary,
  },
  dotTakenSelected: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  dotMissedSelected: {
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
});
