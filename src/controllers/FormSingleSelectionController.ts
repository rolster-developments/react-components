import { ReactControl } from '@rolster/react-forms';

import { useCallback, useEffect, useState } from 'react';

interface FormSingleSelectionControllerProps<T = any> {
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, T>;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  value?: T;
}

interface FormSingleSelectionController {
  checked: boolean;
  onSelect: () => void;
}

export function useFormSingleSelectionController<T>({
  disabled,
  formControl,
  onValue,
  value
}: FormSingleSelectionControllerProps<T>): FormSingleSelectionController {
  const [checked, setChecked] = useState(formControl?.value === value);

  useEffect(() => {
    setChecked(formControl?.value === value);
  }, [formControl?.value]);

  const onSelect = useCallback(() => {
    if (!disabled) {
      formControl?.setValue(value as T);
      onValue?.(value as T);
    }
  }, [formControl, value, onValue, disabled]);

  return { checked, onSelect };
}
