import { describe, expect, it } from 'vitest';

import {
  clampNumber,
  normalizeSliderValue,
  sliderRateToValue,
  sliderValueToRate
} from './slider';

describe('clampNumber', () => {
  it('should return the value when it is inside the range', () => {
    expect(clampNumber(42, 0, 100)).toBe(42);
  });

  it('should return the minimum when the value is below the range', () => {
    expect(clampNumber(-10, 0, 100)).toBe(0);
  });

  it('should return the maximum when the value is above the range', () => {
    expect(clampNumber(180, 0, 100)).toBe(100);
  });

  it('should return the minimum when the range is inverted', () => {
    expect(clampNumber(50, 100, 0)).toBe(100);
  });
});

describe('normalizeSliderValue', () => {
  it('should clamp the value into the range', () => {
    expect(normalizeSliderValue(120, 0, 100, 1)).toBe(100);
    expect(normalizeSliderValue(-5, 0, 100, 1)).toBe(0);
  });

  it('should snap the value to the nearest step', () => {
    expect(normalizeSliderValue(12, 0, 100, 5)).toBe(10);
    expect(normalizeSliderValue(13, 0, 100, 5)).toBe(15);
  });

  it('should snap relative to the minimum, not to zero', () => {
    expect(normalizeSliderValue(56, 50, 100, 5)).toBe(55);
    expect(normalizeSliderValue(58, 50, 100, 5)).toBe(60);
  });

  it('should never return a value outside the range when snapping', () => {
    expect(normalizeSliderValue(99, 0, 100, 7)).toBe(98);
    expect(normalizeSliderValue(100, 0, 100, 7)).toBe(100);
  });

  it('should keep both range ends reachable when the step misses them', () => {
    expect(normalizeSliderValue(100, 0, 100, 7)).toBe(100);
    expect(normalizeSliderValue(0, 0, 100, 7)).toBe(0);
    expect(normalizeSliderValue(101, 0, 100, 30)).toBe(100);
  });

  it('should return the clamped value when the step is not usable', () => {
    expect(normalizeSliderValue(12.5, 0, 100, 0)).toBe(12.5);
    expect(normalizeSliderValue(12.5, 0, 100, -1)).toBe(12.5);
  });

  it('should not leak floating point noise with fractional steps', () => {
    expect(normalizeSliderValue(0.3, 0, 1, 0.1)).toBe(0.3);
    expect(normalizeSliderValue(0.7, 0, 1, 0.1)).toBe(0.7);
  });
});

describe('sliderValueToRate', () => {
  it('should return zero at the minimum', () => {
    expect(sliderValueToRate(50, 50, 100)).toBe(0);
  });

  it('should return one hundred at the maximum', () => {
    expect(sliderValueToRate(100, 50, 100)).toBe(100);
  });

  it('should return the proportional rate inside the range', () => {
    expect(sliderValueToRate(60, 50, 100)).toBe(20);
    expect(sliderValueToRate(75, 50, 100)).toBe(50);
  });

  it('should clamp the rate when the value is outside the range', () => {
    expect(sliderValueToRate(20, 50, 100)).toBe(0);
    expect(sliderValueToRate(140, 50, 100)).toBe(100);
  });

  it('should return zero when the range has no width', () => {
    expect(sliderValueToRate(50, 50, 50)).toBe(0);
  });
});

describe('sliderRateToValue', () => {
  it('should return the minimum at rate zero', () => {
    expect(sliderRateToValue(0, 50, 100, 1)).toBe(50);
  });

  it('should return the maximum at rate one hundred', () => {
    expect(sliderRateToValue(100, 50, 100, 1)).toBe(100);
  });

  it('should map the rate to the real value of the range', () => {
    expect(sliderRateToValue(20, 50, 100, 1)).toBe(60);
  });

  it('should clamp rates outside the zero to one hundred range', () => {
    expect(sliderRateToValue(-30, 0, 100, 1)).toBe(0);
    expect(sliderRateToValue(130, 0, 100, 1)).toBe(100);
  });

  it('should snap to the nearest step instead of always rounding up', () => {
    expect(sliderRateToValue(3, 0, 10, 1)).toBe(0);
    expect(sliderRateToValue(7, 0, 10, 1)).toBe(1);
  });

  it('should keep the value stable across a rate round trip', () => {
    const value = sliderRateToValue(sliderValueToRate(72, 50, 100), 50, 100, 1);

    expect(value).toBe(72);
  });
});
