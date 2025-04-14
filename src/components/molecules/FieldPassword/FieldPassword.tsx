import { useCallback, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsButtonAction } from '../../atoms/ButtonAction/ButtonAction';
import { RlsInputPassword } from '../../atoms/InputPassword/InputPassword';
import { RlsComponent } from '../../definitions';
import { RolsterControl } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldPassword.css';

interface FieldPasswordProps extends RlsComponent {
  disabled?: boolean;
  formControl?: RolsterControl<string>;
  msgErrorDisabled?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}

export function RlsFieldPassword({
  children,
  disabled,
  formControl,
  identifier,
  msgErrorDisabled,
  placeholder,
  readOnly,
  rlsTheme
}: FieldPasswordProps) {
  const [password, setPassword] = useState(true);

  const onToggleInput = useCallback(() => {
    setPassword((password) => !password);
  }, []);

  const className = useMemo(() => {
    const _disabled = formControl?.disabled || disabled;

    return renderClassStatus(
      'rls-field-box',
      {
        focused: formControl?.focused && !_disabled,
        error: formControl?.wrong,
        disabled: _disabled
      },
      'rls-field-password'
    );
  }, [
    formControl?.focused,
    formControl?.wrong,
    formControl?.disabled,
    disabled
  ]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputPassword
            formControl={formControl}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            type={password ? 'password' : 'text'}
          />

          <RlsButtonAction
            icon={password ? 'eye' : 'eye-off'}
            onClick={onToggleInput}
          />
        </div>
      </div>

      {!msgErrorDisabled && (
        <RlsMessageFormError
          className="rls-field-box__error"
          formControl={formControl}
        />
      )}
    </div>
  );
}
