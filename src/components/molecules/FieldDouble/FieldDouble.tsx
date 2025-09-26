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
  const {
    children,
    disabled,
    formControl,
    identifier,
    msgErrorDisabled,
    rlsTheme
  } = props;

  const className = useMemo(() => {
    const _disabled = formControl?.disabled || disabled;

    return renderClassStatus(
      'rls-field-box',
      {
        focused: formControl?.focused && !_disabled,
        error: formControl?.wrong,
        disabled: _disabled
      },
      'rls-field-double'
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
