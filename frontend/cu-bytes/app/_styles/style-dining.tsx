import { StyleSheet } from 'react-native';

import { contentWidth, font, h, padH } from './dimensions';
import { colors, fontSans, radii } from './theme';

export const styles = StyleSheet.create({
  selectedFoodItemContainer: {
    alignSelf: 'stretch',
    marginBottom: 14,
    maxWidth: contentWidth as number,
    overflow: 'hidden',
  },

  listStack: {
    alignSelf: 'stretch',
    marginBottom: 14,
    maxWidth: contentWidth as number,
  },

  listRowText: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '600',
    paddingHorizontal: padH,
    paddingVertical: 14,
  },

  emptyState: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    color: colors.textMuted,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '500',
    marginBottom: 14,
    paddingVertical: h(6),
    textAlign: 'center',
  },

  savedFoodItemMessageContainer: {
    alignItems: 'center',
    backgroundColor: colors.overlayScrim,
    flex: 1,
    justifyContent: 'center',
    padding: padH,
  },

  savedFoodItemInner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 320,
    paddingHorizontal: 20,
    paddingVertical: 18,
    width: '100%',
  },

  savedFoodItemText: {
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(112),
    fontWeight: '700',
    textAlign: 'center',
  },
});
