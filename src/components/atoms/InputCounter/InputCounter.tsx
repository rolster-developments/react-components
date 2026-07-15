import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { InputProps } from '../../types';
import { RlsButtonIcon } from '../ButtonIcon/ButtonIcon';

interface InputCounterProps extends InputProps<number>, RlsComponent {
  max?: number;
  min?: number;
  step?: number;
}

export function RlsInputCounter({
  className,
  disabled,
  formControl,
  identifier,
  max,
  min,
  onBlur,
  onFocus,
  onValue,
  readOnly,
  rlsTheme,
  step = 1,
  value: valueProp
}: InputCounterProps) {
  const changeIsInternal = useRef(false);

  const [value, setValue] = useState(formControl?.value ?? valueProp ?? 0);
  const [focused, setFocused] = useState(false);

  const _disabled = useMemo(
    () => formControl?.disabled || disabled,
    [formControl?.disabled, disabled]
  );

  const classNameCounter = useMemo(() => {
    return renderClassStatus(
      'rls-input-counter',
      {
        disabled: _disabled,
        focused: formControl?.focused ?? focused,
        readonly: readOnly
      },
      className
    );
  }, [_disabled, formControl?.focused, focused, readOnly, className]);

  useEffect(() => {
    if (!changeIsInternal.current && formControl) {
      const counterValue = formControl.value;

      if (counterValue !== undefined && counterValue !== value) {
        setValue(counterValue);
      }
    }

    changeIsInternal.current = false;
  }, [formControl?.value]);

  const onUpdate = useCallback(
    (nextValue: number) => {
      const clamped = Math.min(
        max ?? Infinity,
        Math.max(min ?? -Infinity, nextValue)
      );

      changeIsInternal.current = true;

      setValue(clamped);
      formControl?.setValue(clamped);
      onValue?.(clamped);
    },
    [formControl, max, min, onValue]
  );

  const onDecrement = useCallback(() => {
    onUpdate(value - step);
  }, [onUpdate, value, step]);

  const onIncrement = useCallback(() => {
    onUpdate(value + step);
  }, [onUpdate, value, step]);

  const decrementIsAllowed = useMemo(
    () => min !== undefined && value <= min,
    [min, value]
  );

  const incrementIsAllowed = useMemo(
    () => max !== undefined && value >= max,
    [max, value]
  );

  const onChangeInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFloat(event.target.value);

      if (!isNaN(parsed)) {
        onUpdate(parsed);
      }
    },
    [onUpdate]
  );

  const onFocusInput = useCallback(() => {
    setFocused(true);
    formControl?.focus();
    onFocus?.();
  }, [formControl, onFocus]);

  const onBlurInput = useCallback(() => {
    setFocused(false);
    formControl?.blur();
    onBlur?.();
  }, [formControl, onBlur]);

  return (
    <div id={identifier} className={classNameCounter} rls-theme={rlsTheme}>
      <RlsButtonIcon
        className="rls-input-counter__down"
        icon="minus"
        onClick={onDecrement}
        disabled={_disabled || decrementIsAllowed}
      />

      <div className="rls-input-counter__body">
        <input
          ref={formControl?.elementRef}
          className="rls-input-counter__control"
          type="text"
          inputMode="numeric"
          value={value}
          disabled={_disabled}
          readOnly={readOnly}
          onChange={onChangeInput}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
        />
      </div>

      <RlsButtonIcon
        className="rls-input-counter__up"
        icon="plus"
        onClick={onIncrement}
        disabled={_disabled || incrementIsAllowed}
      />
    </div>
  );
}
