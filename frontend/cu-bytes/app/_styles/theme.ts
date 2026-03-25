import { Platform, StyleSheet } from 'react-native';

/** Full white chrome; muted surfaces for inputs / grouped rows only */
export const colors = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#FCF6F6',
  border: '#EBD9DA',
  borderStrong: '#D8AEB0',
  text: '#1A1D21',
  textSecondary: '#5C6370',
  textMuted: '#8E95A1',
  primary: '#C5151A',
  primaryPressed: '#9E1116',
  primaryMuted: '#F7E5E6',
  /** Filled CTA buttons (outline buttons use border + this for label) */
  buttonFill: '#C5151A',
  buttonFillPressed: '#9E1116',
  buttonOutlineLabel: '#C5151A',
  success: '#2D6A4F',
  successBg: '#D8F3DC',
  danger: '#C1121F',
  headerBar: '#FFF7F7',
  headerBtn: '#F6E9EA',
  headerBtnPressed: '#EDD3D5',
  bodyBtnDisabled: '#B8BCC4',
  overlayScrim: 'rgba(0,0,0,0.4)',
  scanAction: '#1B6B5C',
  scanActionPressed: '#145548',
  deleteSoft: '#FDE8E8',
  deleteSoftText: '#9E1116',
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
};

/** Max readable width on large screens (web / tablet) */
export const maxContentWidth = Platform.OS === 'web' ? 600 : undefined;

export const fontSans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: undefined,
});

export const sheetStyle = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
