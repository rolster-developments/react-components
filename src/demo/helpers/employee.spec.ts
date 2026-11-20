import { describe, expect, it } from 'vitest';

import { EmployeeStatus } from '../data/employees';
import { employeeInitials, employeeStatusLabel, employeeStatusTheme } from './employee';

describe('employeeInitials', () => {
  it('toma la inicial del nombre y la del apellido', () => {
    expect(employeeInitials('Roman Bellic')).toBe('RB');
  });

  it('con una sola palabra devuelve una inicial', () => {
    expect(employeeInitials('Cher')).toBe('C');
  });

  it('con tres palabras toma la primera y la última', () => {
    expect(employeeInitials('Eleanor P. Junior')).toBe('EJ');
  });

  it('con cadena vacía devuelve cadena vacía', () => {
    expect(employeeInitials('')).toBe('');
  });
});

describe('employeeStatusTheme', () => {
  it('mapea los cuatro estados de Rome', () => {
    expect(employeeStatusTheme('free')).toBe('info');
    expect(employeeStatusTheme('busy')).toBe('danger');
    expect(employeeStatusTheme('working')).toBe('neutral');
    expect(employeeStatusTheme('vacation')).toBe('warning');
  });

  it('con un estado desconocido devuelve neutral', () => {
    expect(employeeStatusTheme('qwerty' as EmployeeStatus)).toBe('neutral');
  });
});

describe('employeeStatusLabel', () => {
  it('rotula los cuatro estados de Rome', () => {
    expect(employeeStatusLabel('free')).toBe('Free');
    expect(employeeStatusLabel('busy')).toBe('Busy');
    expect(employeeStatusLabel('working')).toBe('Working');
    expect(employeeStatusLabel('vacation')).toBe('On Vacation');
  });
});
