import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { RolsterReactHtmlControl } from '../../types';

export interface Tab<T = any> {
  label: string;
  value: T;
  defaultActive?: boolean;
  disabled?: boolean;
}

interface TabsProps<T> extends RlsComponent {
  tabs: Tab<T>[];
  formControl?: RolsterReactHtmlControl<T>;
  onValue?: (value: T) => void;
  value?: T;
}

interface TabProps<T> {
  onSelect: (value: T) => void;
  tab: Tab<T>;
  disabled?: boolean;
  value?: T;
}

function RlsTab<T>({ disabled, onSelect, tab, value }: TabProps<T>) {
  const className = renderClassStatus('rls-tabs__children', {
    active: tab.value === value,
    disabled: disabled || tab.disabled
  });

  const onClick = useCallback(() => {
    if (!disabled && !tab.disabled) {
      onSelect(tab.value);
    }
  }, [disabled, tab.disabled, onSelect]);

  return (
    <div className={className} onClick={onClick}>
      <span>{tab.label}</span>
    </div>
  );
}

function RlsTabsComponent<T = any>({
  tabs,
  formControl,
  onValue,
  value,
  rlsTheme
}: TabsProps<T>) {
  const [valueInternal, setValueInternal] = useState<T>();

  const valueSelected = useMemo(() => {
    return formControl ? formControl.value : valueInternal;
  }, [formControl?.value, valueInternal]);

  const onSelect = useCallback(
    (value: T) => {
      if (formControl) {
        formControl?.setValue(value);
      } else {
        setValueInternal(value);
      }

      onValue?.(value);
    },
    [formControl, onValue]
  );

  useEffect(() => {
    if (formControl?.value !== undefined) {
      return setValueInternal(formControl.value);
    }

    if (value !== undefined) {
      return setValueInternal(value);
    }

    const initial = tabs.find((tab) => tab.defaultActive) ?? tabs[0];

    if (initial) {
      onSelect(initial.value);
    }
  }, [value, formControl?.value]);

  return (
    <div className="rls-tabs" rls-theme={rlsTheme}>
      {tabs.map((tab, index) => {
        return (
          <RlsTab
            key={index}
            tab={tab}
            disabled={formControl?.disabled}
            value={valueSelected}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}

export const RlsTabs = memo(RlsTabsComponent) as typeof RlsTabsComponent;
