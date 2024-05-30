import {
  PickerListener,
  PickerListenerType
} from '@rolster/helpers-components';
import {
  DateRange,
  assignMonthInDate,
  assignYearInDate,
  normalizeMinTime
} from '@rolster/helpers-date';
import { ReactControl, useReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { rangeFormatTemplate, renderClassStatus } from '../../../helpers';
import reactI18n from '../../../i18n';
import { RlsButton } from '../../atoms';
import { RlsComponent } from '../../definitions';
import {
  RlsDayRangePicker,
  RlsMonthPicker,
  RlsMonthTitlePicker,
  RlsYearPicker
} from '../../molecules';
import './DateRangePicker.css';

interface DateRangePickerProps extends RlsComponent {
  automatic?: boolean;
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, DateRange>;
  maxDate?: Date;
  minDate?: Date;
  onListener?: (listener: PickerListener<DateRange>) => void;
}

type Visibility = 'DAY' | 'MONTH' | 'YEAR';

export function RlsDateRangePicker({
  automatic,
  date: datePicker,
  disabled,
  formControl,
  maxDate,
  minDate,
  onListener,
  rlsTheme
}: DateRangePickerProps) {
  const dateInitial = normalizeMinTime(datePicker || new Date());
  const rangeInitial = formControl?.state || DateRange.now();

  const yearControl = useReactControl(dateInitial.getFullYear());
  const monthControl = useReactControl(dateInitial.getMonth());
  const dayControl = useReactControl(rangeInitial);

  const [value, setValue] = useState(rangeInitial);
  const [date, setDate] = useState(dateInitial);
  const [visibility, setVisibility] = useState<Visibility>('DAY');

  useEffect(() => {
    setDate((prevValue) => {
      return typeof yearControl.state === 'number'
        ? assignYearInDate(prevValue, yearControl.state)
        : prevValue;
    });
  }, [yearControl.state]);

  useEffect(() => {
    setDate((prevValue) => {
      return typeof monthControl.state === 'number'
        ? assignMonthInDate(prevValue, monthControl.state)
        : prevValue;
    });
  }, [monthControl.state]);

  useEffect(() => {
    if (dayControl.state) {
      setValue(dayControl.state);
    }

    setVisibility('DAY');
  }, [dayControl.state]);

  function onVisibilityDay(): void {
    setVisibility('DAY');
  }

  function onVisibilityMonth(): void {
    setVisibility('MONTH');
  }

  function onVisibilityYear(): void {
    setVisibility('YEAR');
  }

  function onCancel(): void {
    if (onListener) {
      onListener({ type: PickerListenerType.Cancel });
    }
  }

  function onSelect(): void {
    formControl?.setState(value);

    if (onListener) {
      onListener({ type: PickerListenerType.Select, value });
    }
  }

  return (
    <div className="rls-date-range-picker" rls-theme={rlsTheme}>
      <div className="rls-date-range-picker__header">
        <div className="rls-date-range-picker__title rls-date-range-picker__title--description">
          <span onClick={onVisibilityDay}>{rangeFormatTemplate(value)}</span>
        </div>

        <div className="rls-date-range-picker__title rls-date-range-picker__title--year">
          <span onClick={onVisibilityYear}>{yearControl.state}</span>
        </div>

        <RlsMonthTitlePicker
          monthControl={monthControl}
          yearControl={yearControl}
          date={date}
          maxDate={maxDate}
          minDate={minDate}
          disabled={visibility === 'YEAR'}
          type={visibility === 'MONTH' ? 'year' : 'month'}
          onClick={onVisibilityMonth}
        />
      </div>

      <div
        className={renderClassStatus('rls-date-range-picker__component', {
          day: visibility === 'DAY',
          month: visibility === 'MONTH',
          year: visibility === 'YEAR'
        })}
      >
        <RlsDayRangePicker
          formControl={dayControl}
          date={date}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
        />

        <RlsMonthPicker
          formControl={monthControl}
          year={yearControl.state}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />

        <RlsYearPicker
          formControl={yearControl}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />
      </div>

      <div
        className={renderClassStatus('rls-date-range-picker__footer', {
          automatic
        })}
      >
        <div className="rls-date-range-picker__actions">
          <div className="rls-date-range-picker__actions--cancel">
            <RlsButton type="ghost" onClick={onCancel}>
              {reactI18n('dateActionCancel')}
            </RlsButton>
          </div>

          <div className="rls-date-range-picker__actions--ok">
            <RlsButton type="raised" onClick={onSelect}>
              {reactI18n('dateActionSelect')}
            </RlsButton>
          </div>
        </div>
      </div>
    </div>
  );
}
