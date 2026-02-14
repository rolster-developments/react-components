import { PropsWithChildren } from 'react';

export type RlsTheme =
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

export interface PropsWithRlsTheme {
  rlsTheme?: RlsTheme;
}

export interface RlsComponent extends PropsWithChildren<PropsWithRlsTheme> {
  className?: string;
  identifier?: string;
}
