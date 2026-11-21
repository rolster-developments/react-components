import { describe, expect, it } from 'vitest';

import { DEMO_FALLBACK_PATH, DEMO_ROUTES } from './routes';

describe('DEMO_ROUTES', () => {
  it('registra las seis pantallas', () => {
    expect(DEMO_ROUTES.map(({ path }) => path).sort()).toEqual(
      ['/ecommerce', '/inputs', '/palettes', '/sales', '/search', '/table'].sort()
    );
  });

  it('no repite path ni id', () => {
    expect(new Set(DEMO_ROUTES.map(({ path }) => path)).size).toBe(6);
    expect(new Set(DEMO_ROUTES.map(({ id }) => id)).size).toBe(6);
  });

  it('todas tienen icono y etiqueta', () => {
    DEMO_ROUTES.forEach(({ icon, label }) => {
      expect(icon).toBeTruthy();
      expect(label).toBeTruthy();
    });
  });
});

describe('DEMO_FALLBACK_PATH', () => {
  it('apunta a una ruta registrada', () => {
    expect(DEMO_ROUTES.map(({ path }) => path)).toContain(DEMO_FALLBACK_PATH);
  });

  it('es la pantalla Table', () => {
    expect(DEMO_FALLBACK_PATH).toBe('/table');
  });
});
