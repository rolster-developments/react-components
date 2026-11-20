import { describe, expect, it } from 'vitest';

import { categoryPercentage, productRevenue } from './store';

describe('productRevenue', () => {
  it('multiplica precio por ventas', () => {
    expect(productRevenue({ price: 950, sales: 12 })).toBe(11400);
  });

  it('sin ventas no hay ingreso', () => {
    expect(productRevenue({ price: 145 })).toBeUndefined();
  });

  it('con cero ventas el ingreso es cero, no indefinido', () => {
    expect(productRevenue({ price: 145, sales: 0 })).toBe(0);
  });

  it('redondea a dos decimales', () => {
    expect(productRevenue({ price: 84.4, sales: 3 })).toBe(253.2);
  });
});

describe('categoryPercentage', () => {
  it('convierte un valor en porcentaje del máximo', () => {
    expect(categoryPercentage(1500, 3000)).toBe(50);
  });

  it('acota a cien', () => {
    expect(categoryPercentage(9000, 3000)).toBe(100);
  });

  it('con máximo cero devuelve cero en vez de dividir por cero', () => {
    expect(categoryPercentage(10, 0)).toBe(0);
  });
});
