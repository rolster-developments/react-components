import { describe, expect, it } from 'vitest';

import { profileEmailError } from './profile';

describe('profileEmailError', () => {
  it('acepta un correo con dominio y extensión', () => {
    expect(profileEmailError('daniel@rolster.com')).toBeUndefined();
  });

  it('rechaza un dominio sin extensión con el id que la librería traduce', () => {
    expect(profileEmailError('daniel@rolster')?.id).toBe('email');
  });

  it('rechaza una cadena sin arroba', () => {
    expect(profileEmailError('daniel')?.id).toBe('email');
  });

  it('rechaza el vacío, el indefinido y el nulo', () => {
    expect(profileEmailError('')?.id).toBe('email');
    expect(profileEmailError()?.id).toBe('email');
    expect(profileEmailError(null)?.id).toBe('email');
  });
});
