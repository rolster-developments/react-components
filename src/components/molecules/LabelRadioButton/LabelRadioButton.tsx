import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsRadioButton } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './LabelRadioButton.css';

interface LabelRadioButtonProps<T = any> extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?: ReactControl<HTMLElement, T | undefined>;
  value?: T;
}

export function RlsLabelRadioButton<T = any>({
  children,
  disabled,
  extended,
  identifier,
  formControl,
  rlsTheme,
  value
}: LabelRadioButtonProps<T>) {
  const [checked, setChecked] = useState(formControl?.value === value);

  useEffect(() => {
    setChecked(formControl?.value === value);
  }, [formControl?.value]);

  function onSelect(): void {
    formControl && formControl?.setValue(value);
  }

  return (
    <div
      id={identifier}
      className={renderClassStatus('rls-label-radiobutton', {
        disabled,
        extended
      })}
      rls-theme={rlsTheme}
    >
      <div className="rls-label-radiobutton__component" onClick={onSelect}>
        <RlsRadioButton checked={checked} disabled={disabled} />
      </div>
      <label className="rls-label-radiobutton__text">{children}</label>
    </div>
  );
}
