import {
  createDayRangePicker,
  DayRangeState,
  WeekRangeState
} from '@rolster/components';
import {
  assignDayInDate,
  DAY_LABELS,
  dateIsBefore,
  dateFormatTemplate,
  DateRange,
  normalizeMinTime
} from '@rolster/dates';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './PickerDayRange.css';

const formatRange = '{dd}/{mx}/{aa}';

interface PickerDayRangeProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, DateRange>;
  maxDate?: Date;
  minDate?: Date;
}

interface PickerDayRangeItemProps {
  day: DayRangeState;
  onSelect: (value: number) => void;
  disabled?: boolean;
}

function RlsPickerDayRangeHeaders() {
  return (
    <div className="rls-picker-day__header">
      {DAY_LABELS().map((title, index) => (
        <label key={index} className="rls-picker-day__label">
          {title}
        </label>
      ))}
    </div>
  );
}

function RlsPickerDayRangeItem({
  day,
  onSelect,
  disabled
}: PickerDayRangeItemProps) {
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
  date: _date,
  disabled,
  formControl,
  maxDate,
  minDate,
  rlsTheme
}: PickerDayRangeProps) {
  const _range = useMemo(() => {
    return formControl?.value ?? DateRange.now();
  }, [formControl?.value]);

  const date = useMemo(() => {
    return normalizeMinTime(_date ?? _range.minDate);
  }, [_date]);

  const sourceDate = useRef(_range.minDate);

  const [weeks, setWeeks] = useState<WeekRangeState[]>([]);
  const [range, setRange] = useState(_range);

  const [headers, setHeaders] = useState(<RlsPickerDayRangeHeaders />);
  const [component, setComponent] = useState(<></>);

  useEffect(() => {
    return i18nSubscribe(() => {
      setHeaders(<RlsPickerDayRangeHeaders />);
    });
  }, []);

  useEffect(() => {
    setComponent(
      <div className="rls-picker-day-range__component">
        {weeks.map(({ days }, index) => (
          <div key={index} className="rls-picker-day-range__week">
            {days.map((day, index) => (
              <RlsPickerDayRangeItem
                key={index}
                day={day}
                onSelect={onSelect}
                disabled={disabled}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }, [weeks]);

  useEffect(() => {
    setWeeks(
      createDayRangePicker({
        date,
        range,
        sourceDate: sourceDate.current,
        minDate,
        maxDate
      })
    );
  }, [date, range, minDate, maxDate]);

  const title = useMemo(() => {
    return (
      <div className="rls-picker-day-range__title">
        {dateFormatTemplate(sourceDate.current, formatRange)}
      </div>
    );
  }, [sourceDate.current]);

  const onSelect = useCallback(
    (value: number) => {
      const _date = assignDayInDate(date, value);

      const range = dateIsBefore(_date, sourceDate.current)
        ? new DateRange(sourceDate.current, _date)
        : new DateRange(_date, sourceDate.current);

      sourceDate.current = _date;

      setRange(range);
      formControl?.setValue(range);
    },
    [date, sourceDate.current, formControl]
  );

  return (
    <div className="rls-picker-day-range" rls-theme={rlsTheme}>
      {title}

      {headers}

      {component}
    </div>
  );
}
