import { ReactControl } from '@rolster/react-forms';
import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { RlsComponent } from '../../definitions';
import { renderClassStatus } from '../../../helpers';
import { RlsIcon } from '../../atoms';
import './Slider.css';

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

export function RlsSlider(props: SliderProps) {
  const minValue = useMemo(() => {
    return props.minValue ?? 0;
  }, [props.minValue]);

  const maxValue = useMemo(() => {
    return props.maxValue ?? 100;
  }, [props.maxValue]);

  const [value, setValue] = useState(
    calculateInitialValue(
      props.formControl?.value ?? props.value ?? 0,
      minValue,
      maxValue
    )
  );

  const [rate, setRate] = useState(
    calculateInitialRate(value, minValue, maxValue)
  );

  const refComponent = useRef<HTMLDivElement>(null!);
  const refTrack = useRef<HTMLDivElement>(null!);
  const refTrackOn = useRef<HTMLDivElement>(null!);
  const refThumb = useRef<HTMLDivElement>(null!);

  const className = useMemo(() => {
    return renderClassStatus('rls-slider', {
      complet: value === maxValue,
      disabled: props.disabled,
      empty: value === minValue
    });
  }, [value, minValue, maxValue, props.disabled]);

  useEffect(() => {
    const valueInitial = props.formControl?.value ?? props.value ?? 0;

    refThumb.current.style.left = `${rate}%`;
    refTrackOn.current.style.width = `${rate}%`;

    if (valueInitial !== value) {
      props.formControl?.setValue(value);
      props.onValue && props.onValue(value);
    }
  }, []);

  const calculateValueWithRate = useCallback(
    (rate: number) => {
      const value = Math.ceil(((maxValue - minValue) * rate) / 100);

      refThumb.current.style.left = `${rate}%`;
      refTrackOn.current.style.width = `${rate}%`;

      const sliderValue = value + minValue;

      setRate(rate);
      setValue(sliderValue);
      props.formControl?.setValue(sliderValue);
      props.onValue && props.onValue(sliderValue);
    },
    [minValue, maxValue, props.formControl, props.onValue]
  );

  const onClickTrack = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const { left, width } = refTrack.current.getBoundingClientRect();

      const rate = Math.ceil(((event.clientX - left) / width) * 100);

      calculateValueWithRate(rate);
    },
    [minValue, maxValue]
  );

  return (
    <div className={className}>
      {props.children && (
        <span className="rls-slider__label">{props.children}</span>
      )}

      <div className="rls-slider__body">
        {props.prefixIcon && <RlsIcon value={props.prefixIcon} />}

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
