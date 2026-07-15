import {
  createDayRangePicker,
  DayRangeState,
  WeekRangeState
} from '@rolster/components';
import {
  assignDayInDate,
  dateIsBefore,
  DateRange,
  DAY_LABELS,
  normalizeMinTime
} from '@rolster/dates';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface PickerDayRangeProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, DateRange>;
  maxDate?: Date;
  minDate?: Date;
}

interface PickerDayRangeElementProps {
  day: DayRangeState;
  onSelect: (value: number) => void;
  disabled?: boolean;
}

function RlsPickerDayRangeHeaders() {
  return (
    <div className="rls-picker-day__header">
      {DAY_LABELS().map((title, index) => (
        <span key={index} className="rls-picker-day__label">
          {title}
        </span>
      ))}
    </div>
  );
}

function RlsPickerDayRangeElement({
  day,
  onSelect,
  disabled
}: PickerDayRangeElementProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-picker-day-range__element', {
      disabled: day.disabled || disabled,
      end: day.end,
      forbidden: day.forbidden,
      ranged: day.ranged,
      source: day.source
    });
  }, [day.disabled, day.end, day.forbidden, day.ranged, day.source, disabled]);

  const onClick = useCallback(() => {
    day.value && !day.disabled && !disabled && onSelect(day.value);
  }, [day.value, day.disabled, disabled, onSelect]);

  return (
    <div className={className} onClick={onClick}>
      <span className="rls-picker-day-range__element__span">
        {day.value || '??'}
      </span>
    </div>
  );
}

export function RlsPickerDayRange({
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  rlsTheme
}: PickerDayRangeProps) {
  const rangeDay = useMemo(() => {
    return formControl?.value ?? DateRange.now();
  }, [formControl?.value]);

  const dateDayRange = useMemo(() => {
    return normalizeMinTime(date ?? rangeDay.minDate);
  }, [date, rangeDay]);

  const sourceDate = useRef(rangeDay.minDate);

  const [weeks, setWeeks] = useState<WeekRangeState[]>([]);
  const [range, setRange] = useState(rangeDay);
  const [_, setI18nVersion] = useState(0);

  const onSelect = useCallback(
    (value: number) => {
      const date = assignDayInDate(dateDayRange, value);

      const range = dateIsBefore(date, sourceDate.current)
        ? new DateRange(sourceDate.current, date)
        : new DateRange(date, sourceDate.current);

      sourceDate.current = date;

      setRange(range);
      formControl?.setValue(range);
    },
    [dateDayRange, formControl]
  );

  useEffect(() => {
    return i18nSubscribe(() => {
      setI18nVersion((value) => value + 1);
    });
  }, []);

  useEffect(() => {
    setWeeks(
      createDayRangePicker({
        date: dateDayRange,
        range,
        sourceDate: sourceDate.current,
        minDate,
        maxDate
      })
    );
  }, [dateDayRange, range, minDate, maxDate]);

  return (
    <div className="rls-picker-day-range" rls-theme={rlsTheme}>
      <RlsPickerDayRangeHeaders />

      <div className="rls-picker-day-range__component">
        {weeks.map(({ days }, index) => (
          <div key={index} className="rls-picker-day-range__week">
            {days.map((day, index) => (
              <RlsPickerDayRangeElement
                key={index}
                day={day}
                onSelect={onSelect}
                disabled={disabled}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
