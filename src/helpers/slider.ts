const RATE_MIN = 0;
const RATE_MAX = 100;
const PRECISION = 12;

export function clampNumber(
  value: number,
  minValue: number,
  maxValue: number
): number {
  if (minValue > maxValue) {
    return minValue;
  }

  return Math.min(Math.max(value, minValue), maxValue);
}

export function normalizeSliderValue(
  value: number,
  minValue: number,
  maxValue: number,
  step: number
): number {
  const valueClamped = clampNumber(value, minValue, maxValue);

  if (!step || step <= 0) {
    return valueClamped;
  }

  if (valueClamped <= minValue) {
    return minValue;
  }

  if (valueClamped >= maxValue) {
    return maxValue;
  }

  const steps = Math.round((valueClamped - minValue) / step);
  const valueStepped = parseFloat(
    (minValue + steps * step).toPrecision(PRECISION)
  );

  return clampNumber(valueStepped, minValue, maxValue);
}

export function sliderValueToRate(
  value: number,
  minValue: number,
  maxValue: number
): number {
  const range = maxValue - minValue;

  if (range <= 0) {
    return RATE_MIN;
  }

  return clampNumber(
    ((value - minValue) / range) * RATE_MAX,
    RATE_MIN,
    RATE_MAX
  );
}

export function sliderRateToValue(
  rate: number,
  minValue: number,
  maxValue: number,
  step: number
): number {
  const range = maxValue - minValue;
  const rateClamped = clampNumber(rate, RATE_MIN, RATE_MAX);

  return normalizeSliderValue(
    minValue + (range * rateClamped) / RATE_MAX,
    minValue,
    maxValue,
    step
  );
}
