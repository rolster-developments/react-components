import { useCallback, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonAction } from '../../atoms/ButtonAction/ButtonAction';
import { RlsInputPassword } from '../../atoms/InputPassword/InputPassword';
import { FieldBoxProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldPassword.css';

export function RlsFieldPassword(props: FieldBoxProps<string>) {
  const {
    children,
    disabled,
    formControl,
    identifier,
    msgErrorDisabled,
    rlsTheme
  } = props;

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
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputPassword {...props} type={password ? 'password' : 'text'} />

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
