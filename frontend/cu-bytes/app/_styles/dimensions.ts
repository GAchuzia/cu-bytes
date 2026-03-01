import { Dimensions } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

/** Width as percentage of screen (e.g. w(80) => 80%) */
export const w = (pct: number) => W * (pct / 100);
/** Height as percentage of screen */
export const h = (pct: number) => H * (pct / 100);
/** Font size: 100% = 16, 150% = 24, etc. */
export const font = (pct: number) => Math.round(16 * (pct / 100));
