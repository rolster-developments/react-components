import { ReactControl } from '@rolster/react-forms';
import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';

interface SliderProps extends RlsComponent {
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxValue?: number;
  minValue?: number;
  onValue?: (value: number) => void;
  prefixIcon?: string;
  value?: number;
}

function calculateInitialValue(
  value: number,
  minValue: number,
  maxValue: number
): number {
  return minValue > value ? minValue : maxValue < value ? maxValue : value;
}

function calculateInitialRate(
  value: number,
  minValue: number,
  maxValue: number
): number {
  const rateMax = maxValue - minValue;
  const rateValue = value - minValue;

  return Math.ceil((rateValue / rateMax) * 100);
}

export function RlsSlider({
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
  value
}: SliderProps) {
  const minValueSlider = useMemo(() => {
    return minValue ?? 0;
  }, [minValue]);

  const maxValueSlider = useMemo(() => {
    return maxValue ?? 100;
  }, [maxValue]);

  const [valueSlider, setValue] = useState(
    calculateInitialValue(
      formControl?.value ?? value ?? 0,
      minValueSlider,
      maxValueSlider
    )
  );

  const [rate, setRate] = useState(
    calculateInitialRate(valueSlider, minValueSlider, maxValueSlider)
  );

  const refComponent = useRef<HTMLDivElement>(null!);
  const refTrack = useRef<HTMLDivElement>(null!);
  const refTrackOn = useRef<HTMLDivElement>(null!);
  const refThumb = useRef<HTMLDivElement>(null!);

  const classNameSlider = useMemo(() => {
    return renderClassStatus(
      'rls-slider',
      {
        complet: valueSlider === maxValueSlider,
        disabled: disabled,
        empty: valueSlider === minValueSlider
      },
      className
    );
  }, [valueSlider, minValueSlider, maxValueSlider, disabled]);

  useEffect(() => {
    const valueInitial = formControl?.value ?? value ?? 0;

    refThumb.current.style.left = `${rate}%`;
    refTrackOn.current.style.width = `${rate}%`;

    if (valueInitial !== valueSlider) {
      formControl?.setValue(valueSlider);
      onValue?.(valueSlider);
    }
  }, []);

  const calculateValueWithRate = useCallback(
    (rate: number) => {
      const value = Math.ceil(((maxValueSlider - minValueSlider) * rate) / 100);

      refThumb.current.style.left = `${rate}%`;
      refTrackOn.current.style.width = `${rate}%`;

      const sliderValue = value + minValueSlider;

      setRate(rate);
      setValue(sliderValue);
      formControl?.setValue(sliderValue);
      onValue?.(sliderValue);
    },
    [minValueSlider, maxValueSlider, formControl, onValue]
  );

  const onClickTrack = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const { left, width } = refTrack.current.getBoundingClientRect();

      const rate = Math.ceil(((event.clientX - left) / width) * 100);

      calculateValueWithRate(rate);
    },
    [minValueSlider, maxValueSlider]
  );

  return (
    <div id={identifier} className={classNameSlider} rls-theme={rlsTheme}>
      {children && <span className="rls-slider__label">{children}</span>}

      <div className="rls-slider__body">
        {prefixIcon && <RlsIcon value={prefixIcon} />}

        <div ref={refComponent} className="rls-slider__component">
          <div
            ref={refTrack}
            className="rls-slider__track"
            onClick={onClickTrack}
          >
            <div ref={refTrackOn} className="rls-slider__track__on"></div>
          </div>

          <div ref={refThumb} className="rls-slider__thumb">
            {rate}%
          </div>
        </div>
      </div>
    </div>
  );
}
