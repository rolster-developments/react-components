import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent as ReactKeyboardEvent,
  memo,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import { renderClassStatus } from '../../../helpers/css';
import {
  normalizeSliderValue,
  sliderRateToValue,
  sliderValueToRate
} from '../../../helpers/slider';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';

const DEFAULT_STEP = 1;
const PAGE_STEP_DIVISOR = 10;

interface SliderProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxValue?: number;
  minValue?: number;
  onValue?: (value: number) => void;
  prefixIcon?: string;
  step?: number;
  value?: number;
}

function RlsSliderComponent({
  children,
  className,
  disabled,
  formControl,
  identifier,
  maxValue,
  minValue,
  onValue,
  prefixIcon,
  rlsTheme,
  step,
  value
}: SliderProps) {
  const minValueSlider = useMemo(() => {
    return minValue ?? 0;
  }, [minValue]);

  const maxValueSlider = useMemo(() => {
    return maxValue ?? 100;
  }, [maxValue]);

  const stepSlider = useMemo(() => {
    return step && step > 0 ? step : DEFAULT_STEP;
  }, [step]);

  const [valueSlider, setValueSlider] = useState(() => {
    return normalizeSliderValue(
      formControl?.value ?? value ?? 0,
      minValueSlider,
      maxValueSlider,
      stepSlider
    );
  });

  const [dragging, setDragging] = useState(false);

  const refTrack = useRef<HTMLDivElement>(null!);
  const refThumb = useRef<HTMLDivElement>(null!);

  const refValue = useRef(valueSlider);
  const refValueExternal = useRef(formControl?.value ?? value);

  const labelId = useId();

  const rate = useMemo(() => {
    return sliderValueToRate(valueSlider, minValueSlider, maxValueSlider);
  }, [valueSlider, minValueSlider, maxValueSlider]);

  const classNameSlider = renderClassStatus(
    'rls-slider',
    {
      complet: valueSlider === maxValueSlider,
      disabled: disabled,
      dragging: dragging,
      empty: valueSlider === minValueSlider
    },
    className
  );

  const commitValue = useCallback(
    (valueNext: number) => {
      if (refValue.current === valueNext) {
        return;
      }

      refValue.current = valueNext;

      setValueSlider(valueNext);
      formControl?.setValue(valueNext);
      onValue?.(valueNext);
    },
    [formControl, onValue]
  );

  const commitRate = useCallback(
    (rateNext: number) => {
      commitValue(
        sliderRateToValue(rateNext, minValueSlider, maxValueSlider, stepSlider)
      );
    },
    [commitValue, minValueSlider, maxValueSlider, stepSlider]
  );

  const calculateRateFromClientX = useCallback((clientX: number) => {
    const { left, width } = refTrack.current.getBoundingClientRect();

    return width > 0 ? ((clientX - left) / width) * 100 : 0;
  }, []);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      event.preventDefault();
      refThumb.current.focus();

      setDragging(true);
      commitRate(calculateRateFromClientX(event.clientX));
    },
    [disabled, commitRate, calculateRateFromClientX]
  );

  const calculateValueFromKey = useCallback(
    (key: string): number | undefined => {
      const pageStep = Math.max(
        stepSlider,
        (maxValueSlider - minValueSlider) / PAGE_STEP_DIVISOR
      );

      switch (key) {
        case 'ArrowRight':
        case 'ArrowUp':
          return refValue.current + stepSlider;
        case 'ArrowLeft':
        case 'ArrowDown':
          return refValue.current - stepSlider;
        case 'PageUp':
          return refValue.current + pageStep;
        case 'PageDown':
          return refValue.current - pageStep;
        case 'Home':
          return minValueSlider;
        case 'End':
          return maxValueSlider;
        default:
          return undefined;
      }
    },
    [stepSlider, minValueSlider, maxValueSlider]
  );

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      const valueNext = calculateValueFromKey(event.key);

      if (valueNext === undefined) {
        return;
      }

      event.preventDefault();

      commitValue(
        normalizeSliderValue(
          valueNext,
          minValueSlider,
          maxValueSlider,
          stepSlider
        )
      );
    },
    [
      disabled,
      calculateValueFromKey,
      commitValue,
      minValueSlider,
      maxValueSlider,
      stepSlider
    ]
  );

  useEffect(() => {
    if (!dragging) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      commitRate(calculateRateFromClientX(event.clientX));
    };

    const onPointerRelease = () => {
      setDragging(false);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerRelease);
    window.addEventListener('pointercancel', onPointerRelease);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerRelease);
      window.removeEventListener('pointercancel', onPointerRelease);
    };
  }, [dragging, commitRate, calculateRateFromClientX]);

  useEffect(() => {
    const valueInitial = formControl?.value ?? value ?? 0;

    if (valueInitial !== refValue.current) {
      formControl?.setValue(refValue.current);
      onValue?.(refValue.current);
    }
  }, []);

  useEffect(() => {
    const valueExternal = formControl?.value ?? value;

    if (
      valueExternal === undefined ||
      valueExternal === refValueExternal.current
    ) {
      return;
    }

    refValueExternal.current = valueExternal;

    commitValue(
      normalizeSliderValue(
        valueExternal,
        minValueSlider,
        maxValueSlider,
        stepSlider
      )
    );
  }, [
    value,
    formControl?.value,
    commitValue,
    minValueSlider,
    maxValueSlider,
    stepSlider
  ]);

  useEffect(() => {
    commitValue(
      normalizeSliderValue(
        refValue.current,
        minValueSlider,
        maxValueSlider,
        stepSlider
      )
    );
  }, [commitValue, minValueSlider, maxValueSlider, stepSlider]);

  return (
    <div id={identifier} className={classNameSlider} rls-theme={rlsTheme}>
      {children && (
        <span id={labelId} className="rls-slider__label">
          {children}
        </span>
      )}

      <div className="rls-slider__body">
        {prefixIcon && <RlsIcon value={prefixIcon} />}

        <div className="rls-slider__component" onPointerDown={onPointerDown}>
          <div ref={refTrack} className="rls-slider__track">
            <div
              className="rls-slider__track__on"
              style={{ width: `${rate}%` }}
            ></div>
          </div>

          <div
            ref={refThumb}
            className="rls-slider__thumb"
            style={{ left: `${rate}%` }}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-orientation="horizontal"
            aria-valuemin={minValueSlider}
            aria-valuemax={maxValueSlider}
            aria-valuenow={valueSlider}
            aria-disabled={disabled || undefined}
            aria-labelledby={children ? labelId : undefined}
            onKeyDown={onKeyDown}
          >
            {valueSlider}
          </div>
        </div>
      </div>
    </div>
  );
}

export const RlsSlider = memo(RlsSliderComponent);
