import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import { contentWidth, font, h, padH, w } from './dimensions';
import { colors, fontSans, radii } from './theme';

const viewChrome = StyleSheet.create({
  safeRoot: {
    backgroundColor: colors.bg,
    flex: 1,
  } as ViewStyle,

  container: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    flex: 1,
    width: w(100),
  } as ViewStyle,

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
  } as ViewStyle,

  headerButton: {
    alignItems: 'center',
    backgroundColor: colors.headerBtn,
    borderRadius: radii.sm,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 68,
    paddingHorizontal: 10,
    paddingVertical: 6,
  } as ViewStyle,

  headerButtonPressed: {
    backgroundColor: colors.headerBtnPressed,
  } as ViewStyle,

  headerButtonDisabled: {
    opacity: 0.45,
  } as ViewStyle,

  scrollView: {
    alignSelf: 'stretch',
    backgroundColor: colors.bg,
    flex: 1,
  } as ViewStyle,

  scrollContent: {
    alignItems: 'stretch',
    alignSelf: 'center',
    flexGrow: 1,
    maxWidth: contentWidth as number,
    paddingBottom: h(5),
    paddingHorizontal: padH,
    paddingTop: 10,
    width: w(100),
  } as ViewStyle,

  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
    overflow: 'hidden',
  } as ViewStyle,

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
  } as ViewStyle,

  bodyButtonPressed: {
    backgroundColor: colors.buttonFillPressed,
  } as ViewStyle,

  bodyButtonDisabled: {
    backgroundColor: colors.bodyBtnDisabled,
  } as ViewStyle,

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
  } as ViewStyle,

  row: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  } as ViewStyle,

  rowLast: {
    borderBottomWidth: 0,
  } as ViewStyle,

  toastModalOuter: {
    alignItems: 'center',
    backgroundColor: colors.overlayScrim,
    flex: 1,
    justifyContent: 'center',
    padding: padH,
  } as ViewStyle,

  toastModalInner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 340,
    paddingHorizontal: 20,
    paddingVertical: 18,
    width: '100%',
  } as ViewStyle,

  formCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.bg,
    marginTop: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  } as ViewStyle,

  textInput: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    // Note: TextInput styles are actually TextStyle-compatible, but `ViewStyle`
    // is fine here because the actual used props are layout + colors.
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(100),
    marginBottom: 12,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  } as ViewStyle,

  switchRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 4,
  } as ViewStyle,

  switchScale: {
    transform: [{ scale: 1.05 }],
  } as ViewStyle,
});

const textChrome = StyleSheet.create({
  headerButtonText: {
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(87),
    fontWeight: '600',
  } as TextStyle,

  userPill: {
    color: colors.textSecondary,
    flex: 1,
    fontFamily: fontSans,
    fontSize: font(87),
    fontWeight: '600',
    marginHorizontal: 8,
    textAlign: 'center',
  } as TextStyle,

  pageTitle: {
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(175),
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  } as TextStyle,

  pageSubtitle: {
    color: colors.textSecondary,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '500',
    lineHeight: font(100) * 1.35,
    marginBottom: h(2),
  } as TextStyle,

  bodyButtonText: {
    color: colors.surface,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '700',
    textAlign: 'center',
  } as TextStyle,

  bodyButtonOutlineText: {
    color: colors.buttonOutlineLabel,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '700',
    textAlign: 'center',
  } as TextStyle,

  rowCellLabel: {
    backgroundColor: colors.surface,
    color: colors.textSecondary,
    flex: 2,
    fontFamily: fontSans,
    fontSize: font(93),
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingVertical: 12,
  } as TextStyle,

  rowCellValue: {
    backgroundColor: colors.surface,
    color: colors.text,
    flex: 3,
    fontFamily: fontSans,
    fontSize: font(93),
    fontWeight: '500',
    paddingHorizontal: 14,
    paddingVertical: 12,
  } as TextStyle,

  toastModalText: {
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '600',
    textAlign: 'center',
  } as TextStyle,

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
  } as TextStyle,

  switchLabel: {
    color: colors.textSecondary,
    flex: 1,
    fontFamily: fontSans,
    fontSize: font(93),
    fontWeight: '500',
    paddingRight: 12,
  } as TextStyle,

  helperText: {
    alignSelf: 'stretch',
    color: colors.textSecondary,
    fontFamily: fontSans,
    fontSize: font(93),
    marginBottom: 12,
    textAlign: 'center',
  } as TextStyle,

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
  } as TextStyle,
});

/** Single export for existing `sc.*` call sites. */
export const screenChrome = {
  ...viewChrome,
  ...textChrome,
};
