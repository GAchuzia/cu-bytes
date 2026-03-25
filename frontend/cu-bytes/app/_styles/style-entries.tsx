import { StyleSheet } from 'react-native';

import { font, padH } from './dimensions';
import { colors, fontSans, radii } from './theme';

export const styles = StyleSheet.create({
  entryCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
    paddingHorizontal: padH,
    paddingVertical: 14,
  },

  rowCell: {
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(93),
    fontWeight: '500',
    lineHeight: font(93) * 1.45,
    marginBottom: 10,
  },

  rowLabel: {
    color: colors.textMuted,
    fontFamily: fontSans,
    fontSize: font(72),
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 2,
    textTransform: 'uppercase',
  },

  emptyHint: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    color: colors.textSecondary,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '500',
    paddingHorizontal: padH,
    paddingVertical: 20,
    textAlign: 'center',
  },
});
