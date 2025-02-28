import { useRenderClassStatus } from '../../../controllers';
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
  return (
    <div
      id={identifier}
      className={useRenderClassStatus('rls-radiobutton', { checked, disabled })}
      onClick={onClick}
      rls-theme={rlsTheme}
    >
      <div className="rls-radiobutton__component"></div>
    </div>
  );
}
