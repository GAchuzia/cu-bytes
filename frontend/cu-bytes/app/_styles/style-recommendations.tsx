import { StyleSheet } from 'react-native';

import { contentWidth, font, w } from './dimensions';
import { colors, fontSans, radii } from './theme';

export const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    maxWidth: contentWidth as number,
  },

  numberOfItemsOrUsersText: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(150),
    fontWeight: '800',
    marginHorizontal: 12,
    minWidth: 56,
    paddingVertical: 12,
    textAlign: 'center',
  },

  bodyButtonIncreaseNumberOfItemsOrUsers: {
    alignItems: 'center',
    backgroundColor: colors.buttonFill,
    borderRadius: radii.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },

  bodyButtonDecreaseNumberOfItemsOrUsers: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },

  bodyButtonTextIncreaseNumberOfItemsOrUsers: {
    color: colors.surface,
    fontFamily: fontSans,
    fontSize: font(150),
    fontWeight: '700',
  },

  bodyButtonTextDecreaseNumberOfItemsOrUsers: {
    color: colors.text,
    fontFamily: fontSans,
    fontSize: font(150),
    fontWeight: '700',
  },

  innerStack: {
    alignSelf: 'center',
    maxWidth: contentWidth as number,
    width: w(100) as number,
  },
}) as any;
