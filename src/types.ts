import 'react';

export type RlsTheme =
  | 'standard'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'berry'
  | 'hope'
  | 'mountains'
  | 'ross'
  | 'amaizing'
  | 'purple'
  | 'amber'
  | 'smartness'
  | 'obsidian'
  | 'neutral';

export type RlsAppTheme = 'light' | 'dim' | 'dark';

export type RlsDesignSystem = 'bordered' | 'filled' | 'gradient';

export type RlsButtonType = 'ghost' | 'flat' | 'raised';

export type RlsSize = 'normal' | 'small';

declare module 'react' {
  interface HTMLAttributes<T> {
    'rls-size'?: RlsSize;
    'rls-theme'?: RlsTheme;
  }
}
