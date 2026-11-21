import { describe, expect, it } from 'vitest';

import { datatableStatusTheme } from './datatable';

describe('datatableStatusTheme', () => {
  it('should return undefined when no status is set', () => {
    expect(datatableStatusTheme({})).toBeUndefined();
  });

  it('should map error to the danger palette', () => {
    expect(datatableStatusTheme({ error: true })).toBe('danger');
  });

  it('should map each remaining status to its own palette', () => {
    expect(datatableStatusTheme({ warning: true })).toBe('warning');
    expect(datatableStatusTheme({ info: true })).toBe('info');
    expect(datatableStatusTheme({ success: true })).toBe('success');
  });

  it('should prefer the most severe status when several are set', () => {
    expect(datatableStatusTheme({ error: true, success: true })).toBe('danger');
    expect(datatableStatusTheme({ info: true, warning: true })).toBe('warning');
    expect(datatableStatusTheme({ info: true, success: true })).toBe('info');
  });

  it('should ignore a status that is explicitly false', () => {
    expect(datatableStatusTheme({ error: false, success: true })).toBe(
      'success'
    );
  });
});
