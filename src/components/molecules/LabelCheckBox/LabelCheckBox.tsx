import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsCheckBox } from '../../atoms/CheckBox/CheckBox';
import { RlsComponent } from '../../definitions';
import './LabelCheckBox.css';

interface LabelCheckBoxProps extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?: ReactControl<HTMLElement, boolean>;
}

export function RlsLabelCheckBox({
  children,
  disabled,
  extended,
  identifier,
  formControl,
  rlsTheme
}: LabelCheckBoxProps) {
  const [checked, setChecked] = useState(!!formControl?.value);

  useEffect(() => {
    setChecked(!!formControl?.value);
  }, [formControl?.value]);

  const onToggle = useCallback(() => {
    formControl
      ? formControl?.setValue(!formControl.value)
      : setChecked((checked) => !checked);
  }, [formControl]);

  const className = useMemo(() => {
    return renderClassStatus('rls-label-checkbox', { disabled, extended });
  }, [disabled, extended]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      <div className="rls-label-checkbox__component" onClick={onToggle}>
        <RlsCheckBox checked={checked} disabled={disabled} />
      </div>
      <label className="rls-label-checkbox__text">{children}</label>
    </div>
  );
}
