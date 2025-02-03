import { renderClassStatus } from '../../../helpers/css';
import { RlsInputNumber } from '../../atoms';
import { FieldBoxProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldNumber.css';

export function RlsFieldNumber({
  children,
  disabled,
  formControl,
  identifier,
  msgErrorDisabled,
  onValue,
  placeholder,
  rlsTheme,
  value
}: FieldBoxProps<number>) {
  return (
    <div
      id={identifier}
      className={renderClassStatus(
        'rls-field-box',
        {
          focused: formControl?.focused,
          error: formControl?.wrong,
          disabled: formControl?.disabled || disabled
        },
        'rls-field-number'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputNumber
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
