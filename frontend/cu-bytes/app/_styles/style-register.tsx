import { StyleSheet } from 'react-native';

import { font } from './dimensions';
import { colors, fontSans, radii } from './theme';

export const styles = StyleSheet.create({
  requirementsBlock: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  requirementsSectionTitle: {
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(93),
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },

  requirementsSectionTitleFirst: {
    marginTop: 0,
  },

  requirementsLine: {
    color: colors.textSecondary,
    fontFamily: fontSans,
    fontSize: font(87),
    fontWeight: '500',
    lineHeight: font(87) * 1.4,
    marginBottom: 4,
  },
});
