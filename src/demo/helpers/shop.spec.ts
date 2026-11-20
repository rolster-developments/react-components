import { describe, expect, it } from 'vitest';

import { orderTotal, ratingStars } from './shop';

describe('ratingStars', () => {
  it('devuelve siempre cinco estrellas', () => {
    expect(ratingStars(4.5)).toHaveLength(5);
  });

  it('redondea a media estrella', () => {
    expect(ratingStars(4.5)).toEqual(['full', 'full', 'full', 'full', 'half']);
    expect(ratingStars(4.7)).toEqual(['full', 'full', 'full', 'full', 'half']);
    expect(ratingStars(4.2)).toEqual(['full', 'full', 'full', 'full', 'empty']);
  });

  it('acota por debajo y por encima', () => {
    expect(ratingStars(0)).toEqual(new Array(5).fill('empty'));
    expect(ratingStars(-3)).toEqual(new Array(5).fill('empty'));
    expect(ratingStars(9)).toEqual(new Array(5).fill('full'));
  });
});

describe('orderTotal', () => {
  it('suma envío al subtotal', () => {
    expect(orderTotal(78.99, 15)).toBe(93.99);
  });

  it('no arrastra error de coma flotante', () => {
    expect(orderTotal(0.1, 0.2)).toBe(0.3);
  });
});
