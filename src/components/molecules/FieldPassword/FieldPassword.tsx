import { useCallback, useState } from 'react';
import { useRenderClassStatus } from '../../../controllers';
import { RlsButtonAction, RlsInputPassword } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RolsterControl } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldPassword.css';

interface FieldPasswordProps extends RlsComponent {
  disabled?: boolean;
  formControl?: RolsterControl<string>;
  msgErrorDisabled?: boolean;
  placeholder?: string;
}

export function RlsFieldPassword({
  children,
  disabled,
  formControl,
  identifier,
  msgErrorDisabled,
  placeholder,
  rlsTheme
}: FieldPasswordProps) {
  const [password, setPassword] = useState(true);

  const onToggleInput = useCallback(() => {
    setPassword((password) => !password);
  }, []);

  const _disabled = formControl?.disabled || disabled;

  return (
    <div
      id={identifier}
      className={useRenderClassStatus(
        ' rls-field-box',
        {
          focused: formControl?.focused && !_disabled,
          error: formControl?.wrong,
          disabled: _disabled
        },
        'rls-field-password'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputPassword
            formControl={formControl}
            disabled={disabled}
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
