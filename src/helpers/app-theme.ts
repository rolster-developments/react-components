import { RlsAppTheme } from '../types';

const APP_THEME_ATTRIBUTE = 'app-theme';

export function getAppTheme(): RlsAppTheme {
  if (typeof document === 'undefined') {
    return 'light';
  }

  const theme = document.body.getAttribute(APP_THEME_ATTRIBUTE);

  return theme === 'dark' || theme === 'dim' ? theme : 'light';
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
