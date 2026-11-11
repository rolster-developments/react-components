import { describe, expect, it } from 'vitest';

import { resolveDropdownPosition } from './dropdown';

const viewport = { width: 1000, height: 800 };
const content = { width: 200, height: 300 };

describe('resolveDropdownPosition', () => {
  it('should open below and aligned to the left edge of the trigger', () => {
    const trigger = { x: 100, y: 100, width: 80, height: 40 };

    expect(resolveDropdownPosition(trigger, content, viewport)).toEqual({
      x: 100,
      y: 140,
      origin: '0% 0%'
    });
  });

  it('should align to the right edge when the content overflows the right', () => {
    const trigger = { x: 900, y: 100, width: 80, height: 40 };

    expect(resolveDropdownPosition(trigger, content, viewport)).toEqual({
      x: 780,
      y: 140,
      origin: '100% 0%'
    });
  });

  it('should stick to the right side when neither edge fits', () => {
    const trigger = { x: 30, y: 100, width: 40, height: 40 };
    const narrow = { width: 400, height: 300 };

    expect(
      resolveDropdownPosition(trigger, narrow, { width: 300, height: 800 })
    ).toEqual({
      x: -108,
      y: 140,
      origin: '0% 0%'
    });
  });

  it('should open above the trigger when there is no room below', () => {
    const trigger = { x: 100, y: 700, width: 80, height: 40 };

    expect(resolveDropdownPosition(trigger, content, viewport)).toEqual({
      x: 100,
      y: 400,
      origin: '0% 100%'
    });
  });

  it('should grow from the bottom right corner when it flips on both axes', () => {
    const trigger = { x: 900, y: 700, width: 80, height: 40 };

    expect(resolveDropdownPosition(trigger, content, viewport)).toEqual({
      x: 780,
      y: 400,
      origin: '100% 100%'
    });
  });

  it('should stick to the bottom when neither above nor below fits', () => {
    const trigger = { x: 100, y: 200, width: 80, height: 40 };
    const tall = { width: 200, height: 700 };

    expect(resolveDropdownPosition(trigger, tall, viewport)).toEqual({
      x: 100,
      y: 92,
      origin: '0% 0%'
    });
  });

  it('should cover the trigger when the cover option is enabled', () => {
    const trigger = { x: 100, y: 100, width: 80, height: 40 };

    expect(
      resolveDropdownPosition(trigger, content, viewport, { cover: true })
    ).toEqual({
      x: 100,
      y: 100,
      origin: '0% 0%'
    });
  });

  it('should cover the trigger from its bottom edge when there is no room below', () => {
    const trigger = { x: 100, y: 700, width: 80, height: 40 };

    expect(
      resolveDropdownPosition(trigger, content, viewport, { cover: true })
    ).toEqual({
      x: 100,
      y: 440,
      origin: '0% 100%'
    });
  });

  it('should honor a custom margin when sticking to the viewport edge', () => {
    const trigger = { x: 100, y: 200, width: 80, height: 40 };
    const tall = { width: 200, height: 700 };

    expect(
      resolveDropdownPosition(trigger, tall, viewport, { margin: 16 })
    ).toEqual({
      x: 100,
      y: 84,
      origin: '0% 0%'
    });
  });
});
