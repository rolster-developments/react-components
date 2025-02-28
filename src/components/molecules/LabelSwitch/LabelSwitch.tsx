import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useState } from 'react';
import { useRenderClassStatus } from '../../../controllers';
import { RlsSwitch } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './LabelSwitch.css';

interface LabelSwitchProps extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?: ReactControl<HTMLElement, boolean>;
}

export function RlsLabelSwitch({
  children,
  disabled,
  extended,
  identifier,
  formControl,
  rlsTheme
}: LabelSwitchProps) {
  const [checked, setChecked] = useState(!!formControl?.value);

  useEffect(() => {
    setChecked(!!formControl?.value);
  }, [formControl?.value]);

  const onToggle = useCallback(() => {
    formControl
      ? formControl?.setValue(!formControl.value)
      : setChecked((checked) => !checked);
  }, [formControl]);

  return (
    <div
      id={identifier}
      className={useRenderClassStatus('rls-label-switch', {
        disabled,
        extended
      })}
      rls-theme={rlsTheme}
    >
      <div className="rls-label-switch__component" onClick={onToggle}>
        <RlsSwitch checked={checked} disabled={disabled} />
      </div>
      <label className="rls-label-switch__text">{children}</label>
    </div>
  );
}
