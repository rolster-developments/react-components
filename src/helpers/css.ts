export type ClassStatus = Record<string, string | boolean | undefined | null>;

export function renderClassStatus(
  base: string,
  status: ClassStatus = {},
  additionals?: string
): string {
  const resultClass = [base];

  Object.entries(status).forEach(([key, state]) => {
    if (state) {
      typeof state === 'string'
        ? resultClass.push(`${base}--${state}`)
        : resultClass.push(`${base}--${key}`);
    }
  });

  if (additionals) {
    resultClass.push(additionals);
  }

  return resultClass.join(' ').trim();
}
