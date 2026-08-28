const FALLBACK_REM_SIZE = 16;

export type ClassStatus = Record<string, string | boolean | undefined | null>;

export function getRemSize(): number {
  if (typeof window === 'undefined') {
    return FALLBACK_REM_SIZE;
  }

  const fontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );

  return fontSize > 0 ? fontSize : FALLBACK_REM_SIZE;
}

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
