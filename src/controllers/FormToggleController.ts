import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useState } from 'react';

interface FormToggleControllerProps {
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, boolean>;
}

interface FormToggleController {
  checked: boolean;
  onToggle: () => void;
}

export function useFormToggleController({
  disabled,
  formControl
}: FormToggleControllerProps): FormToggleController {
  const [checked, setChecked] = useState(!!formControl?.value);

  useEffect(() => {
    setChecked(!!formControl?.value);
  }, [formControl?.value]);

  const onToggle = useCallback(() => {
    if (!disabled) {
      if (formControl) {
        if (formControl.enabled) {
          formControl.setValue(!formControl.value);
        }
      } else {
        setChecked((checked) => !checked);
      }
    }
  }, [formControl, disabled]);

  return { checked, onToggle };
}
