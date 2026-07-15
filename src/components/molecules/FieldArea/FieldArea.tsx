import { useMemo } from 'react';

import { renderClassStatus } from '../../../helpers/css';
import {
  AreaTextProps,
  RlsAreaText,
  RolsterReactAreaTextControl
} from '../../atoms/AreaText/AreaText';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';

interface FieldAreaProps extends AreaTextProps, RlsComponent {
  formControl?: RolsterReactAreaTextControl<string>;
  msgErrorDisabled?: boolean;
}

export function RlsFieldArea(props: FieldAreaProps) {
  const { children, formControl, identifier, rlsTheme } = props;

  const disabled = useMemo(() => {
    return formControl?.disabled || props.disabled;
  }, [formControl?.disabled, props.disabled]);

  const className = useMemo(() => {
    return renderClassStatus(
      'rls-field-box',
      {
        disabled,
        error: formControl?.wrong,
        focused: formControl?.focused && !disabled,
        readonly: props.readOnly
      },
      'rls-field-area'
    );
  }, [formControl?.focused, formControl?.wrong, props.readOnly, disabled]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsAreaText {...props} />
        </div>
      </div>

      {!props.msgErrorDisabled && (
        <RlsMessageFormError
          className="rls-field-box__error"
          formControl={formControl}
        />
      )}
    </div>
  );
}
