import { ReactControl } from '@rolster/react-forms';
import { memo, useId } from 'react';
import { useFormToggleController } from '../../../controllers/FormToggleController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsSwitch } from '../../atoms/Switch/Switch';
import { RlsComponent } from '../../definitions';

interface LabelSwitchProps extends RlsComponent {
  capsule?: boolean;
  disabled?: boolean;
  extended?: boolean;
  formControl?: ReactControl<HTMLElement, boolean>;
  reverse?: boolean;
}

function RlsLabelSwitchComponent({
  capsule,
  children,
  disabled,
  extended,
  identifier,
  formControl,
  reverse,
  rlsSize,
  rlsTheme
}: LabelSwitchProps) {
  const { checked, onToggle } = useFormToggleController({
    disabled,
    formControl
  });

  const labelId = useId();

  const className = renderClassStatus('rls-label-switch', {
    disabled,
    extended,
    reverse
  });

  return (
    <div
      id={identifier}
      className={className}
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <div className="rls-label-switch__component">
        <RlsSwitch
          checked={checked}
          capsule={capsule}
          disabled={disabled}
          labelledBy={children ? labelId : undefined}
          onClick={onToggle}
        />
      </div>

      <div id={labelId} className="rls-label-switch__text">
        {children}
      </div>
    </div>
  );
}

export const RlsLabelSwitch = memo(RlsLabelSwitchComponent);
