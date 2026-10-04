import { useCallback, useState } from 'react';
import { getAppTheme, setAppTheme } from '../helpers/app-theme';
import { RlsAppTheme } from '../types';

export interface AppThemeController {
  setValue: (value: RlsAppTheme) => void;
  toggle: () => void;
  value: RlsAppTheme;
}

export function useAppThemeController(
  initialTheme?: RlsAppTheme,
  primaryTheme: RlsAppTheme = 'light',
  secondaryTheme: RlsAppTheme = 'dark'
): AppThemeController {
  const [appTheme, setAppThemeValue] = useState<RlsAppTheme>(() => {
    if (initialTheme) {
      setAppTheme(initialTheme);

      return initialTheme;
    }

    return getAppTheme();
  });

  const setValue = useCallback((value: RlsAppTheme) => {
    setAppTheme(value);
    setAppThemeValue(value);
  }, []);

  const toggle = useCallback(() => {
    setValue(appTheme === primaryTheme ? secondaryTheme : primaryTheme);
  }, [appTheme, primaryTheme, secondaryTheme, setValue]);

  return { setValue, toggle, value: appTheme };
}
