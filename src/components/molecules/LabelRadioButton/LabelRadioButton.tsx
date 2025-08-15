import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsRadioButton } from '../../atoms/RadioButton/RadioButton';
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

  const onSelect = useCallback(() => {
    formControl && formControl?.setValue(value);
  }, [formControl, value]);

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
