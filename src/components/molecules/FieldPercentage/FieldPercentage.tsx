import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsInputPercentage } from '../../atoms/InputPercentage/InputPercentage';
import { FieldBoxProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldPercentage.css';

interface FieldPercentageProps extends FieldBoxProps<number> {
  decimals?: number;
}

export function RlsFieldPercentage(props: FieldPercentageProps) {
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
      'rls-field-percentage'
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
          <RlsInputPercentage {...props} />
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
