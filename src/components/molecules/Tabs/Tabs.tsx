import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

export interface Tab<T = any> {
  label: string;
  value: T;
  defaultActive?: boolean;
  disabled?: boolean;
}

interface TabsProps<T> extends RlsComponent {
  tabs: Tab<T>[];
  onValue?: (value: T) => void;
}

interface TabProps<T> {
  onSelect: (value: T) => void;
  tab: Tab<T>;
  value?: T;
}

function RlsTab<T>({ onSelect, tab, value }: TabProps<T>) {
  const className = useMemo(() => {
    return renderClassStatus('rls-tabs__children', {
      active: tab.value === value,
      disabled: tab.disabled
    });
  }, [tab, value]);

  const onClick = useCallback(() => {
    if (!tab.disabled) {
      onSelect(tab.value);
    }
  }, [tab.disabled]);

  return (
    <div className={className} onClick={onClick}>
      <span>{tab.label}</span>
    </div>
  );
}

export function RlsTabs<T = any>({ tabs, onValue, rlsTheme }: TabsProps<T>) {
  const [value, setValue] = useState<T>();

  const onSelect = useCallback(
    (value: T) => {
      setValue(value);
      onValue?.(value);
    },
    [onValue]
  );

  useEffect(() => {
    const initial = tabs.find((tab) => tab.defaultActive) ?? tabs[0];

    if (initial) {
      onSelect(initial.value);
    }
  }, []);

  return (
    <div className="rls-tabs" rls-theme={rlsTheme}>
      {tabs.map((tab, index) => {
        return (
          <RlsTab key={index} tab={tab} value={value} onSelect={onSelect} />
        );
      })}
    </div>
  );
}
