import { StyleSheet } from 'react-native';

import { font, padH } from './dimensions';
import { colors, fontSans, radii } from './theme';

/** Home-only styles; common chrome lives in `screenChrome` */
export const styles = StyleSheet.create({
  notConfiguredSettingsOuter: {
    alignItems: 'center',
    backgroundColor: colors.overlayScrim,
    flex: 1,
    justifyContent: 'center',
    padding: padH,
  },

  notConfiguredSettingsInner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 340,
    paddingHorizontal: padH,
    paddingVertical: 18,
    width: '100%',
  },

  notConfiguredSettingsText: {
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(100),
    fontWeight: '600',
    textAlign: 'center',
  },
});
