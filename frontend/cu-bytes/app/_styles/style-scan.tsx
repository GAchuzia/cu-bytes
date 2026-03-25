import { StyleSheet } from 'react-native';

import { contentWidth, font, h, padH, w } from './dimensions';
import { colors, fontSans, radii } from './theme';

export const styles = StyleSheet.create({
  selectedFoodItemContainer: {
    alignSelf: 'stretch',
    marginBottom: 14,
    maxWidth: contentWidth as number,
    overflow: 'hidden',
  },

  lowConfidenceBanner: {
    alignSelf: 'stretch',
    backgroundColor: colors.primaryMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 14,
    paddingHorizontal: padH,
    paddingVertical: 14,
  },

  lowConfidenceTitle: {
    color: colors.primaryPressed,
    fontFamily: fontSans,
    fontSize: font(106),
    fontWeight: '700',
    marginBottom: 6,
  },

  lowConfidenceMessage: {
    color: colors.textSecondary,
    fontFamily: fontSans,
    fontSize: font(93),
    fontWeight: '500',
    lineHeight: font(93) * 1.35,
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

  placeholderText: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    color: colors.textMuted,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '500',
    marginBottom: 14,
    paddingVertical: h(10),
    textAlign: 'center',
  },

  foodImage: {
    alignSelf: 'center',
    borderRadius: radii.lg,
    height: 220,
    marginBottom: 14,
    width: Math.min(320, (contentWidth as number) || 320),
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
    overflow: 'hidden',
    paddingHorizontal: padH,
    paddingVertical: 14,
  },

  bodyButtonScanFood: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.buttonFill,
    borderRadius: radii.md,
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 52,
    paddingHorizontal: padH,
    paddingVertical: 14,
  },

  bodyButtonDeleteFood: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.deleteSoft,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 52,
    paddingHorizontal: padH,
    paddingVertical: 14,
  },

  bodyButtonDeleteFoodText: {
    color: colors.deleteSoftText,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '700',
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  innerStack: {
    alignItems: 'stretch',
    alignSelf: 'center',
    maxWidth: contentWidth as number,
    width: w(100),
  },
} as any);
