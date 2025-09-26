import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsInputText } from '../../atoms/InputText/InputText';
import { FieldBoxProps } from '../../types';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';
import './FieldText.css';

export function RlsFieldText(props: FieldBoxProps<string>) {
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
      'rls-field-text'
    );
  }, [formControl?.focused, formControl?.wrong, props.readOnly, disabled]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      {children && <span className="rls-field-box__label">{children}</span>}

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
