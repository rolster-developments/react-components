import { renderClassStatus } from '../../../helpers/css';
import { RlsInputMoney } from '../../atoms';
import { FieldBoxProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldMoney.css';

interface FieldMoneyProps extends FieldBoxProps<number> {
  decimals?: boolean;
  symbol?: string;
}

export function RlsFieldMoney({
  children,
  decimals,
  disabled,
  formControl,
  identifier,
  msgErrorDisabled,
  onValue,
  placeholder,
  symbol,
  rlsTheme,
  value
}: FieldMoneyProps) {
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
        'rls-field-money'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputMoney
            formControl={formControl}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            symbol={symbol}
            decimals={decimals}
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
