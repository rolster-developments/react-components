import { describe, expect, it } from 'vitest';

import { DEMO_ROUTES } from '../routes';
import { DEMO_PAGES } from './registry';

describe('DEMO_PAGES', () => {
  it('resuelve un elemento para cada ruta registrada', () => {
    DEMO_ROUTES.forEach(({ id }) => {
      expect(DEMO_PAGES[id]).toBeDefined();
    });
  });

  it('no declara páginas que ninguna ruta use', () => {
    const ids = DEMO_ROUTES.map(({ id }) => id);

    Object.keys(DEMO_PAGES).forEach((id) => {
      expect(ids).toContain(id);
    });
  });
});
