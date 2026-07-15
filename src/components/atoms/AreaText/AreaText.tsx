import { ReactControl } from '@rolster/react-forms';
import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

export type RolsterReactAreaTextControl<T = string> =
  | ReactControl<HTMLTextAreaElement, T>
  | ReactControl<HTMLTextAreaElement, T | undefined>;

export interface AreaTextProps extends RlsComponent {
  autoComplete?: TextareaHTMLAttributes<HTMLTextAreaElement>['autoComplete'];
  disabled?: boolean;
  formControl?: RolsterReactAreaTextControl<string>;
  identifier?: string;
  onBlur?: () => void;
  onEnter?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onValue?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  resize?: CSSProperties['resize'];
  rows?: number;
  value?: string;
}

export function RlsAreaText({
  autoComplete,
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
  resize,
  rows = 1,
  value
}: AreaTextProps) {
  const valueInitial = String(formControl?.value ?? value ?? '');

  const [valueArea, setValueArea] = useState(valueInitial);
  const [focused, setFocused] = useState(false);

  const elementRef = useRef<HTMLTextAreaElement>(null);
  const areaRef = formControl?.elementRef ?? elementRef;

  const changeIsInternal = useRef(false);

  const refreshHeight = useCallback(() => {
    const element = areaRef.current;

    if (element) {
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    }
  }, [areaRef]);

  useEffect(() => {
    if (!changeIsInternal.current) {
      const nextValue = String(formControl?.value ?? value ?? '');

      if (valueArea !== nextValue) {
        setValueArea(nextValue);
      }
    }

    changeIsInternal.current = false;
  }, [formControl?.value, value, valueArea]);

  useEffect(() => {
    refreshHeight();
  }, [refreshHeight, valueArea]);

  const onChangeArea = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.target.value;

      changeIsInternal.current = true;

      onValue?.(nextValue);
      setValueArea(nextValue);
      formControl?.setValue(nextValue);

      event.target.style.height = 'auto';
      event.target.style.height = `${event.target.scrollHeight}px`;
    },
    [formControl, onValue]
  );

  const onKeyDownArea = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event);

      if (event.key === 'Enter') {
        onEnter?.();
      }
    },
    [onKeyDown, onEnter]
  );

  const onKeyUpArea = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyUp?.(event);
    },
    [onKeyUp]
  );

  const onFocusArea = useCallback(() => {
    formControl?.focus();
    setFocused(() => true);
    onFocus?.();
  }, [formControl, onFocus]);

  const onBlurArea = useCallback(() => {
    formControl?.blur();
    setFocused(() => false);
    onBlur?.();
  }, [formControl, onBlur]);

  const className = useMemo(() => {
    return renderClassStatus('rls-area-text', {
      disabled: formControl?.disabled || disabled,
      focused: formControl?.focused ?? focused,
      readonly: readOnly
    });
  }, [
    formControl?.disabled,
    formControl?.focused,
    disabled,
    focused,
    readOnly
  ]);

  return (
    <div id={identifier} className={className}>
      <textarea
        ref={areaRef}
        className="rls-area-text__component"
        autoComplete={autoComplete ?? 'off'}
        placeholder={placeholder}
        disabled={formControl?.disabled || disabled}
        readOnly={readOnly}
        rows={rows}
        style={{ resize }}
        onFocus={onFocusArea}
        onBlur={onBlurArea}
        onChange={onChangeArea}
        onKeyDown={onKeyDownArea}
        onKeyUp={onKeyUpArea}
        value={valueArea}
      />
      <span className="rls-area-text__value">{valueArea}</span>
    </div>
  );
}
