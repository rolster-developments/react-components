export type RlsTheme =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'berry'
  | 'mountains'
  | 'amaizing'
  | 'amber'
  | 'smartness'
  | 'obsidian';

export interface RlsComponent extends React.PropsWithChildren {
  identifier?: string;
  rlsTheme?: RlsTheme;
}
