import { ReactControl } from '@rolster/react-forms';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsRadioButton } from '../../atoms/RadioButton/RadioButton';
import { RlsComponent } from '../../definitions';
import './LabelRadioButton.css';

interface LabelRadioButtonProps<T = any> extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, T>;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  value?: T;
}

interface FormControlDefinedProps<T> extends LabelRadioButtonProps<T> {
  formControl: ReactControl<HTMLElement, T>;
  value: T;
  onValue?: (value: T) => void;
}

export function RlsLabelRadioButton<T>(
  props: FormControlDefinedProps<T>
): ReactNode;
export function RlsLabelRadioButton<T = any>({
  children,
  disabled,
  extended,
  identifier,
  formControl,
  onValue,
  rlsTheme,
  value
}: LabelRadioButtonProps<T>) {
  const [checked, setChecked] = useState(formControl?.value === value);

  useEffect(() => {
    setChecked(formControl?.value === value);
  }, [formControl?.value]);

  const onSelect = useCallback(() => {
    formControl && formControl?.setValue(value as T);
    onValue && onValue(value as T);
  }, [formControl, value, onValue]);

  const className = useMemo(() => {
    return renderClassStatus('rls-label-radiobutton', { disabled, extended });
  }, [disabled, extended]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      <div className="rls-label-radiobutton__component" onClick={onSelect}>
        <RlsRadioButton checked={checked} disabled={disabled} />
      </div>

      <div className="rls-label-radiobutton__text">{children}</div>
    </div>
  );
}
