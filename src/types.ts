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
  | 'obsidian';

export type RlsAppTheme = 'light' | 'dark';

export type RlsDesignSystem = 'bordered' | 'filled' | 'gradient';

export type RlsButtonType = 'ghost' | 'flat' | 'raised';

declare module 'react' {
  interface HTMLAttributes<T> {
    'rls-theme'?: RlsTheme;
  }
}
