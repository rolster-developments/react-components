import { memo, useCallback, useEffect, useState } from 'react';
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
  value?: T;
}

interface TabProps<T> {
  onSelect: (value: T) => void;
  tab: Tab<T>;
  value?: T;
}

function RlsTab<T>({ onSelect, tab, value }: TabProps<T>) {
  const className = renderClassStatus('rls-tabs__children', {
    active: tab.value === value,
    disabled: tab.disabled
  });

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

function RlsTabsComponent<T = any>({
  tabs,
  value,
  onValue,
  rlsTheme
}: TabsProps<T>) {
  const [valueInternal, setValueInternal] = useState<T>();

  const onSelect = useCallback(
    (value: T) => {
      setValueInternal(value);
      onValue?.(value);
    },
    [onValue]
  );

  useEffect(() => {
    if (value !== undefined) {
      return setValueInternal(value);
    }

    const initial = tabs.find((tab) => tab.defaultActive) ?? tabs[0];

    if (initial) {
      onSelect(initial.value);
    }
  }, [value]);

  return (
    <div className="rls-tabs" rls-theme={rlsTheme}>
      {tabs.map((tab, index) => {
        return (
          <RlsTab
            key={index}
            tab={tab}
            value={valueInternal}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}

export const RlsTabs = memo(RlsTabsComponent) as typeof RlsTabsComponent;
