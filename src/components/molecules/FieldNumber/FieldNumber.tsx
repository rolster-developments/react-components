import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsInputNumber } from '../../atoms/InputNumber/InputNumber';
import { FieldBoxProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldNumber.css';

interface FieldNumberProps extends FieldBoxProps<number> {
  decimals?: number;
}

export function RlsFieldNumber(props: FieldNumberProps) {
  const { children, formControl, identifier, msgErrorDisabled, rlsTheme } =
    props;

  const disabled = useMemo(() => {
    return formControl?.disabled || props.disabled;
  }, [formControl?.disabled, props.disabled]);

  const className = useMemo(() => {
    return renderClassStatus(
      'rls-field-box',
      {
        focused: formControl?.focused && !disabled,
        error: formControl?.wrong,
        disabled,
        readonly: props.readOnly
      },
      'rls-field-number'
    );
  }, [formControl?.focused, formControl?.wrong, props.readOnly, disabled]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputNumber {...props} />
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
