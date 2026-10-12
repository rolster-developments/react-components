import { PickerListener, PickerListenerEvent } from '@rolster/components';
import { Time } from '@rolster/dates';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import {
  memo,
  PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useEventCallback } from '../../../controllers/EventCallbackController';
import { renderClassStatus } from '../../../helpers/css';
import { reactI18n } from '../../../i18n';
import { RlsButton } from '../../atoms/Button/Button';
import { RlsButtonAction } from '../../atoms/ButtonAction/ButtonAction';
import { RlsComponent } from '../../definitions';

interface PickerClockProps extends RlsComponent {
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, Time>
    | ReactControl<HTMLElement, Time | undefined>;
  onListener?: (listener: PickerListener<Time>) => void;
  time?: Time;
}

interface PickerClockTickProps {
  selectionIsHours: boolean;
  value: number;
}

function formatTime(value: number): string {
  return String(value).padStart(2, '0');
}

function pointerIsInsideTick(
  { clientX, clientY }: PointerEvent<HTMLElement>,
  tick: HTMLElement
): boolean {
  const { left, top, width, height } = tick.getBoundingClientRect();

  const distanceX = clientX - (left + width / 2);
  const distanceY = clientY - (top + height / 2);
  const radius = Math.min(width, height) / 2;

  return distanceX ** 2 + distanceY ** 2 <= radius ** 2;
}

const CLOCK_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const CLOCK_HOURS = 12;
const CLOCK_MINUTES = 60;
const RADIUS = 48;
const DIAL_RADIUS = 60;
const TICK_RADIUS = 7;

function RlsPickerClockTick({ selectionIsHours, value }: PickerClockTickProps) {
  const styleTick = useMemo(() => {
    const radian = (value / 6) * Math.PI;
    const x = Math.sin(radian) * RADIUS;
    const y = Math.cos(radian) * RADIUS;

    return {
      left: `${DIAL_RADIUS + x - TICK_RADIUS - 1}rem`,
      top: `${DIAL_RADIUS - y - TICK_RADIUS - 1}rem`
    };
  }, []);

  const tickValue = useMemo(() => {
    if (selectionIsHours) {
      return value;
    }

    return value === CLOCK_HOURS ? 0 : value * 5;
  }, [selectionIsHours]);

  return (
    <div
      className="rls-picker-clock__tick"
      style={styleTick}
      data-value={tickValue}
    >
      {formatTime(tickValue)}
    </div>
  );
}

