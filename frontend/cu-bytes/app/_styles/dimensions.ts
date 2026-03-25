import { Dimensions } from 'react-native';

import { maxContentWidth } from './theme';

const { width: W, height: H } = Dimensions.get('window');

let cachedIsWeb: boolean | null = null;

function isWeb(): boolean {
  if (cachedIsWeb !== null) return cachedIsWeb;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Platform } = require('react-native') as typeof import('react-native');
    cachedIsWeb = Platform?.OS === 'web';
  } catch {
    cachedIsWeb = typeof document !== 'undefined';
  }
  return cachedIsWeb;
}

/**
 * Width as a fraction of the window (e.g. w(80) ≈ 80% of width).
 * On web, use vw so static export + real phones agree (avoids SSR pixel snap pushing layout off-screen).
 */
export const w = (pct: number): number | string =>
  isWeb() ? `${pct}vw` : W * (pct / 100);

/** Height as a fraction of the window (e.g. h(15) ≈ 15% of height). */
export const h = (pct: number): number | string =>
  isWeb() ? `${pct}vh` : H * (pct / 100);

/** Font size: 100% = 16, 150% = 24, etc. */
export const font = (pct: number) => Math.round(16 * (pct / 100));

/** Horizontal inset for mobile-first content; full width on phone, capped on web */
export const contentWidth: number | string = isWeb()
  ? (maxContentWidth ?? '100%')
  : (maxContentWidth != null ? Math.min(W, maxContentWidth) : w(92));

export const padH = 20;
