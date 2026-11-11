import {
  FocusEvent,
  KeyboardEvent,
  memo,
  useCallback,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { InputProps } from '../../types';

type InputPasswordType = 'password' | 'text';

interface InputPasswordProps extends InputProps<string>, RlsComponent {
  type?: InputPasswordType;
}

function RlsInputPasswordComponent({
  disabled,
  formControl,
  identifier,
  rlsSize,
  onBlur,
  onEnter,
  onFocus,
  onKeyDown,
  onKeyUp,
  onValue,
  placeholder,
  readOnly,
  type
}: InputPasswordProps) {
  const [focused, setFocused] = useState(false);

  const _onChange = useCallback(
    (event: any) => {
      formControl?.setValue(event.target.value);
      onValue?.(event.target.value);
    },
    [formControl, onValue]
  );

  const _onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);

      if (event.key === 'Enter') {
        onEnter?.(event);
      }
    },
    [onKeyDown, onEnter]
  );

  const _onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyUp?.(event);
    },
    [onKeyUp]
  );

  const _onFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      formControl?.focus();
      setFocused(() => true);
      onFocus?.(event);
    },
    [formControl, onFocus]
  );

  const _onBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      formControl?.blur();
      setFocused(() => false);
      onBlur?.(event);
    },
    [formControl, onBlur]
  );

  const className = renderClassStatus('rls-input-password', {
    disabled: formControl?.disabled || disabled,
    focused: formControl?.focused ?? focused
  });

  return (
    <div id={identifier} className={className} rls-size={rlsSize}>
      <input
        className="rls-input-password__component"
        autoComplete="off"
        type={type ?? 'password'}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        onFocus={_onFocus}
        onBlur={_onBlur}
        onChange={_onChange}
        onKeyDown={_onKeyDown}
        onKeyUp={_onKeyUp}
      />
    </div>
  );
}

export const RlsInputPassword = memo(RlsInputPasswordComponent);
