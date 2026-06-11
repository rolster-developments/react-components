import { RlsTheme } from '../components/definitions';

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

function msgInvalidColor(color: string): string {
  return `Invalid color: "${color}". Use format "#FF6600".`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function computeHue(
  max: number,
  r: number,
  g: number,
  b: number,
  d: number
): number {
  if (d === 0) {
    return 0;
  }

  switch (max) {
    case r:
      return ((g - b) / d + (g < b ? 6 : 0)) / 6;
    case g:
      return ((b - r) / d + 2) / 6;
    case b:
      return ((r - g) / d + 4) / 6;
    default:
      return 0;
  }
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
  const _h = h / 360;
  const _s = s / 100;
  const _v = v / 100;

  const i = Math.floor(_h * 6);
  const f = _h * 6 - i;
  const p = _v * (1 - _s);
  const q = _v * (1 - f * _s);
  const t = _v * (1 - (1 - f) * _s);

  let r: number;
  let g: number;
  let b: number;

  switch (i % 6) {
    case 0:
      r = _v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = _v;
      b = p;
      break;
    case 2:
      r = p;
      g = _v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = _v;
      break;
    case 4:
      r = t;
      g = p;
      b = _v;
      break;
    case 5:
      r = _v;
      g = p;
      b = q;
      break;
    default:
      r = 0;
      g = 0;
      b = 0;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const _r = r / 255;
  const _g = g / 255;
  const _b = b / 255;

  const max = Math.max(_r, _g, _b);
  const min = Math.min(_r, _g, _b);
  const d = max - min;

  const s = max === 0 ? 0 : d / max;
  const v = max;
  const h = computeHue(max, _r, _g, _b, d);

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (channel: number): string =>
    clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToRgb(hex: string): RGB | null {
  const normalized = normalizeHex(hex);

  if (!normalized) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16)
  };
}

export function hexToHsv(hex: string): HSV | null {
  const rgb = hexToRgb(hex);

  return rgb ? rgbToHsv(rgb) : null;
}

export function hsvToHex(hsv: HSV): string {
  return rgbToHex(hsvToRgb(hsv));
}

export function hexIsValid(hex: string): boolean {
  return /^#?([a-f\d]{3}){1,2}$/i.test(hex);
}

export function normalizeHex(hex: string): string {
  let value = hex.replace(/[^a-fA-F\d]/g, '');

  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('');
  }

  return value.length === 6 ? `#${value.toUpperCase()}` : '';
}

export function hslToHex({ h, s, l }: HSL): string {
  const _s = s / 100;
  const _l = l / 100;
  const a = _s * Math.min(_l, 1 - _l);

  const f = (n: number): string => {
    const k = (n + h / 30) % 12;

    return clamp(
      Math.round(255 * (_l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1))),
      0,
      255
    )
      .toString(16)
      .padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const _r = r / 255;
  const _g = g / 255;
  const _b = b / 255;

  const max = Math.max(_r, _g, _b);
  const min = Math.min(_r, _g, _b);
  const d = max - min;

  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const h = computeHue(max, _r, _g, _b, d);

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);

  return rgb ? rgbToHsl(rgb) : null;
}

const SHADE_LABELS = [
  '950',
  '900',
  '800',
  '700',
  '600',
  '500',
  '400',
  '300',
  '200',
  '100',
  '050'
] as const;

type ShadeLabel = (typeof SHADE_LABELS)[number];

/**
 * Target perceptual lightness (OKLab L, expressed as a 0–100 percentage) for
 * each shade level. OKLab lightness is perceptually uniform, so equal numeric
 * steps look like equal visual steps regardless of hue.
 */
const STANDARD_LUMINANCE: Record<ShadeLabel, number> = {
  '950': 16,
  '900': 24,
  '800': 28,
  '700': 33,
  '600': 40,
  '500': 48,
  '400': 58,
  '300': 72,
  '200': 84,
  '100': 92,
  '050': 97
};

const SKELETON_OPACITY: Partial<Record<ShadeLabel, number>> = {
  '500': 0.5,
  '400': 0.325,
  '300': 0.25,
  '200': 0.175,
  '100': 0.1
};

const GRADIENT_LABELS: ShadeLabel[] = ['700', '600', '500', '400', '300'];

const BACKDROP_LABELS: ShadeLabel[] = [
  '900',
  '800',
  '700',
  '600',
  '500',
  '400',
  '300',
  '200',
  '100'
];

export type ThemeShades = Record<ShadeLabel, string>;

export interface ThemePalette {
  theme: RlsTheme;
  colors: ThemeShades;
  css: string;
  properties: { name: string; value: string }[];
}

function parseHex(color: string): RGB {
  const rgb = hexToRgb(color);

  if (!rgb) {
    throw new Error(msgInvalidColor(color));
  }

  return rgb;
}

function rgbChannels({ r, g, b }: RGB): string {
  return `${r}, ${g}, ${b}`;
}

