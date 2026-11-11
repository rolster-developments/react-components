import { ReactControl } from '@rolster/react-forms';
import { memo, useId } from 'react';
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
  rlsSize,
  rlsTheme
}: LabelCheckBoxProps) {
  const { checked, onToggle } = useFormToggleController({
    disabled,
    formControl
  });

  const labelId = useId();

  const className = renderClassStatus('rls-label-checkbox', {
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
      <div className="rls-label-checkbox__component">
        <RlsCheckBox
          checked={checked}
          disabled={disabled}
          labelledBy={children ? labelId : undefined}
          onClick={onToggle}
        />
      </div>

      <div id={labelId} className="rls-label-checkbox__text">
        {children}
      </div>
    </div>
  );
}

export const RlsLabelCheckBox = memo(RlsLabelCheckBoxComponent);
