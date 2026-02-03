import { useCallback, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonAction } from '../../atoms/ButtonAction/ButtonAction';
import { RlsInputPassword } from '../../atoms/InputPassword/InputPassword';
import { FieldProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldPassword.css';

export function RlsFieldPassword(props: FieldProps<string>) {
  const { children, formControl, identifier, rlsTheme } = props;

  const [passwordIsActive, setPasswordIsActive] = useState(true);

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
      'rls-field-password'
    );
  }, [formControl?.focused, formControl?.wrong, props.readOnly, disabled]);

  const onTogglePassword = useCallback(() => {
    setPasswordIsActive((password) => !password);
  }, []);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputPassword
            {...props}
            type={passwordIsActive ? 'password' : 'text'}
          />

          <RlsButtonAction
            icon={passwordIsActive ? 'eye' : 'eye-off'}
            onClick={onTogglePassword}
          />
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
