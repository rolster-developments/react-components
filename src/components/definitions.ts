import { PropsWithChildren } from 'react';

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

export interface PropsWithClassName {
  className?: string;
}

export interface PropsWithRlsTheme {
  rlsTheme?: RlsTheme;
}

export interface RlsComponent extends PropsWithChildren<
  PropsWithRlsTheme & PropsWithClassName
> {
  identifier?: string;
}
