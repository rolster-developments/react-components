import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsCheckBox } from '../../atoms';
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
  formControl,
  rlsTheme
}: LabelCheckBoxProps) {
  const [checked, setChecked] = useState(!!formControl?.state);

  useEffect(() => {
    setChecked(!!formControl?.state);
  }, [formControl?.state]);

  function onToggle(): void {
    if (formControl) {
      formControl?.setState(!formControl.state);
    } else {
      setChecked(!checked);
    }
  }

  return (
    <div
      className={renderClassStatus('rls-label-checkbox', {
        disabled,
        extended
      })}
      rls-theme={rlsTheme}
    >
      <div className="rls-label-checkbox__component" onClick={onToggle}>
        <RlsCheckBox checked={checked} disabled={disabled} />
      </div>
      <label className="rls-label-checkbox__text">{children}</label>
    </div>
  );
}
