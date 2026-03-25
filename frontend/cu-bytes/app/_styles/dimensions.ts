import { Dimensions, Platform } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

/**
 * Width as a fraction of the window (e.g. w(80) ≈ 80% of width).
 * On web, use vw so static export + real phones agree (avoids SSR pixel snap pushing layout off-screen).
 */
export const w = (pct: number): number | string =>
  Platform.OS === 'web' ? `${pct}vw` : W * (pct / 100);

/** Height as a fraction of the window (e.g. h(15) ≈ 15% of height). */
export const h = (pct: number): number | string =>
  Platform.OS === 'web' ? `${pct}vh` : H * (pct / 100);

/** Font size: 100% = 16, 150% = 24, etc. */
export const font = (pct: number) => Math.round(16 * (pct / 100));
