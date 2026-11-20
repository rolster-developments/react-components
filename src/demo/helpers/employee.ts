import { RlsTheme } from '../../types';
import { EmployeeStatus } from '../data/employees';

const STATUS_THEME: Record<EmployeeStatus, RlsTheme> = {
  free: 'info',
  busy: 'danger',
  working: 'neutral',
  vacation: 'warning'
};

const STATUS_LABEL: Record<EmployeeStatus, string> = {
  free: 'Free',
  busy: 'Busy',
  working: 'Working',
  vacation: 'On Vacation'
};

export function employeeInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return '';
  }

  const first = words[0].charAt(0);

  return words.length > 1
    ? `${first}${words[words.length - 1].charAt(0)}`.toUpperCase()
    : first.toUpperCase();
}

export function employeeStatusTheme(status: EmployeeStatus): RlsTheme {
  return STATUS_THEME[status] ?? 'neutral';
}

export function employeeStatusLabel(status: EmployeeStatus): string {
  return STATUS_LABEL[status] ?? '';
}