function generateThemeCSS(
  colors: ThemeShades,
  theme: RlsTheme
): { name: string; value: string }[] {
  const prop = (suffix: string, value: string) => ({
    name: `--rls-${theme}-${suffix}`,
    value
  });

  const rgb900 = rgbChannels(parseHex(colors['900']));
  const rgb700 = rgbChannels(parseHex(colors['700']));
  const rgb500 = rgbChannels(parseHex(colors['500']));

  const colorProps = SHADE_LABELS.map((label) =>
    prop(`color-${label}`, colors[label])
  );

  const gradientProps = GRADIENT_LABELS.map((label) => {
    const darker = SHADE_LABELS[SHADE_LABELS.indexOf(label) - 1];

    return prop(
      `gradient-${label}`,
      `linear-gradient(180deg, ${colors[label]} 15%, ${colors[darker]} 85%)`
    );
  });

  const backdropProps = BACKDROP_LABELS.map((label) =>
    prop(`backdrop-${label}`, `rgba(${rgb900}, ${Number(label) / 1000})`)
  );

  const skeletonProps = (
    Object.entries(SKELETON_OPACITY) as [ShadeLabel, number][]
  ).map(([label, opacity]) =>
    prop(`skeleton-${label}`, `rgba(${rgb700}, ${opacity})`)
  );

  const shadowProps = [
    prop('shadow-color-500', `rgba(${rgb500}, 0.24)`),
    prop('shadow-500', `0px 0px 0px 3px rgba(${rgb500}, 0.24)`)
  ];

  return [
    ...colorProps,
    ...gradientProps,
    ...backdropProps,
    ...skeletonProps,
    ...shadowProps
  ];
}

interface OKLCH {
  l: number; // perceptual lightness, 0–1
  c: number; // chroma, 0+
  h: number; // hue, radians
}

const srgbToLinear = (channel: number): number => {
  const x = channel / 255;

  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
};

const linearToSrgb = (channel: number): number => {
  const v =
    channel <= 0.0031308
      ? 12.92 * channel
      : 1.055 * channel ** (1 / 2.4) - 0.055;

  return clamp(Math.round(v * 255), 0, 255);
};

function rgbToOklch({ r, g, b }: RGB): OKLCH {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const okL = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const okA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const okB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  return { l: okL, c: Math.hypot(okA, okB), h: Math.atan2(okB, okA) };
}

function oklabToLinearRgb(l: number, a: number, b: number): number[] {
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_
  ];
}

const inGamut = ([r, g, b]: number[]): boolean => {
  const e = 1e-4;

  return r >= -e && r <= 1 + e && g >= -e && g <= 1 + e && b >= -e && b <= 1 + e;
};

/**
 * Converts an OKLCH color to sRGB. If the requested chroma falls outside the
 * sRGB gamut, chroma is reduced (binary search) while keeping lightness and
 * hue fixed — this preserves the intended tone instead of clipping channels.
 */
function oklchToRgb({ l, c, h }: OKLCH): RGB {
  const a = Math.cos(h);
  const b = Math.sin(h);
  const linearAt = (chroma: number): number[] =>
    oklabToLinearRgb(l, a * chroma, b * chroma);

  if (!inGamut(linearAt(c))) {
    let lo = 0;
    let hi = c;

    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;

      if (inGamut(linearAt(mid))) {
        lo = mid;
      } else {
        hi = mid;
      }
    }

    c = lo;
  }

  const [lr, lg, lb] = linearAt(c);

  return { r: linearToSrgb(lr), g: linearToSrgb(lg), b: linearToSrgb(lb) };
}

/**
 * Scales chroma down toward the lightness extremes (very light / very dark) so
 * shades do not look oversaturated at the ends. Peaks at L=0.5 (factor 1).
 */
const chromaFactor = (lightness: number): number =>
  0.4 + 0.6 * (1 - Math.abs(lightness - 0.5) * 2);

function detectShadeLevel(lightness: number): ShadeLabel {
  let bestLevel: ShadeLabel = '500';
  let minDiff = Infinity;

  SHADE_LABELS.forEach((level) => {
    const diff = Math.abs(lightness - STANDARD_LUMINANCE[level]);

    if (diff < minDiff) {
      minDiff = diff;
      bestLevel = level;
    }
  });

  return bestLevel;
}

export function generateThemePalette(
  baseColor: string,
  theme: RlsTheme = 'primary'
): ThemePalette {
  const rgb = hexToRgb(baseColor);

  if (!rgb) {
    throw new Error(msgInvalidColor(baseColor));
  }

  const base = rgbToOklch(rgb);
  const matchedLevel = detectShadeLevel(base.l * 100);

  const colors = {} as ThemeShades;

  SHADE_LABELS.forEach((label) => {
    if (label === matchedLevel) {
      colors[label] = rgbToHex(rgb); // preserve the base color exactly
      return;
    }

    const lightness = STANDARD_LUMINANCE[label] / 100;

    colors[label] = rgbToHex(
      oklchToRgb({
        l: lightness,
        c: base.c * chromaFactor(lightness),
        h: base.h
      })
    );
  });

  const properties = generateThemeCSS(colors, theme);

  return {
    theme,
    colors,
    css: properties.map((p) => `${p.name}: ${p.value};`).join('\n'),
    properties
  };
}

export function setThemeColor(
  baseColor: string,
  theme: RlsTheme = 'primary'
): void {
  if (typeof document === 'undefined') {
    return;
  }

  const { properties } = generateThemePalette(baseColor, theme);
  const target = document.body || document.documentElement;

  properties.forEach(({ name, value }) => {
    target.style.setProperty(name, value);
  });
}

export const DEFAULT_COLOR = '#1780e0';
