import { ReactControl } from '@rolster/react-forms';

import { useMemo } from 'react';

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

export function RlsLabelSwitch({
  capsule,
  children,
  disabled,
  extended,
  identifier,
  formControl,
  reverse,
  rlsTheme
}: LabelSwitchProps) {
  const { checked, onToggle } = useFormToggleController({
    disabled,
    formControl
  });

  const className = useMemo(() => {
    return renderClassStatus('rls-label-switch', {
      disabled,
      extended,
      reverse
    });
  }, [disabled, extended, reverse]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      <div className="rls-label-switch__component" onClick={onToggle}>
        <RlsSwitch checked={checked} capsule={capsule} disabled={disabled} />
      </div>

      <div className="rls-label-switch__text">{children}</div>
    </div>
  );
}
