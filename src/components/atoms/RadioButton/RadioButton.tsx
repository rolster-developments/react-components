import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './RadioButton.css';

interface RadioButtonProps extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function RlsRadioButton({
  checked,
  disabled,
  identifier,
  rlsTheme,
  onClick
}: RadioButtonProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-radiobutton', { checked, disabled });
  }, [checked, disabled]);

  return (
    <div
      id={identifier}
      className={className}
      onClick={onClick}
      rls-theme={rlsTheme}
    >
      <div className="rls-radiobutton__component"></div>
    </div>
  );
}
