export type RlsTheme =
  | 'standard'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'amaizing'
  | 'smartness'
  | 'obsidian';

export interface RlsComponent extends React.PropsWithChildren {
  identifier?: string;
  rlsTheme?: RlsTheme;
}
