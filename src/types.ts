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

export type RlsDesignSystem = 'bordered' | 'filled';

export type RlsButtonType =
  | 'classic'
  | 'raised'
  | 'flat'
  | 'stroked'
  | 'outline'
  | 'ghost'
  | 'gradient';

declare module 'react' {
  interface HTMLAttributes<T> {
    'rls-theme'?: RlsTheme;
  }
}
