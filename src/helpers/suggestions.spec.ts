import { describe, expect, it } from 'vitest';

import { filterByPattern } from './suggestions';

const elements = [
  { description: 'Acción requerida' },
  { description: 'Cancelado' },
  { description: 'En progreso' }
];

describe('filterByPattern', () => {
  it('should return every element when the pattern is empty', () => {
    expect(filterByPattern(elements, '')).toBe(elements);
  });

  it('should match ignoring case and accents', () => {
    expect(filterByPattern(elements, 'ACCION')).toEqual([
      { description: 'Acción requerida' }
    ]);
  });

  it('should match a fragment anywhere in the description', () => {
    expect(filterByPattern(elements, 'gres')).toEqual([
      { description: 'En progreso' }
    ]);
  });

  it('should not mutate the original list', () => {
    filterByPattern(elements, 'can');

    expect(elements).toHaveLength(3);
  });
});
