import { describe, expect, it } from 'vitest';

import { BUDGETS, EMPLOYEES } from './employees';

describe('EMPLOYEES', () => {
  it('trae las diez filas del Figma', () => {
    expect(EMPLOYEES).toHaveLength(10);
    expect(EMPLOYEES[0]).toMatchObject({
      name: 'Roman Bellic',
      email: 'purchaseuikits@setproduct.com',
      role: 'Art Director',
      status: 'free'
    });
  });

  it('no repite identificadores', () => {
    expect(new Set(EMPLOYEES.map(({ id }) => id)).size).toBe(EMPLOYEES.length);
  });
});

describe('BUDGETS', () => {
  it('guarda los importes como número, sin formatear', () => {
    BUDGETS.forEach(({ value }) => expect(typeof value).toBe('number'));
    expect(BUDGETS.map(({ value }) => value)).toEqual([
      74994, 12315.89, 3476.15, 777
    ]);
  });

  it('marca Monthly Budget como la activa', () => {
    expect(BUDGETS.filter(({ active }) => active)).toHaveLength(1);
    expect(BUDGETS.find(({ active }) => active)?.label).toBe('Monthly Budget');
  });
});
