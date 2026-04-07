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
import { renderClassStatus } from '../../../helpers/css';
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

interface PickerDayElementProps {
  day: DayState;
  onSelect: (value: number) => void;
  disabled?: boolean;
}

function RlsPickerDayHeaders() {
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

function RlsPickerDayElement({
  day,
  onSelect,
  disabled
}: PickerDayElementProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-picker-day__element', {
      disabled: day.disabled || disabled,
      focused: day.focused,
      forbidden: day.forbidden,
      selected: day.selected,
      today: day.today
    });
  }, [day, disabled]);

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
  date,
  disabled,
  formControl,
  maxDate,
  month,
  minDate,
  onValue,
  rlsTheme,
  year
}: PickerDayProps) {
  const dateDay = useMemo(() => date ?? new Date(), [date]);

  const [weeks, setWeeks] = useState<WeekState[]>([]);
  const [value, setValue] = useState(formControl?.value ?? dateDay.getDate());

  const [headers, setHeaders] = useState(<RlsPickerDayHeaders />);
  const [component, setComponent] = useState(<></>);

  const setDayValue = useCallback(
    (value: number) => {
      formControl ? formControl.setValue(value) : setValue(value);
    },
    [formControl]
  );

  const onSelect = useCallback(
    (value: number) => {
      setDayValue(value);
      onValue?.(value);
    },
    [setDayValue, onValue]
  );

  useEffect(() => {
    return i18nSubscribe(() => {
      setHeaders(<RlsPickerDayHeaders />);
    });
  }, []);

  useEffect(() => {
    setComponent(
      <div className="rls-picker-day__component">
        {weeks.map(({ days }, index) => (
          <div key={index} className="rls-picker-day__week">
            {days.map((day, index) => (
              <RlsPickerDayElement
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
  }, [weeks, onSelect, disabled]);

  useEffect(() => {
    const options = createPickerOptions();

    const day = verifyDayPicker(options);

    day ? setDayValue(day) : setWeeks(createDayPicker(options));
  }, [dateDay, month, year, value, minDate, maxDate]);

  useEffect(() => {
    const day = verifyDayPicker(createPickerOptions());

    day
      ? formControl?.setValue(day)
      : setValue(formControl?.value || dateDay.getDate());
  }, [formControl?.value]);

  const createPickerOptions = useCallback(() => {
    return {
      date: dateDay,
      day: formControl?.value ?? value,
      month: month ?? dateDay.getMonth(),
      year: year ?? dateDay.getFullYear(),
      minDate,
      maxDate
    };
  }, [dateDay, formControl?.value, value, month, year, minDate, maxDate]);

  return (
    <div className="rls-picker-day" rls-theme={rlsTheme}>
      {headers}

      {component}
    </div>
  );
}
