export type ClassStatus = Record<string, string | boolean | undefined | null>;

export function renderClassStatus(
  base: string,
  status: ClassStatus = {},
  additionals?: string
): string {
  const _classElement = [base];

  Object.entries(status).forEach(([key, state]) => {
    if (state) {
      _classElement.push(
        typeof state === 'string' ? `${base}--${state}` : `${base}--${key}`
      );
    }
  });

  if (additionals) {
    _classElement.push(additionals);
  }

  return _classElement.join(' ').trim();
}
