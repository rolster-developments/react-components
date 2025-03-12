export type ClassStatus = Record<string, string | boolean | undefined | null>;

export function renderClassStatus(
  base: string,
  status: ClassStatus = {},
  additionals?: string
): string {
  const _classElement = [base];

  Object.entries(status).forEach(([key, state]) => {
    state &&
      (typeof state === 'string'
        ? _classElement.push(`${base}--${state}`)
        : _classElement.push(`${base}--${key}`));
  });

  additionals && _classElement.push(additionals);

  return _classElement.join(' ').trim();
}
