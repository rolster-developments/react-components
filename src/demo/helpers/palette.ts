import { RlsTheme } from '../../types';

export interface Oklch {
  chroma: number;
  hue: number;
  lightness: number;
}

export interface ThemeSwatch {
  hex: string;
  theme: RlsTheme;
}

export function paletteToken(theme: RlsTheme, step: string): string {
  return `--rls-${theme}-color-${step}`;
}

export function rgbToHex(value: string): string {
  const channels = value.match(/\d+(\.\d+)?/g);

  if (!channels || channels.length < 3) {
    return '';
  }

  return channels
    .slice(0, 3)
    .reduce(
      (hex, channel) =>
        hex + Math.round(Number(channel)).toString(16).padStart(2, '0'),
      '#'
    );
}

function toLinear(channel: number): number {
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

export function srgbToOklch(hex: string): Oklch {
  const [red, green, blue] = [1, 3, 5].map((index) =>
    toLinear(parseInt(hex.slice(index, index + 2), 16) / 255)
  );

  const long = Math.cbrt(
    0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue
  );
  const medium = Math.cbrt(
    0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue
  );
  const short = Math.cbrt(
    0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue
  );

  const lightness =
    0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short;
  const axisA = 1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short;
  const axisB = 0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short;

  return {
    chroma: Math.hypot(axisA, axisB),
    hue: ((Math.atan2(axisB, axisA) * 180) / Math.PI + 360) % 360,
    lightness: lightness * 100
  };
}

export function sortByHue(swatches: ThemeSwatch[]): ThemeSwatch[] {
  return swatches
    .filter(({ hex }) => hex.length === 7)
    .sort((one, other) => srgbToOklch(one.hex).hue - srgbToOklch(other.hex).hue);
}
