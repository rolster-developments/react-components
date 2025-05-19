import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsInputText } from '../../atoms/InputText/InputText';
import { FieldBoxProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldText.css';

export function RlsFieldText(props: FieldBoxProps<string>) {
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
      'rls-field-text'
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
          <RlsInputText {...props} />
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
