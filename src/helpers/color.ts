import { RlsTheme } from '../types';

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface RGB {
  b: number;
  g: number;
  r: number;
}

export interface HSL {
  h: number;
  l: number;
  s: number;
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
  colors: ThemeShades;
  css: string;
  properties: { name: string; value: string }[];
  theme: RlsTheme;
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

function detectShadeLevel(hsl: HSL): ShadeLabel {
  let bestLevel: ShadeLabel = '500';
  let minDiff = Infinity;

  (Object.keys(STANDARD_LUMINANCE) as ShadeLabel[]).forEach((level) => {
    const targetL = STANDARD_LUMINANCE[level];
    const diff = Math.abs(hsl.l - targetL);

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
  const hsl = hexToHsl(baseColor);

  if (!hsl) {
    throw new Error(msgInvalidColor(baseColor));
  }

  const matchedLevel = detectShadeLevel(hsl);
  const targetL = STANDARD_LUMINANCE[matchedLevel];
  const inputL = hsl.l;

  const colors: Record<string, string> = {};

  const matchedIndex = SHADE_LABELS.indexOf(matchedLevel);

  SHADE_LABELS.forEach((label: ShadeLabel) => {
    if (label === matchedLevel) {
      colors[label] = baseColor.toUpperCase();
      return;
    }

    const shadeTargetL = STANDARD_LUMINANCE[label];
    const labelIndex = SHADE_LABELS.indexOf(label);

    let lightL: number;

    if (labelIndex < matchedIndex) {
      const ratio = inputL / targetL;

      lightL = shadeTargetL * ratio;
    } else {
      const remainingInput = 100 - inputL;
      const remainingTarget = 100 - targetL;
      const progress = (shadeTargetL - targetL) / remainingTarget;

      lightL = inputL + progress * remainingInput;
    }

    lightL = Math.min(100, Math.max(0, lightL));

    const satFactor =
      lightL > 60
        ? Math.max(0.2, (100 - lightL) / 40)
        : lightL < 30
          ? Math.max(0.2, lightL / 30)
          : 1;

    colors[label] = hslToHex({
      h: hsl.h,
      s: Math.round(Math.min(100, hsl.s * satFactor)),
      l: Math.round(lightL)
    });
  });

  const shades = colors as ThemeShades;
  const properties = generateThemeCSS(shades, theme);

  return {
    theme,
    colors: shades,
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
