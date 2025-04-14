import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsInputMoney } from '../../atoms/InputMoney/InputMoney';
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
  readOnly,
  rlsTheme,
  symbol,
  value
}: FieldMoneyProps) {
  const className = useMemo(() => {
    const _disabled = formControl?.disabled || disabled;

    return renderClassStatus(
      'rls-field-box',
      {
        focused: formControl?.focused && !_disabled,
        error: formControl?.wrong,
        disabled: _disabled
      },
      'rls-field-money'
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
          <RlsInputMoney
            formControl={formControl}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
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
