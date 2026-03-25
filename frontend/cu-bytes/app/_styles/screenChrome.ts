import { StyleSheet } from 'react-native';

import { contentWidth, font, h, padH, w } from './dimensions';
import { colors, fontSans, radii } from './theme';

/** Shared layout tokens for logged-in style screens */
export const screenChrome = StyleSheet.create({
  safeRoot: {
    backgroundColor: colors.bg,
    flex: 1,
  },

  container: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    flex: 1,
    width: w(100),
  },

  topBar: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.headerBar,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: padH,
    paddingTop: 0,
  },

  headerButton: {
    alignItems: 'center',
    backgroundColor: colors.headerBtn,
    borderRadius: radii.sm,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 68,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  headerButtonPressed: {
    backgroundColor: colors.headerBtnPressed,
  },

  headerButtonDisabled: {
    opacity: 0.45,
  },

  headerButtonText: {
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(87),
    fontWeight: '600',
  },

  userPill: {
    color: colors.textSecondary,
    flex: 1,
    fontFamily: fontSans,
    fontSize: font(87),
    fontWeight: '600',
    marginHorizontal: 8,
    textAlign: 'center',
  },

  scrollView: {
    alignSelf: 'stretch',
    backgroundColor: colors.bg,
    flex: 1,
  },

  scrollContent: {
    alignItems: 'stretch',
    alignSelf: 'center',
    flexGrow: 1,
    maxWidth: contentWidth as number,
    paddingBottom: h(5),
    paddingHorizontal: padH,
    paddingTop: 10,
    width: w(100),
  },

  pageTitle: {
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(175),
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },

  pageSubtitle: {
    color: colors.textSecondary,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '500',
    lineHeight: font(100) * 1.35,
    marginBottom: h(2),
  },

  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
    overflow: 'hidden',
  },

  bodyButton: {
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

  bodyButtonPressed: {
    backgroundColor: colors.buttonFillPressed,
  },

  bodyButtonDisabled: {
    backgroundColor: colors.bodyBtnDisabled,
  },

  bodyButtonText: {
    color: colors.surface,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '700',
    textAlign: 'center',
  },

  bodyButtonOutline: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 52,
    paddingHorizontal: padH,
    paddingVertical: 14,
  },

  bodyButtonOutlineText: {
    color: colors.buttonOutlineLabel,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '700',
    textAlign: 'center',
  },

  row: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },

  rowLast: {
    borderBottomWidth: 0,
  },

  rowCellLabel: {
    backgroundColor: colors.surface,
    color: colors.textSecondary,
    flex: 2,
    fontFamily: fontSans,
    fontSize: font(93),
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  rowCellValue: {
    backgroundColor: colors.surface,
    color: colors.text,
    flex: 3,
    fontFamily: fontSans,
    fontSize: font(93),
    fontWeight: '500',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  toastModalOuter: {
    alignItems: 'center',
    backgroundColor: colors.overlayScrim,
    flex: 1,
    justifyContent: 'center',
    padding: padH,
  },

  toastModalInner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 340,
    paddingHorizontal: 20,
    paddingVertical: 18,
    width: '100%',
  },

  toastModalText: {
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '600',
    textAlign: 'center',
  },

  formCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.bg,
    marginTop: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  textInput: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(100),
    marginBottom: 12,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  switchRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 4,
  },

  switchLabel: {
    color: colors.textSecondary,
    flex: 1,
    fontFamily: fontSans,
    fontSize: font(93),
    fontWeight: '500',
    paddingRight: 12,
  },

  helperText: {
    alignSelf: 'stretch',
    color: colors.textSecondary,
    fontFamily: fontSans,
    fontSize: font(93),
    marginBottom: 12,
    textAlign: 'center',
  },

  errorBanner: {
    alignSelf: 'stretch',
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    color: colors.primaryPressed,
    fontFamily: fontSans,
    fontSize: font(93),
    fontWeight: '600',
    marginBottom: 12,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: 'center',
  },

  switchScale: {
    transform: [{ scale: 1.05 }],
  },
});
