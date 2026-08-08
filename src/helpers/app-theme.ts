import { RlsAppTheme } from '../types';

const APP_THEME_ATTRIBUTE = 'app-theme';

export function getAppTheme(): RlsAppTheme {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.body.getAttribute(APP_THEME_ATTRIBUTE) === 'dark'
    ? 'dark'
    : 'light';
}

export function setAppTheme(theme: RlsAppTheme): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.body.setAttribute(APP_THEME_ATTRIBUTE, theme);
}

export function toggleAppTheme(): RlsAppTheme {
  const theme: RlsAppTheme = getAppTheme() === 'dark' ? 'light' : 'dark';

  setAppTheme(theme);

  return theme;
}
