import { Double } from '@rolster/commons';
import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsInputDouble } from '../../atoms/InputDouble/InputDouble';
import { FieldBoxProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldDouble.css';

interface FieldDoubleProps extends FieldBoxProps<Double> {
  decimals?: number;
  symbol?: string;
}

export function RlsFieldDouble(props: FieldDoubleProps) {
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
      'rls-field-double'
    );
  }, [formControl?.focused, formControl?.wrong, props.readOnly, disabled]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsInputDouble {...props} />
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
