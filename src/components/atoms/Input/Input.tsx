import {
  ChangeEvent,
  CompositionEvent,
  HTMLInputTypeAttribute,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { InputProps as RolsterInputProps } from '../../types';

interface InputProps extends RolsterInputProps<any>, RlsComponent {
  decimals?: number;
  type?: HTMLInputTypeAttribute;
}

function valueToInput(value: unknown): string {
  return value ? String(value) : '';
}

function selectionStartOf(element: HTMLInputElement): number | null {
  try {
    // Lanza o retorna null en inputs sin selección (number, email, etc.)
    return element.selectionStart;
  } catch {
    return null;
  }
}

/**
 * Escribe el valor formateado directamente en el DOM y conserva la posición
 * del cursor, corrigiéndola por la diferencia de longitud. Es necesario
 * porque, cuando el formateador rechaza un carácter, el estado del control
 * no cambia y React no vuelve a escribir el input.
 */
function writeInputValue(element: HTMLInputElement, valueInput: string): void {
  const rawInput = element.value;

  if (rawInput === valueInput) {
    return;
  }

  const selection = selectionStartOf(element);

  element.value = valueInput;

  if (selection !== null) {
    const offset = valueInput.length - rawInput.length;
    const caret = Math.max(0, Math.min(selection + offset, valueInput.length));

    element.setSelectionRange(caret, caret);
  }
}

function RlsInputComponent({
  children,
  decimals,
  disabled,
  formControl,
  identifier,
  onBlur,
  onEnter,
  onFocus,
  onKeyDown,
  onKeyUp,
  onValue,
  placeholder,
  readOnly,
  type,
  value
}: InputProps) {
  const [valueInput, setValueInput] = useState(() =>
    valueToInput(formControl?.value ?? value)
  );
  const [focused, setFocused] = useState(false);

  const composing = useRef(false);
  const valueSent = useRef<unknown>(formControl?.value);

  useEffect(() => {
    if (formControl && !Object.is(formControl.value, valueSent.current)) {
      const valueControl = valueToInput(formControl.value);

      if (valueInput !== valueControl) {
        setValueInput(valueControl);
      }
    }
  }, [formControl?.value]);

  const applyInput = useCallback(
    (element: HTMLInputElement) => {
      const rawInput = element.value;

      const parsed =
        type === 'number'
          ? parseFloat((+rawInput).toFixed(decimals))
          : rawInput;

      const formatter = formControl?.formatter;

      const value =
        formatter && formControl?.formatOn !== 'blur' && !composing.current
          ? formatter(parsed)
          : parsed;

      const textInput = Object.is(value, parsed)
        ? rawInput
        : type === 'number'
          ? Number.isNaN(value)
            ? ''
            : String(value)
          : valueToInput(value);

      writeInputValue(element, textInput);

      valueSent.current = value;

      onValue?.(value);
      setValueInput(textInput);
      formControl?.setValue(value);
    },
    [formControl, onValue, type, decimals]
  );

  const onChangeInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      applyInput(event.target);
    },
    [applyInput]
  );

  const onCompositionStart = useCallback(() => {
    composing.current = true;
  }, []);

  const onCompositionEnd = useCallback(
    (event: CompositionEvent<HTMLInputElement>) => {
      composing.current = false;
      applyInput(event.currentTarget);
    },
    [applyInput]
  );

  const onKeyDownInput = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);

      if (event.key === 'Enter') {
        onEnter?.();
      }
    },
    [onKeyDown, onEnter]
  );

  const onKeyUpInput = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyUp?.(event);
    },
    [onKeyUp]
  );

  const onFocusInput = useCallback(() => {
    formControl?.focus();
    setFocused(() => true);
    onFocus?.();
  }, [formControl, onFocus]);

  const onBlurInput = useCallback(() => {
    formControl?.blur();
    setFocused(() => false);
    onBlur?.();
  }, [formControl, onBlur]);

  const className = renderClassStatus('rls-input', {
    disabled: formControl?.disabled || disabled,
    focused: formControl?.focused ?? focused
  });

  return (
    <div id={identifier} className={className}>
      <input
        ref={formControl?.elementRef}
        className="rls-input__component"
        autoComplete="off"
        type={type ?? 'text'}
        placeholder={placeholder}
        disabled={formControl?.disabled || disabled}
        readOnly={readOnly}
        onFocus={onFocusInput}
        onBlur={onBlurInput}
        onChange={onChangeInput}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onKeyDown={onKeyDownInput}
        onKeyUp={onKeyUpInput}
        value={valueInput}
      />
      <span className="rls-input__value">{children}</span>
    </div>
  );
}

export const RlsInput = memo(RlsInputComponent);
