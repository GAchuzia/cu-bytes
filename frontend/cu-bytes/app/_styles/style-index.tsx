import { StyleSheet } from 'react-native';

import { colors, fontSans } from './theme';

/** Splash-only tweaks; layout + buttons match `screenChrome` (same as /home) */
export const styles = StyleSheet.create({
  brandTitle: {
    color: colors.primary,
    textAlign: 'center',
  },

  subtitleCenter: {
    textAlign: 'center',
  },

  taglineTight: {
    marginBottom: 4,
  },

  hintCenter: {
    color: colors.textMuted,
    fontFamily: fontSans,
    textAlign: 'center',
  },

  actionsStack: {
    alignSelf: 'stretch',
    gap: 12,
    marginTop: 4,
    width: '100%',
  },
});
