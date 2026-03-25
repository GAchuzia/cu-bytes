import { StyleSheet } from 'react-native';

import { font, padH } from './dimensions';
import { colors, fontSans, radii } from './theme';

export const styles = StyleSheet.create({
  settingsRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 14,
  },

  settingsRowLast: {
    borderBottomWidth: 0,
  },

  label: {
    color: colors.text,
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fontSans,
    fontSize: font(93),
    fontWeight: '500',
    lineHeight: font(93) * 1.35,
    paddingRight: 12,
  },

  labelBold: {
    fontWeight: '700',
    color: colors.text,
  },

  switchContainer: {
    alignItems: 'flex-end',
    minWidth: 52,
  },

  switchScale: {
    transform: [{ scale: 1.05 }],
  },

  dangerButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.md,
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 8,
    minHeight: 52,
    paddingHorizontal: padH,
    paddingVertical: 14,
  },

  dangerButtonText: {
    color: colors.primaryPressed,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '700',
  },
});
