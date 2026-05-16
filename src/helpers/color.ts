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

export function rgbToHsv(r: number, g: number, b: number): HSV {
  const _r = r / 255;
  const _g = g / 255;
  const _b = b / 255;

  const max = Math.max(_r, _g, _b);
  const min = Math.min(_r, _g, _b);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case _r:
        h = ((_g - _b) / d + (_g < _b ? 6 : 0)) / 6;
        break;
      case _g:
        h = ((_b - _r) / d + 2) / 6;
        break;
      case _b:
        h = ((_r - _g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

export function hexToHsv(hex: string): HSV | null {
  const rgb = hexToRgb(hex);

  return rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b) : null;
}

export function hsvToHex(hsv: HSV): string {
  const rgb = hsvToRgb(hsv);

  return rgbToHex(rgb.r, rgb.g, rgb.b);
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

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function hslToHex({ h, s, l }: HSL): string {
  const _s = s / 100;
  const _l = l / 100;
  const a = _s * Math.min(_l, 1 - _l);

  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(
      255 * (_l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1))
    )
      .toString(16)
      .padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const _r = r / 255;
  const _g = g / 255;
  const _b = b / 255;

  const max = Math.max(_r, _g, _b);
  const min = Math.min(_r, _g, _b);
  const d = max - min;

  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  if (d !== 0) {
    switch (max) {
      case _r:
        h = ((_g - _b) / d + (_g < _b ? 6 : 0)) / 6;
        break;
      case _g:
        h = ((_b - _r) / d + 2) / 6;
        break;
      case _b:
        h = ((_r - _g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
}

const STANDARD_LUMINANCE: Record<string, number> = {
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

export interface ThemeShades {
  '950': string;
  '900': string;
  '800': string;
  '700': string;
  '600': string;
  '500': string;
  '400': string;
  '300': string;
  '200': string;
  '100': string;
  '050': string;
}

export interface ThemePalette {
  theme: RlsTheme;
  colors: ThemeShades;
  css: string;
  properties: { name: string; value: string }[];
}

function parseHex(color: string): RGB {
  const rgb = hexToRgb(color);

  if (!rgb) throw new Error(`Invalid color: "${color}". Use format "#FF6600".`);

  return rgb;
}

function generateThemeCSS(
  colors: ThemeShades,
  theme: RlsTheme
): { name: string; value: string }[] {
  const c900 = colors['900'];
  const c700 = colors['700'];
  const c500 = colors['500'];

  const r900 = parseHex(c900);
  const r700 = parseHex(c700);
  const r500 = parseHex(c500);

  const rgb900 = `${r900.r}, ${r900.g}, ${r900.b}`;
  const rgb700 = `${r700.r}, ${r700.g}, ${r700.b}`;
  const rgb500 = `${r500.r}, ${r500.g}, ${r500.b}`;

  return [
    { name: `--rls-${theme}-color-950`, value: colors['950'] },
    { name: `--rls-${theme}-color-900`, value: c900 },
    { name: `--rls-${theme}-color-800`, value: colors['800'] },
    { name: `--rls-${theme}-color-700`, value: c700 },
    { name: `--rls-${theme}-color-600`, value: colors['600'] },
    { name: `--rls-${theme}-color-500`, value: c500 },
    { name: `--rls-${theme}-color-400`, value: colors['400'] },
    { name: `--rls-${theme}-color-300`, value: colors['300'] },
    { name: `--rls-${theme}-color-200`, value: colors['200'] },
    { name: `--rls-${theme}-color-100`, value: colors['100'] },
    { name: `--rls-${theme}-color-050`, value: colors['050'] },
    {
      name: `--rls-${theme}-gradient-700`,
      value: `linear-gradient(180deg, ${c700} 15%, ${colors['800']} 85%)`
    },
    {
      name: `--rls-${theme}-gradient-600`,
      value: `linear-gradient(180deg, ${colors['600']} 15%, ${c700} 85%)`
    },
    {
      name: `--rls-${theme}-gradient-500`,
      value: `linear-gradient(180deg, ${c500} 15%, ${colors['600']} 85%)`
    },
    {
      name: `--rls-${theme}-gradient-400`,
      value: `linear-gradient(180deg, ${colors['400']} 15%, ${c500} 85%)`
    },
    {
      name: `--rls-${theme}-gradient-300`,
      value: `linear-gradient(180deg, ${colors['300']} 15%, ${colors['400']} 85%)`
    },
    { name: `--rls-${theme}-backdrop-900`, value: `rgba(${rgb900}, 0.9)` },
    { name: `--rls-${theme}-backdrop-800`, value: `rgba(${rgb900}, 0.8)` },
    { name: `--rls-${theme}-backdrop-700`, value: `rgba(${rgb900}, 0.7)` },
    { name: `--rls-${theme}-backdrop-600`, value: `rgba(${rgb900}, 0.6)` },
    { name: `--rls-${theme}-backdrop-500`, value: `rgba(${rgb900}, 0.5)` },
    { name: `--rls-${theme}-backdrop-400`, value: `rgba(${rgb900}, 0.4)` },
    { name: `--rls-${theme}-backdrop-300`, value: `rgba(${rgb900}, 0.3)` },
    { name: `--rls-${theme}-backdrop-200`, value: `rgba(${rgb900}, 0.2)` },
    { name: `--rls-${theme}-backdrop-100`, value: `rgba(${rgb900}, 0.1)` },
    { name: `--rls-${theme}-skeleton-500`, value: `rgba(${rgb700}, 0.5)` },
    { name: `--rls-${theme}-skeleton-400`, value: `rgba(${rgb700}, 0.325)` },
    { name: `--rls-${theme}-skeleton-300`, value: `rgba(${rgb700}, 0.25)` },
    { name: `--rls-${theme}-skeleton-200`, value: `rgba(${rgb700}, 0.175)` },
    { name: `--rls-${theme}-skeleton-100`, value: `rgba(${rgb700}, 0.1)` },
    { name: `--rls-${theme}-shadow-color-500`, value: `rgba(${rgb500}, 0.24)` },
    {
      name: `--rls-${theme}-shadow-500`,
      value: `0px 0px 0px 3px rgba(${rgb500}, 0.24)`
    }
  ];
}

type ShadeLabel = (typeof SHADE_LABELS)[number];

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

  if (!hsl) throw new Error(`Invalid color: "${baseColor}". Use format "#FF6600".`);

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

  const shades = colors as unknown as ThemeShades;
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
  const { properties } = generateThemePalette(baseColor, theme);
  const target = document.body || document.documentElement;

  properties.forEach(({ name, value }) => {
    target.style.setProperty(name, value);
  });
}

export const DEFAULT_COLOR = '#1780e0';
