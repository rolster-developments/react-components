import {
  DAY_LABELS,
  DateRange,
  assignDay,
  normalizeMinTime
} from '@rolster/helpers-date';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { WeekRangeState } from '../../../models';
import { createRangePicker } from '../../../helpers/date-range-picker';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './DayRangePicker.css';

interface DayRangePickerProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, DateRange>;
  maxDate?: Date;
  minDate?: Date;
}

export function RlsDayRangePicker({
  date,
  disabled: disabledPicker,
  formControl,
  maxDate,
  minDate,
  rlsTheme
}: DayRangePickerProps) {
  const initialRange = formControl?.state || DateRange.now();
  const initialDate = normalizeMinTime(date || initialRange.minDate);

  const [weeks, setWeeks] = useState<WeekRangeState[]>([]);
  const [range, setRange] = useState(initialRange);

  useEffect(() => {
    setWeeks(
      createRangePicker({
        date: initialDate,
        range,
        minDate,
        maxDate
      })
    );
  }, [range, date, minDate, maxDate]);

  function onChange(value: number): void {
    const newRange = range.recalculate(assignDay(initialDate, value));

    setRange(newRange);
    formControl?.setState(newRange);
  }

  return (
    <div className="rls-day-range-picker" rls-theme={rlsTheme}>
      <div className="rls-day-range-picker__header">
        {DAY_LABELS().map((title, index) => (
          <label key={index} className="rls-day-range-picker__label">
            {title}
          </label>
        ))}
      </div>

      <div className="rls-day-range-picker__component">
        {weeks.map(({ days }, index) => (
          <div key={index} className="rls-day-range-picker__week">
            {days.map(
              ({ value, disabled, forbidden, ranged, selected }, index) => (
                <div
                  key={index}
                  className={renderClassStatus('rls-day-range-picker__day', {
                    disabled: disabled || disabledPicker,
                    forbidden,
                    selected,
                    ranged
                  })}
                  onClick={() => {
                    if (value && !disabled) {
                      onChange(value);
                    }
                  }}
                >
                  <span className="rls-day-range-picker__day__span">
                    {value || '??'}
                  </span>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
