import { RlsTheme } from '../../types';

export const PALETTE_THEMES: RlsTheme[] = [
  'standard',
  'primary',
  'secondary',
  'tertiary',
  'success',
  'info',
  'warning',
  'danger',
  'berry',
  'ross',
  'hope',
  'mountains',
  'amaizing',
  'purple',
  'amber',
  'smartness',
  'obsidian',
  'neutral'
];

export const PALETTE_STEPS = [
  '050',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950'
];

export const REFERENCE_STEP = '500';

export interface LayerToken {
  label: string;
  token: string;
}

export const THEME_LAYER: LayerToken[] = [
  { label: 'background-100', token: '--rls-theme-background-100' },
  { label: 'background-200', token: '--rls-theme-background-200' },
  { label: 'background-300', token: '--rls-theme-background-300' },
  { label: 'background-400', token: '--rls-theme-background-400' },
  { label: 'background-500', token: '--rls-theme-background-500' },
  { label: 'font-color-100', token: '--rls-theme-font-color-100' },
  { label: 'skeleton-200', token: '--rls-theme-skeleton-200' },
  { label: 'backdrop-400', token: '--rls-theme-backdrop-400' }
];
