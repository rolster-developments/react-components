import { ReactControl } from '@rolster/react-forms';
import { useRenderClassStatus } from '../../../controllers';
import { RlsComponent } from '../../definitions';
import './Switch.css';

interface SwitchProps extends RlsComponent {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface Props extends RlsComponent {
  disabled?: boolean;
  formControl: ReactControl<HTMLElement, boolean>;
}

export function RlsSwitch({
  checked,
  disabled,
  identifier,
  onClick,
  rlsTheme
}: SwitchProps) {
  return (
    <div
      id={identifier}
      className={useRenderClassStatus('rls-switch', { checked, disabled })}
      onClick={onClick}
      rls-theme={rlsTheme}
    >
      <div className="rls-switch__component">
        <div className="rls-switch__component__element"></div>
        <div className="rls-switch__component__bar"></div>
      </div>
    </div>
  );
}

export function RlsSwitchControl({
  formControl,
  disabled,
  identifier,
  rlsTheme
}: Props) {
  return (
    <RlsSwitch
      identifier={identifier}
      checked={formControl.value || false}
      disabled={disabled}
      onClick={() => {
        formControl.setValue(!formControl.value);
      }}
      rlsTheme={rlsTheme}
    />
  );
}
