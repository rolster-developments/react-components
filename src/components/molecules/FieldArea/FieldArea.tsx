import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import {
  AreaTextProps,
  RlsAreaText,
  RolsterReactAreaTextControl
} from '../../atoms/AreaText/AreaText';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../MessageFormError/MessageFormError';

interface FieldAreaProps extends AreaTextProps, RlsComponent {
  counter?: boolean;
  formControl?: RolsterReactAreaTextControl<string>;
  msgErrorDisabled?: boolean;
}

function RlsFieldAreaComponent(props: FieldAreaProps) {
  const { children, formControl, identifier, maxLength, rlsTheme } = props;

  const { onValue } = props;

  const disabled = useMemo(() => {
    return formControl?.disabled || props.disabled;
  }, [formControl?.disabled, props.disabled]);

  const valueSource = formControl?.value ?? props.value;

  const [valueLength, setValueLength] = useState(() => {
    return (valueSource ?? '').length;
  });

  useEffect(() => {
    if (valueSource !== undefined) {
      setValueLength(valueSource.length);
    }
  }, [valueSource]);

  const onValueArea = useCallback(
    (value: string) => {
      setValueLength(value.length);
      onValue?.(value);
    },
    [onValue]
  );

  const className = renderClassStatus(
    'rls-field-box',
    {
      disabled,
      error: formControl?.wrong,
      focused: formControl?.focused && !disabled,
      readonly: props.readOnly
    },
    'rls-field-area'
  );

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      {children && <span className="rls-field-box__label">{children}</span>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <RlsAreaText {...props} onValue={onValueArea} />
        </div>
      </div>

      {props.counter && (
        <span className="rls-field-box__helper rls-field-area__counter">
          {maxLength ? `${valueLength} / ${maxLength}` : valueLength}
        </span>
      )}

      {!props.msgErrorDisabled && (
        <RlsMessageFormError
          className="rls-field-box__error"
          formControl={formControl}
        />
      )}
    </div>
  );
}

export const RlsFieldArea = memo(RlsFieldAreaComponent);
