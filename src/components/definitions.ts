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

export interface RlsComponent extends React.PropsWithChildren {
  className?: string;
  identifier?: string;
  rlsTheme?: RlsTheme;
}
