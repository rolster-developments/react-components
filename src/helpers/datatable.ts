import { RlsTheme } from '../types';

export interface DatatableStatus {
  error?: boolean;
  info?: boolean;
  success?: boolean;
  warning?: boolean;
}

const STATUS_THEMES: [keyof DatatableStatus, RlsTheme][] = [
  ['error', 'danger'],
  ['warning', 'warning'],
  ['info', 'info'],
  ['success', 'success']
];

export function datatableStatusTheme(
  status: DatatableStatus
): RlsTheme | undefined {
  return STATUS_THEMES.find(([key]) => status[key])?.[1];
}
