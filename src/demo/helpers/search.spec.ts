import { describe, expect, it } from 'vitest';

import { JOBS } from '../data/jobs';
import { jobSalaryLabel, searchSummary } from './search';

describe('searchSummary', () => {
  it('une las partes con punto medio', () => {
    expect(searchSummary(['$58,000+', 'Part-time', 'United Kingdom'])).toBe(
      '$58,000+ · Part-time · United Kingdom'
    );
  });

  it('descarta las partes vacías', () => {
    expect(searchSummary(['$58,000+', '', 'UK'])).toBe('$58,000+ · UK');
  });

  it('con nada devuelve cadena vacía', () => {
    expect(searchSummary([])).toBe('');
  });
});

describe('jobSalaryLabel', () => {
  it('formatea un rango anual', () => {
    expect(jobSalaryLabel(JOBS[0])).toBe('$109,100 - $160,000 a year');
  });

  it('formatea un importe único sin rango', () => {
    expect(jobSalaryLabel(JOBS[1])).toBe('$99,200 a year');
  });

  it('formatea un rango mensual', () => {
    expect(jobSalaryLabel(JOBS[2])).toBe('$5,887 - $8,478 a month');
  });
});
