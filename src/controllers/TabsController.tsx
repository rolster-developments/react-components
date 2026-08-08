import { useFormControl } from '@rolster/react-forms';
import { ReactNode, useMemo } from 'react';
import { RlsTabs, Tab } from '../components/molecules/Tabs/Tabs';
import { RolsterReactHtmlControl } from '../components/types';

interface TabsControllerOptions<T = any> {
  tabs: Tab<T>[];
  onValue?: (value: T) => void;
  value?: T;
}

export interface TabsController<T = any> {
  formControl: RolsterReactHtmlControl<T>;
  Tabs: ReactNode;
}

export function useTabsController<T = any>(
  options: TabsControllerOptions<T>
): TabsController<T> {
  const formControl = useFormControl(options.value);

  const Tabs = useMemo(() => {
    return (
      <RlsTabs
        tabs={options.tabs}
        formControl={formControl}
        onValue={options.onValue}
      />
    );
  }, [options.tabs, options.onValue, formControl]);

  return { Tabs, formControl };
}
