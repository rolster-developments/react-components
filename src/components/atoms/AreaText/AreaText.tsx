import { ReactControl } from '@rolster/react-forms';
import {
  ChangeEvent,
  CompositionEvent,
  CSSProperties,
  KeyboardEvent,
  memo,
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

const AREA_TEXT_MAX_ROWS = 8;
const AREA_TEXT_MIN_ROWS = 3;

function writeAreaValue(element: HTMLTextAreaElement, valueArea: string): void {
  const rawArea = element.value;

  if (rawArea === valueArea) {
    return;
  }

  const selection = element.selectionStart;
  const offset = valueArea.length - rawArea.length;
  const caret = Math.max(0, Math.min(selection + offset, valueArea.length));

  element.value = valueArea;
  element.setSelectionRange(caret, caret);
}

export type RolsterReactAreaTextControl<T = string> =
  | ReactControl<HTMLTextAreaElement, T>
  | ReactControl<HTMLTextAreaElement, T | undefined>;

export interface AreaTextProps extends RlsComponent {
  autoComplete?: TextareaHTMLAttributes<HTMLTextAreaElement>['autoComplete'];
  disabled?: boolean;
  formControl?: RolsterReactAreaTextControl<string>;
  identifier?: string;
  maxLength?: number;
  maxRows?: number;
  minRows?: number;
  onBlur?: () => void;
  onEnter?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onValue?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  resize?: CSSProperties['resize'];
  value?: string;
}

function RlsAreaTextComponent({
  autoComplete,
  disabled,
  formControl,
  identifier,
  maxLength,
  maxRows,
  minRows,
  onBlur,
  onEnter,
  onFocus,
  onKeyDown,
  onKeyUp,
  onValue,
  placeholder,
  readOnly,
  resize = 'vertical',
  value
}: AreaTextProps) {
  const valueInitial = String(formControl?.value ?? value ?? '');

  const rowsMin = minRows ?? AREA_TEXT_MIN_ROWS;
  const rowsMax = Math.max(maxRows ?? AREA_TEXT_MAX_ROWS, rowsMin);

  const [valueArea, setValueArea] = useState(valueInitial);
  const [focused, setFocused] = useState(false);

  const elementRef = useRef<HTMLTextAreaElement>(null);
  const areaRef = formControl?.elementRef ?? elementRef;

  const composing = useRef(false);
  const valueSent = useRef<unknown>(formControl?.value);
  const valueSource = useRef<unknown>(formControl ? formControl.value : value);
  const heightIsManual = useRef(false);
  const heightApplied = useRef(0);

  const refreshHeight = useCallback(() => {
    const element = areaRef.current;

    if (!element || heightIsManual.current) {
      return;
    }

    element.style.height = 'auto';

    const { lineHeight, paddingBottom, paddingTop } = getComputedStyle(element);

    const heightLine = parseFloat(lineHeight);
    const heightContent = element.scrollHeight;

    if (!heightLine) {
      element.style.height = `${heightContent}px`;
      heightApplied.current = heightContent;

      return;
    }

    const heightPadding = parseFloat(paddingTop) + parseFloat(paddingBottom);
    const heightMin = heightLine * rowsMin + heightPadding;
    const heightMax = heightLine * rowsMax + heightPadding;

    const height = Math.min(Math.max(heightContent, heightMin), heightMax);

    element.style.height = `${height}px`;
    element.style.overflowY = heightContent > heightMax ? 'auto' : 'hidden';

    heightApplied.current = height;
  }, [areaRef, rowsMax, rowsMin]);

  useEffect(() => {
    const source = formControl ? formControl.value : value;

    const isEcho = Object.is(source, valueSent.current);
    const isSame = Object.is(source, valueSource.current);

    valueSource.current = source;

    if (!isEcho && !isSame) {
      const nextValue = String(source ?? '');

      if (valueArea !== nextValue) {
        setValueArea(nextValue);
      }
    }
  }, [formControl?.value, value, valueArea]);

  useEffect(() => {
    refreshHeight();
  }, [refreshHeight, valueArea]);

  useEffect(() => {
    const element = areaRef.current;

    if (
      !element ||
      resize === 'none' ||
      typeof ResizeObserver === 'undefined'
    ) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (heightIsManual.current || !heightApplied.current) {
        return;
      }

      if (Math.abs(element.offsetHeight - heightApplied.current) > 1) {
        heightIsManual.current = true;
        element.style.overflowY = 'auto';
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [areaRef, resize]);

  const applyArea = useCallback(
    (element: HTMLTextAreaElement) => {
      const rawArea = element.value;
      const formatter = formControl?.formatter;

      const nextValue =
        formatter && formControl?.formatOn !== 'blur' && !composing.current
          ? (formatter(rawArea) ?? '')
          : rawArea;

      writeAreaValue(element, nextValue);

      valueSent.current = nextValue;

      onValue?.(nextValue);
      setValueArea(nextValue);
      formControl?.setValue(nextValue);
    },
    [formControl, onValue]
  );

  const onChangeArea = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      applyArea(event.target);
    },
    [applyArea]
  );

  const onCompositionStart = useCallback(() => {
    composing.current = true;
  }, []);

  const onCompositionEnd = useCallback(
    (event: CompositionEvent<HTMLTextAreaElement>) => {
      composing.current = false;
      applyArea(event.currentTarget);
    },
    [applyArea]
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

  const disabledArea = formControl?.disabled || disabled;

  const className = renderClassStatus('rls-area-text', {
    disabled: disabledArea,
    focused: formControl?.focused ?? focused,
    readonly: readOnly,
    resizable: resize !== 'none' && !disabledArea && !readOnly
  });

  return (
    <div id={identifier} className={className}>
      <textarea
        ref={areaRef}
        className="rls-area-text__component"
        autoComplete={autoComplete ?? 'off'}
        placeholder={placeholder}
        disabled={disabledArea}
        readOnly={readOnly}
        maxLength={maxLength}
        rows={rowsMin}
        style={{ resize }}
        onFocus={onFocusArea}
        onBlur={onBlurArea}
        onChange={onChangeArea}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onKeyDown={onKeyDownArea}
        onKeyUp={onKeyUpArea}
        value={valueArea}
      />
      <span className="rls-area-text__value" aria-hidden="true">
        {valueArea}
      </span>
    </div>
  );
}

export const RlsAreaText = memo(RlsAreaTextComponent);
