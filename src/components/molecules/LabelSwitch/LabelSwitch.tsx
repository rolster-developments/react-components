import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsSwitch } from '../../atoms/Switch/Switch';
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

  const className = useMemo(() => {
    return renderClassStatus('rls-label-switch', { disabled, extended });
  }, [disabled, extended]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      <div className="rls-label-switch__component" onClick={onToggle}>
        <RlsSwitch checked={checked} disabled={disabled} />
      </div>
      <div className="rls-label-switch__text">{children}</div>
    </div>
  );
}
