import { ReactControl } from '@rolster/react-forms';
import { memo, useMemo } from 'react';
import { useFormToggleController } from '../../../controllers/FormToggleController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsCheckBox } from '../../atoms/CheckBox/CheckBox';
import { RlsComponent } from '../../definitions';

interface LabelCheckBoxProps extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?: ReactControl<HTMLElement, boolean>;
  reverse?: boolean;
}

function RlsLabelCheckBoxComponent({
  children,
  disabled,
  extended,
  identifier,
  formControl,
  reverse,
  rlsTheme
}: LabelCheckBoxProps) {
  const { checked, onToggle } = useFormToggleController({
    disabled,
    formControl
  });

  const className = useMemo(() => {
    return renderClassStatus('rls-label-checkbox', {
      disabled,
      extended,
      reverse
    });
  }, [disabled, extended, reverse]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      <div className="rls-label-checkbox__component" onClick={onToggle}>
        <RlsCheckBox checked={checked} disabled={disabled} />
      </div>

      <div className="rls-label-checkbox__text">{children}</div>
    </div>
  );
}

export const RlsLabelCheckBox = memo(RlsLabelCheckBoxComponent);
