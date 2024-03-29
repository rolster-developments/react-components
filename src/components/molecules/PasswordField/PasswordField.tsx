import { ReactControl } from '@rolster/react-forms';
import { useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonAction, RlsMessageIcon, RlsInputPassword } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './PasswordField.css';

interface PasswordFieldProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLInputElement, string>;
  placeholder?: string;
}

export function RlsPasswordField({
  children,
  disabled,
  formControl,
  placeholder,
  rlsTheme
}: PasswordFieldProps) {
  const [password, setPassword] = useState(true);

  function onToggleInput(): void {
    setPassword(!password);
  }

  return (
    <div
      className={renderClassStatus(
        ' rls-box-field',
        {
          focused: formControl?.focused,
          error: formControl?.wrong,
          disabled: formControl?.disabled || disabled
        },
        'rls-password-field'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-box-field__label">{children}</label>}

      <div className="rls-box-field__component">
        <div className="rls-box-field__body">
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

      {formControl?.touched && formControl?.error && (
        <div className="rls-box-field__error">
          <RlsMessageIcon icon="alert-triangle" rlsTheme="danger">
            {formControl.error.message}
          </RlsMessageIcon>
        </div>
      )}
    </div>
  );
}
