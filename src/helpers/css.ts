export type ClassStatus = Record<string, string | boolean | undefined | null>;

export function renderClassStatus(
  base: string,
  status: ClassStatus = {},
  additionals?: string
): string {
  const classElement = [base];

  Object.entries(status).forEach(([key, state]) => {
    if (state) {
      classElement.push(
        typeof state === 'string' ? `${base}--${state}` : `${base}--${key}`
      );
    }
  });

  if (additionals) {
    classElement.push(additionals);
  }

  return classElement.join(' ').trim();
}
