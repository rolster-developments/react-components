import { PickerListener, PickerListenerEvent } from '@rolster/components';
import {
  DateRange,
  assignMonthInDate,
  assignYearInDate,
  normalizeMinTime
} from '@rolster/dates';
import { ReactControl, useReactControl } from '@rolster/react-forms';
import { useEffect, useMemo, useState } from 'react';
import { rangeFormatTemplate, renderClassStatus } from '../../../helpers';
import { reactI18n } from '../../../i18n';
import { RlsButton } from '../../atoms/Button/Button';
import { RlsComponent } from '../../definitions';
import { RlsPickerDayRange } from '../../molecules/PickerDayRange/PickerDayRange';
import { RlsPickerMonth } from '../../molecules/PickerMonth/PickerMonth';
import { RlsPickerSelectorTitle } from '../../molecules/PickerSelectorTitle/PickerSelectorTitle';
import { RlsPickerYear } from '../../molecules/PickerYear/PickerYear';
import './PickerDateRange.css';

interface PickerDateRangeProps extends RlsComponent {
  automatic?: boolean;
  date?: Date;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, DateRange>
    | ReactControl<HTMLElement, DateRange | undefined>;
  maxDate?: Date;
  minDate?: Date;
  onListener?: (listener: PickerListener<DateRange>) => void;
}

type Visibility = 'DAY' | 'MONTH' | 'YEAR';

export function RlsPickerDateRange({
  automatic,
  date: datePicker,
  disabled,
  formControl,
  maxDate,
  minDate,
  onListener,
  rlsTheme
}: PickerDateRangeProps) {
  const dateInitial = normalizeMinTime(datePicker || new Date());
  const rangeInitial = formControl?.value || DateRange.now();

  const yearControl = useReactControl(dateInitial.getFullYear());
  const monthControl = useReactControl(dateInitial.getMonth());
  const dayControl = useReactControl(rangeInitial);

  const [value, setValue] = useState(rangeInitial);
  const [date, setDate] = useState(dateInitial);
  const [visibility, setVisibility] = useState<Visibility>('DAY');

  useEffect(() => {
    setDate((prevValue) => {
      return typeof yearControl.value === 'number'
        ? assignYearInDate(prevValue, yearControl.value)
        : prevValue;
    });
  }, [yearControl.value]);

  useEffect(() => {
    setDate((prevValue) => {
      return typeof monthControl.value === 'number'
        ? assignMonthInDate(prevValue, monthControl.value)
        : prevValue;
    });
  }, [monthControl.value]);

  useEffect(() => {
    dayControl.value && setValue(dayControl.value);
    setVisibility('DAY');
  }, [dayControl.value]);

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
    onListener && onListener({ event: PickerListenerEvent.Cancel });
  }

  function onSelect(): void {
    formControl?.setValue(value);
    onListener && onListener({ event: PickerListenerEvent.Select, value });
  }

  const classNameComponent = useMemo(() => {
    return renderClassStatus('rls-picker-date-range__component', {
      day: visibility === 'DAY',
      month: visibility === 'MONTH',
      year: visibility === 'YEAR'
    });
  }, [visibility]);

  const classNameFooter = useMemo(() => {
    return renderClassStatus('rls-picker-date-range__footer', {
      automatic
    });
  }, [automatic]);

  return (
    <div className="rls-picker-date-range" rls-theme={rlsTheme}>
      <div className="rls-picker-date-range__header">
        <div className="rls-picker-date-range__title rls-picker-date-range__title--description">
          <span onClick={onVisibilityDay}>{rangeFormatTemplate(value)}</span>
        </div>

        <div className="rls-picker-date-range__title rls-picker-date-range__title--year">
          <span onClick={onVisibilityYear}>{yearControl.value}</span>
        </div>

        <RlsPickerSelectorTitle
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

      <div className={classNameComponent}>
        <RlsPickerDayRange
          formControl={dayControl}
          date={date}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
        />

        <RlsPickerMonth
          formControl={monthControl}
          year={yearControl.value}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />

        <RlsPickerYear
          formControl={yearControl}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />
      </div>

      <div className={classNameFooter}>
        <div className="rls-picker-date-range__actions">
          <div className="rls-picker-date-range__actions--cancel">
            <RlsButton type="ghost" onClick={onCancel}>
              {reactI18n('dateActionCancel')}
            </RlsButton>
          </div>

          <div className="rls-picker-date-range__actions--ok">
            <RlsButton type="raised" onClick={onSelect}>
              {reactI18n('dateActionSelect')}
            </RlsButton>
          </div>
        </div>
      </div>
    </div>
  );
}
