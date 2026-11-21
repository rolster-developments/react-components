import { describe, expect, it } from 'vitest';
import { nextDesignSystem } from './design-system';

describe('nextDesignSystem', () => {
  it('moves to the following design system of the list', () => {
    expect(nextDesignSystem(['bordered', 'filled', 'rome'], 'bordered')).toBe(
      'filled'
    );
    expect(nextDesignSystem(['bordered', 'filled', 'rome'], 'filled')).toBe(
      'rome'
    );
  });

  it('wraps around after the last one', () => {
    expect(nextDesignSystem(['bordered', 'filled', 'rome'], 'rome')).toBe(
      'bordered'
    );
  });

  it('starts from the first one when the current is not listed', () => {
    expect(nextDesignSystem(['filled', 'rome'], 'bordered')).toBe('filled');
  });

  it('keeps the current one when the list is empty', () => {
    expect(nextDesignSystem([], 'gradient')).toBe('gradient');
  });
});
