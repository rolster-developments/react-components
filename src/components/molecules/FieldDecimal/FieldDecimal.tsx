import { BigDecimal } from '@rolster/commons';
import { useMemo } from 'react';

import { renderClassStatus } from '../../../helpers/css';
import { RlsInputDecimal } from '../../atoms/InputDecimal/InputDecimal';
import { FieldProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';

interface FieldDecimalProps extends FieldProps<BigDecimal> {
  decimals?: number;
  symbol?: string;
}

export function RlsFieldDecimal(props: FieldDecimalProps) {
  const { children, formControl, identifier, rlsTheme } = props;

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
      'rls-field-decimal'
    );
  }, [formControl?.focused, formControl?.wrong, props.readOnly, disabled]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputDecimal {...props} />
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
