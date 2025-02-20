import { renderClassStatus } from '../../../helpers/css';
import { RlsInputText } from '../../atoms';
import { FieldBoxProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldText.css';

export function RlsFieldText({
  children,
  disabled,
  formControl,
  identifier,
  msgErrorDisabled,
  onValue,
  placeholder,
  rlsTheme,
  value
}: FieldBoxProps<string>) {
  const _disabled = formControl?.disabled || disabled;

  return (
    <div
      id={identifier}
      className={renderClassStatus(
        'rls-field-box',
        {
          focused: formControl?.focused && !_disabled,
          error: formControl?.wrong,
          disabled: _disabled
        },
        'rls-field-text'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputText
            formControl={formControl}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onValue={onValue}
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
