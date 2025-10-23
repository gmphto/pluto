import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { zIndex } from './zIndex';

export const theme = {
  colors,
  spacing,
  typography,
  zIndex,
} as const;

export type Theme = typeof theme;

export { colors, spacing, typography, zIndex };