function RlsPickerClockComponent({
  formControl,
  onListener,
  rlsTheme,
  time
}: PickerClockProps) {
  const timeInitial = useMemo(() => {
    return formControl?.value ?? time ?? Time.now();
  }, [formControl?.value, time]);

  const plateElement = useRef<HTMLDivElement>(null!);
  const lineElement = useRef<SVGLineElement>(null!);
  const centerElement = useRef<SVGCircleElement>(null!);
  const indicatorElement = useRef<SVGCircleElement>(null!);
  const pointElement = useRef<SVGCircleElement>(null!);

  const [labels, setLabels] = useState({
    timeActionCancel: reactI18n('dateActionCancel'),
    timeActionSelect: reactI18n('dateActionSelect')
  });

  const [zoneIsPM, setZoneIsPM] = useState(timeInitial.hour >= 12);
  const [hour, setHour] = useState(
    zoneIsPM ? timeInitial.hour - 12 : timeInitial.hour
  );
  const [minute, setMinute] = useState(timeInitial.minute);
  const [selectionIsHours, setSelectionIsHours] = useState(true);

  const changeIsInternal = useRef(true);
  const selectionIsActive = useRef(false);

  const radianUnit = useMemo(() => {
    return Math.PI / (selectionIsHours ? 6 : 30);
  }, [selectionIsHours]);

  const hourFormat = useMemo(() => {
    return formatTime(hour === 0 ? 12 : hour);
  }, [hour]);

  const minuteFormat = useMemo(() => {
    return formatTime(minute);
  }, [minute]);

  const classNameHour = renderClassStatus('rls-picker-clock__title__value', {
    active: selectionIsHours
  });

  const classNameMinute = renderClassStatus('rls-picker-clock__title__value', {
    active: !selectionIsHours
  });

  const classNameAM = renderClassStatus('rls-picker-clock__zone__value', {
    active: !zoneIsPM
  });

  const classNamePM = renderClassStatus('rls-picker-clock__zone__value', {
    active: zoneIsPM
  });

  const refreshClockHour = useEventCallback(() => {
    refreshClock(hour > 12 ? hour - 12 : hour);
  });

  const refreshClockMinute = useEventCallback(() => {
    refreshClock(minute);
  });

  useEffect(() => {
    return i18nSubscribe(() => {
      setLabels({
        timeActionCancel: reactI18n('dateActionCancel'),
        timeActionSelect: reactI18n('dateActionSelect')
      });
    });
  }, []);

  useEffect(() => {
    if (selectionIsHours) {
      refreshClockHour();
    } else {
      refreshClockMinute();
    }
  }, [selectionIsHours]);

  useEffect(() => {
    if (!changeIsInternal.current && formControl?.value) {
      const zoneIsPM = formControl.value.hour >= 12;

      setZoneIsPM(zoneIsPM);
      setHour(zoneIsPM ? formControl.value.hour - 12 : formControl.value.hour);
      setMinute(formControl.value.minute);
    }

    changeIsInternal.current = false;
  }, [formControl?.value]);

  const refreshClock = useCallback(
    (value: number) => {
      const angle = value * radianUnit;

      const x2 = Math.sin(angle) * (RADIUS - TICK_RADIUS);
      const y2 = -Math.cos(angle) * (RADIUS - TICK_RADIUS);
      const cx = Math.sin(angle) * RADIUS;
      const cy = -Math.cos(angle) * RADIUS;

      lineElement.current.setAttribute('x2', `${x2 - 1}rem`);
      lineElement.current.setAttribute('y2', `${y2 - 1}rem`);
      indicatorElement.current.setAttribute('cx', `${cx - 1}rem`);
      indicatorElement.current.setAttribute('cy', `${cy - 1}rem`);
      pointElement.current.setAttribute('cx', `${cx - 1}rem`);
      pointElement.current.setAttribute('cy', `${cy - 1}rem`);

      pointElement.current.style.visibility =
        selectionIsHours || value % 5 === 0 ? 'hidden' : 'visible';
    },
    [selectionIsHours, radianUnit]
  );

  const selectValue = useCallback(
    (value: number) => {
      refreshClock(value);

      if (selectionIsHours) {
        setHour(value === 0 ? CLOCK_HOURS : value);
      } else {
        setMinute(value);
      }
    },
    [selectionIsHours, refreshClock]
  );

  const selectFromPosition = useCallback(
    (clientX: number, clientY: number) => {
      const rectangle = plateElement.current.getBoundingClientRect();
      const centerX = rectangle.left + rectangle.width / 2;
      const centerY = rectangle.top + rectangle.height / 2;

      const positionX = clientX - centerX;
      const positionY = clientY - centerY;

      // Angle in [0, 2π) measured clockwise from 12 o'clock
      const angle = Math.atan2(-positionX, positionY) + Math.PI;
      const steps = selectionIsHours ? CLOCK_HOURS : CLOCK_MINUTES;

      // Modulo keeps the last half step before 12 o'clock as 0, not as 60/12
      selectValue(Math.round(angle / radianUnit) % steps);
    },
    [selectionIsHours, radianUnit, selectValue]
  );

  const onClickHour = useCallback(() => {
    setSelectionIsHours(true);
  }, []);

  const onClickMinute = useCallback(() => {
    setSelectionIsHours(false);
  }, []);

  const onClickAM = useCallback(() => {
    setZoneIsPM(false);
  }, []);

  const onClickPM = useCallback(() => {
    setZoneIsPM(true);
  }, []);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);

      selectionIsActive.current = true;

      const tick = (event.target as HTMLElement).closest<HTMLElement>(
        '.rls-picker-clock__tick'
      );

      // Pressing inside a label circle snaps to its exact value,
      // anywhere else (and while dragging) the angle decides
      if (tick?.dataset.value && pointerIsInsideTick(event, tick)) {
        selectValue(Number(tick.dataset.value));
      } else {
        selectFromPosition(event.clientX, event.clientY);
      }
    },
    [selectValue, selectFromPosition]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (selectionIsActive.current) {
        selectFromPosition(event.clientX, event.clientY);
      }
    },
    [selectFromPosition]
  );

  const onPointerUp = useCallback(() => {
    if (!selectionIsActive.current) {
      return;
    }

    selectionIsActive.current = false;

    // Once the hour is chosen, continue with the minutes
    if (selectionIsHours) {
      setSelectionIsHours(false);
    }
  }, [selectionIsHours]);

  const onPointerCancel = useCallback(() => {
    selectionIsActive.current = false;
  }, []);

  const onCancel = useCallback(() => {
    onListener?.({ event: PickerListenerEvent.Cancel });
  }, [onListener]);

  const onCurrentTime = useCallback(() => {
    const currentTime = Time.now();

    const zoneIsPM = currentTime.hour >= 12;
    const hour = zoneIsPM ? currentTime.hour - 12 : currentTime.hour;

    changeIsInternal.current = true;
    formControl?.setValue(currentTime);
    setZoneIsPM(zoneIsPM);
    setHour(hour);
    setMinute(currentTime.minute);
    refreshClock(selectionIsHours ? hour : currentTime.minute);

    onListener?.({
      event: PickerListenerEvent.Select,
      value: currentTime
    });
  }, [formControl, onListener, selectionIsHours, refreshClock]);

  const onSelect = useCallback(() => {
    const hourValue = zoneIsPM
      ? hour !== 12
        ? hour + 12
        : 12
      : hour === 12
        ? 0
        : hour;

    const timeValue = new Time(hourValue, minute);

    changeIsInternal.current = true;
    formControl?.setValue(timeValue);

    onListener?.({
      event: PickerListenerEvent.Select,
      value: timeValue
    });
  }, [formControl, hour, minute, zoneIsPM, onListener]);

  return (
    <div className="rls-picker-clock" rls-theme={rlsTheme}>
      <div className="rls-picker-clock__header">
        <div className="rls-picker-clock__title">
          <span className={classNameHour} onClick={onClickHour}>
            {hourFormat}
          </span>

          <span className="rls-picker-clock__title__separator">:</span>

          <span className={classNameMinute} onClick={onClickMinute}>
            {minuteFormat}
          </span>
        </div>

        <div className="rls-picker-clock__zone">
          <span className={classNameAM} onClick={onClickAM}>
            AM
          </span>

          <span className={classNamePM} onClick={onClickPM}>
            PM
          </span>
        </div>
      </div>

      <div className="rls-picker-clock__body">
        <div
          className="rls-picker-clock__plate"
          ref={plateElement}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <div className="rls-picker-clock__canvas">
            <svg width="120rem" height="120rem">
              <g
                style={{
                  transform: `translate(${DIAL_RADIUS}rem, ${DIAL_RADIUS}rem)`
                }}
              >
                <line
                  ref={lineElement}
                  className="rls-picker-clock__canvas__line"
                  x1="-1"
                  y1="-1"
                />

                <circle
                  ref={centerElement}
                  className="rls-picker-clock__canvas__center"
                  r="4"
                  cx="-1"
                  cy="-1"
                ></circle>

                <circle
                  ref={indicatorElement}
                  className="rls-picker-clock__canvas__indicator"
                  r={`${TICK_RADIUS}rem`}
                />

                <circle
                  ref={pointElement}
                  className="rls-picker-clock__canvas__point"
                  r="3.5"
                ></circle>
              </g>
            </svg>
          </div>

          <div className="rls-picker-clock__hours">
            {CLOCK_VALUES.map((value) => {
              return (
                <RlsPickerClockTick
                  key={value}
                  value={value}
                  selectionIsHours={selectionIsHours}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="rls-picker-clock__footer">
        <div className="rls-picker-clock__footer--cancel">
          <RlsButton type="flat" onClick={onCancel}>
            {labels.timeActionCancel}
          </RlsButton>
        </div>

        <div className="rls-picker-clock__footer--today">
          <RlsButtonAction icon="timer" onClick={onCurrentTime} />
        </div>

        <div className="rls-picker-clock__footer--ok">
          <RlsButton type="raised" onClick={onSelect}>
            {labels.timeActionSelect}
          </RlsButton>
        </div>
      </div>
    </div>
  );
}

export const RlsPickerClock = memo(RlsPickerClockComponent);
