import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { getAppTheme, setAppTheme } from '../../../helpers/app-theme';
import { reactI18n } from '../../../i18n';
import { RlsAppTheme } from '../../../types';
import { PropsWithRlsSize, PropsWithRlsTheme } from '../../definitions';
import { RlsTabs, Tab } from '../Tabs/Tabs';

export type AppThemeLabels = Partial<Record<RlsAppTheme, string>>;

interface AppThemeTabsProps extends PropsWithRlsTheme, PropsWithRlsSize {
  labels?: AppThemeLabels;
  onValue?: (value: RlsAppTheme) => void;
  themes?: RlsAppTheme[];
  value?: RlsAppTheme;
}

export const APP_THEMES: RlsAppTheme[] = ['light', 'dim', 'dark'];

const LABELS: Record<RlsAppTheme, () => string> = {
  light: () => reactI18n('appThemeLight'),
  dim: () => reactI18n('appThemeDim'),
  dark: () => reactI18n('appThemeDark')
};

function RlsAppThemeTabsComponent({
  labels,
  rlsSize,
  onValue,
  rlsTheme,
  themes = APP_THEMES,
  value
}: AppThemeTabsProps) {
  const [appTheme, setAppThemeValue] = useState<RlsAppTheme>(
    () => value ?? getAppTheme()
  );

  useEffect(() => {
    if (value !== undefined) {
      setAppTheme(value);
      setAppThemeValue(value);
    }
  }, [value]);

  const tabs = useMemo<Tab<RlsAppTheme>[]>(() => {
    return themes.map((theme) => ({
      label: labels?.[theme] ?? LABELS[theme](),
      value: theme
    }));
  }, [labels, themes]);

  const onSelect = useCallback(
    (theme: RlsAppTheme) => {
      setAppTheme(theme);
      setAppThemeValue(theme);

      onValue?.(theme);
    },
    [onValue]
  );

  return (
    <RlsTabs
      tabs={tabs}
      value={appTheme}
      onValue={onSelect}
      rlsSize={rlsSize}
      rlsTheme={rlsTheme}
    />
  );
}

export const RlsAppThemeTabs = memo(RlsAppThemeTabsComponent);
