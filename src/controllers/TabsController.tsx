import { useFormControl } from '@rolster/react-forms';
import { ReactNode, useMemo, useRef } from 'react';
import { RlsComponent } from '../components/definitions';
import { RlsTabs, Tab } from '../components/molecules/Tabs/Tabs';
import { RolsterReactHtmlControl } from '../components/types';

interface TabsControllerOptions<T = any> {
  tabs: Tab<T>[];
  onValue?: (value: T) => void;
  value?: T;
}

type TabsPropsRender<T = any> = RlsComponent & { value?: T };

export interface TabsController<T = any> {
  formControl: RolsterReactHtmlControl<T>;
  Tabs: (props: TabsPropsRender<T>) => ReactNode;
}

export function useTabsController<T = any>(
  options: TabsControllerOptions<T>
): TabsController<T> {
  const formControl = useFormControl(options.value);

  const tabsRef = useRef(options.tabs);
  tabsRef.current = options.tabs;

  const onValueRef = useRef(options.onValue);
  onValueRef.current = options.onValue;

  const formControlRef = useRef(formControl);
  formControlRef.current = formControl;

  const Tabs = useMemo(() => {
    return function Tabs(props: TabsPropsRender<T>) {
      return (
        <RlsTabs
          {...props}
          tabs={tabsRef.current}
          formControl={formControlRef.current}
          onValue={onValueRef.current}
        />
      );
    };
  }, []);

  return useMemo(() => ({ Tabs, formControl }), [Tabs, formControl]);
}
