import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonAction } from '../../atoms/ButtonAction/ButtonAction';
import { RlsInputText } from '../../atoms/InputText/InputText';
import { FieldProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';

export function RlsFieldText(props: FieldProps<string>) {
  const { action, children, formControl, identifier, rlsTheme } = props;

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
      'rls-field-text'
    );
  }, [formControl?.focused, formControl?.wrong, props.readOnly, disabled]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputText {...props} />

          {action && (
            <RlsButtonAction
              icon={action.icon}
              disabled={disabled}
              onClick={action.onClick}
            />
          )}
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
