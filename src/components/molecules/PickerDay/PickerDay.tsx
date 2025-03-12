import {
  createDayPicker,
  DayState,
  verifyDayPicker,
  WeekState
} from '@rolster/components';
import { i18nSubscribe } from '@rolster/i18n';
import { DAY_LABELS } from '@rolster/dates';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './PickerDay.css';

interface PickerDayProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  month?: Nulleable<number>;
  minDate?: Date;
  onValue?: (value: number) => void;
  year?: Nulleable<number>;
}

interface PickerDayItemProps {
  day: DayState;
  onSelect: (value: number) => void;
  disabled?: boolean;
}

function RlsPickerDayItem({ day, onSelect, disabled }: PickerDayItemProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-picker-day__element', {
      disabled: day.disabled || disabled,
      focused: day.focused,
      forbidden: day.forbidden,
      selected: day.selected,
      today: day.today
    });
  }, [
    day.disabled,
    day.focused,
    day.forbidden,
    day.selected,
    day.today,
    disabled
  ]);

  const onClick = useCallback(() => {
    day.value && !day.disabled && !disabled && onSelect(day.value);
  }, [day.value, day.disabled, disabled, onSelect]);

  return (
    <div className={className} onClick={onClick}>
      <span className="rls-picker-day__element__span">{day.value || '??'}</span>
    </div>
  );
}

export function RlsPickerDay({
  date: _date,
  disabled,
  formControl,
  maxDate,
  month,
  minDate,
  onValue,
  rlsTheme,
  year
}: PickerDayProps) {
  const date = useMemo(() => _date ?? new Date(), [_date]);

  const [weeks, setWeeks] = useState<WeekState[]>([]);
  const [value, setValue] = useState(formControl?.value || date.getDate());

  const [headers, setHeaders] = useState(<></>);
  const [component, setComponent] = useState(<></>);

  useEffect(() => {
    return i18nSubscribe(() => {
      setHeaders(
        <div className="rls-picker-day__header">
          {DAY_LABELS().map((title, index) => (
            <label key={index} className="rls-picker-day__label">
              {title}
            </label>
          ))}
        </div>
      );
    });
  }, []);

  useEffect(() => {
    setComponent(
      <div className="rls-picker-day__component">
        {weeks.map(({ days }, index) => (
          <div key={index} className="rls-picker-day__week">
            {days.map((day, index) => (
              <RlsPickerDayItem
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
    const options = createPickerOptions();

    const day = verifyDayPicker(options);

    day ? setDayValue(day) : setWeeks(createDayPicker(options));
  }, [date, month, year, value, minDate, maxDate]);

  useEffect(() => {
    const day = verifyDayPicker(createPickerOptions());

    day
      ? formControl?.setValue(day)
      : setValue(formControl?.value || date.getDate());
  }, [formControl?.value]);

  const createPickerOptions = useCallback(() => {
    return {
      date,
      day: formControl?.value ?? value,
      month: month ?? date.getMonth(),
      year: year ?? date.getFullYear(),
      minDate,
      maxDate
    };
  }, [date, value, formControl?.value, year, month, minDate, maxDate]);

  const setDayValue = useCallback(
    (value: number) => {
      formControl ? formControl.setValue(value) : setValue(value);
    },
    [formControl]
  );

  const onSelect = useCallback(
    (value: number) => {
      setDayValue(value);
      onValue && onValue(value);
    },
    [setDayValue, onValue]
  );

  return (
    <div className="rls-picker-day" rls-theme={rlsTheme}>
      {headers}

      {component}
    </div>
  );
}
