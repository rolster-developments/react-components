import { describe, expect, it } from 'vitest';

import { paletteToken, rgbToHex, sortByHue, srgbToOklch } from './palette';

describe('paletteToken', () => {
  it('arma el nombre del token de un escalón', () => {
    expect(paletteToken('berry', '500')).toBe('--rls-berry-color-500');
  });

  it('respeta el cero a la izquierda del escalón más claro', () => {
    expect(paletteToken('amaizing', '050')).toBe('--rls-amaizing-color-050');
  });
});

describe('rgbToHex', () => {
  it('convierte el rgb que devuelve el navegador', () => {
    expect(rgbToHex('rgb(189, 143, 0)')).toBe('#bd8f00');
  });

  it('acepta espacios de más y rgba', () => {
    expect(rgbToHex('rgba( 0 , 178 , 131 , 1 )')).toBe('#00b283');
  });

  it('devuelve cadena vacía cuando no hay color que leer', () => {
    expect(rgbToHex('')).toBe('');
    expect(rgbToHex('transparent')).toBe('');
  });
});

describe('srgbToOklch', () => {
  it('mide el tono dorado de amaizing', () => {
    const { hue } = srgbToOklch('#bd8f00');
    expect(Math.round(hue)).toBe(86);
  });

  it('mide el tono cálido de obsidian', () => {
    const { hue } = srgbToOklch('#897b61');
    expect(Math.round(hue)).toBe(83);
  });

  it('separa el croma de los dos', () => {
    expect(srgbToOklch('#bd8f00').chroma).toBeGreaterThan(
      srgbToOklch('#897b61').chroma
    );
  });

  it('da croma casi nulo en un gris puro', () => {
    expect(srgbToOklch('#808080').chroma).toBeLessThan(0.001);
  });
});

describe('sortByHue', () => {
  it('ordena por tono ascendente', () => {
    const sorted = sortByHue([
      { hex: '#00a5db', theme: 'info' },
      { hex: '#f43c3c', theme: 'danger' },
      { hex: '#65a30d', theme: 'hope' }
    ]);

    expect(sorted.map(({ theme }) => theme)).toEqual([
      'danger',
      'hope',
      'info'
    ]);
  });

  it('deja fuera los que no tienen color leído', () => {
    const sorted = sortByHue([
      { hex: '', theme: 'danger' },
      { hex: '#00a5db', theme: 'info' }
    ]);

    expect(sorted.map(({ theme }) => theme)).toEqual(['info']);
  });
});
