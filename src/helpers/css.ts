export type ClassStatus = Record<string, string | boolean | undefined | null>;

export function renderClassStatus(
  base: string,
  status: ClassStatus = {},
  additionals?: string
): string {
  const resultClass = [base];

  Object.entries(status).forEach(([name, value]) => {
    if (value) {
      typeof value === 'string'
        ? resultClass.push(`${base}--${value}`)
        : resultClass.push(`${base}--${name}`);
    }
  });

  if (additionals) {
    resultClass.push(additionals);
  }

  return resultClass.join(' ');
}
