import { Job } from '../data/jobs';

const SEPARATOR = ' · ';

function amount(value: number): string {
  return `$${value.toLocaleString('en-US')}`;
}

export function searchSummary(parts: string[]): string {
  return parts.filter(Boolean).join(SEPARATOR);
}

export function jobSalaryLabel({
  period,
  salaryFrom,
  salaryTo
}: Job): string {
  const range = salaryTo
    ? `${amount(salaryFrom)} - ${amount(salaryTo)}`
    : amount(salaryFrom);

  return `${range} a ${period}`;
}
