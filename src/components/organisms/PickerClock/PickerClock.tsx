import { PickerListener, PickerListenerEvent } from '@rolster/components';
import { Time } from '@rolster/dates';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import {
  MouseEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState
} from 'react';
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
  onValue: (value: number) => void;
  selectionIsHours: boolean;
  value: number;
}

function formatTime(value: number): string {
  return String(value).padStart(2, '0');
}

const CLOCK_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const RADIUS = 48;
const DIAL_RADIUS = 60;
const TICK_RADIUS = 7;

function RlsPickerClockTick({
  onValue,
  selectionIsHours,
  value
}: PickerClockTickProps) {
  const styleTick = useMemo(() => {
    const radian = (value / 6) * Math.PI;
    const x = Math.sin(radian) * RADIUS;
    const y = Math.cos(radian) * RADIUS;

    return {
      left: `${DIAL_RADIUS + x - TICK_RADIUS - 1}rem`,
      top: `${DIAL_RADIUS - y - TICK_RADIUS - 1}rem`
    };
  }, []);

  const label = useMemo(() => {
    if (selectionIsHours) {
      return formatTime(value);
    }

    if (value === 12) {
      return formatTime(0);
    }

    return formatTime(value * 5);
  }, [selectionIsHours]);

  const onClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      onValue(value);
    },
    [onValue]
  );

  return (
    <div className="rls-picker-clock__tick" style={styleTick} onClick={onClick}>
      {label}
    </div>
  );
}

export function RlsPickerClock({
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

  const classNameHour = useMemo(() => {
    return renderClassStatus('rls-picker-clock__title__value', {
      active: selectionIsHours
    });
  }, [selectionIsHours]);

  const classNameMinute = useMemo(() => {
    return renderClassStatus('rls-picker-clock__title__value', {
      active: !selectionIsHours
    });
  }, [selectionIsHours]);

  const classNameAM = useMemo(() => {
    return renderClassStatus('rls-picker-clock__zone__value', {
      active: !zoneIsPM
    });
  }, [zoneIsPM]);

  const classNamePM = useMemo(() => {
    return renderClassStatus('rls-picker-clock__zone__value', {
      active: zoneIsPM
    });
  }, [zoneIsPM]);

  const refreshClockHour = useEffectEvent(() => {
    refreshClock(hour > 12 ? hour - 12 : hour);
  });

  const refreshClockMinute = useEffectEvent(() => {
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
    selectionIsHours ? refreshClockHour() : refreshClockMinute();
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

  const refreshComponent = useCallback(
    (clientX: number, clientY: number) => {
      const rectangle = plateElement.current.getBoundingClientRect();
      const centerX = rectangle.left + rectangle.width / 2;
      const centerY = rectangle.top + rectangle.height / 2;

      const positionX = clientX - centerX;
      const positionY = clientY - centerY;

      const angle = Math.atan2(-positionX, positionY) + Math.PI;

      const value = Math.round(angle / radianUnit);

      refreshClock(value);

      selectionIsHours ? setHour(value === 0 ? 12 : value) : setMinute(value);
    },
    [selectionIsHours, radianUnit]
  );

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

  const onActiveSelection = useCallback(() => {
    selectionIsActive.current = true;
  }, []);

  const onMouseSelection = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (selectionIsActive.current) {
        event.preventDefault();
        refreshComponent(event.clientX, event.clientY);
      }
    },
    [refreshComponent]
  );

  const onTouchSelection = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const touch = event.touches.item(0);

      if (selectionIsActive.current && touch) {
        refreshComponent(touch.clientX, touch.clientY);
      }
    },
    [refreshComponent]
  );

  const onInactiveSelection = useCallback(() => {
    selectionIsActive.current = false;
  }, []);

  const onClickValue = useCallback(
    (value: number) => {
      if (selectionIsHours) {
        setHour(value);
        refreshClock(value);
      } else {
        const minute = value === 12 ? 0 : value * 5;

        setMinute(minute);
        refreshClock(minute);
      }
    },
    [selectionIsHours]
  );

  const onCancel = useCallback(() => {
    onListener?.({ event: PickerListenerEvent.Cancel });
  }, [onListener]);

  const onCurrentTime = useCallback(() => {
    const currentTime = Time.now();

    changeIsInternal.current = true;
    formControl?.setValue(currentTime);
    setHour(currentTime.hour);
    setMinute(currentTime.minute);

    onListener?.({
      event: PickerListenerEvent.Select,
      value: currentTime
    });
  }, [formControl, onListener]);

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
          onMouseDown={onActiveSelection}
          onMouseMove={onMouseSelection}
          onMouseUp={onInactiveSelection}
          onMouseLeave={onInactiveSelection}
          onTouchStart={onActiveSelection}
          onTouchMove={onTouchSelection}
          onTouchEnd={onInactiveSelection}
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
                  onValue={onClickValue}
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
          <RlsButton type="gradient" onClick={onSelect}>
            {labels.timeActionSelect}
          </RlsButton>
        </div>
      </div>
    </div>
  );
}
