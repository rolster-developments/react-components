import { itIsDefined } from '@rolster/commons';
import { PickerListener, PickerListenerEvent } from '@rolster/components';
import {
  DateRange,
  assignMonthInDate,
  assignYearInDate,
  normalizeMinTime
} from '@rolster/dates';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl, useReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  date: _picker,
  disabled,
  formControl,
  maxDate,
  minDate,
  onListener,
  rlsTheme
}: PickerDateRangeProps) {
  const _date = useMemo(
    () => normalizeMinTime(_picker ?? new Date()),
    [_picker]
  );

  const _range = useMemo(
    () => formControl?.value ?? DateRange.now(),
    [formControl?.value]
  );

  const yearControl = useReactControl(_date.getFullYear());
  const monthControl = useReactControl(_date.getMonth());
  const rangeControl = useReactControl(_range);

  const [value, setValue] = useState(_range);
  const [date, setDate] = useState(_date);
  const [visibility, setVisibility] = useState<Visibility>('DAY');
  const [labels, setLabels] = useState({
    dateActionCancel: reactI18n('dateActionCancel'),
    dateActionSelect: reactI18n('dateActionSelect')
  });

  const classNameComponent = useMemo(() => {
    return renderClassStatus('rls-picker-date-range__component', {
      day: visibility === 'DAY',
      month: visibility === 'MONTH',
      year: visibility === 'YEAR'
    });
  }, [visibility]);

  const classNameFooter = useMemo(() => {
    return renderClassStatus('rls-picker-date-range__footer', { automatic });
  }, [automatic]);

  const title = useMemo(() => rangeFormatTemplate(value), [value]);

  useEffect(() => {
    return i18nSubscribe(() => {
      setLabels({
        dateActionCancel: reactI18n('dateActionCancel'),
        dateActionSelect: reactI18n('dateActionSelect')
      });
    });
  }, []);

  useEffect(() => {
    setDate((date) => {
      return itIsDefined(yearControl.value)
        ? assignYearInDate(date, yearControl.value)
        : date;
    });
  }, [yearControl.value]);

  useEffect(() => {
    setDate((date) => {
      return itIsDefined(monthControl.value)
        ? assignMonthInDate(date, monthControl.value)
        : date;
    });
  }, [monthControl.value]);

  useEffect(() => {
    rangeControl.value && setValue(rangeControl.value);
    setVisibility('DAY');
  }, [rangeControl.value]);

  const onVisibilityDay = useCallback(() => {
    setVisibility('DAY');
  }, []);

  const onVisibilityMonth = useCallback(() => {
    setVisibility('MONTH');
  }, []);

  const onVisibilityYear = useCallback(() => {
    setVisibility('YEAR');
  }, []);

  const onCancel = useCallback(() => {
    onListener && onListener({ event: PickerListenerEvent.Cancel });
  }, [onListener]);

  const onSelect = useCallback(() => {
    formControl?.setValue(value);
    onListener && onListener({ event: PickerListenerEvent.Select, value });
  }, [formControl, value, onListener]);

  return (
    <div className="rls-picker-date-range" rls-theme={rlsTheme}>
      <div className="rls-picker-date-range__header">
        <div className="rls-picker-date-range__title rls-picker-date-range__title--description">
          <span onClick={onVisibilityDay}>{title}</span>
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
          formControl={rangeControl}
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
              {labels.dateActionCancel}
            </RlsButton>
          </div>

          <div className="rls-picker-date-range__actions--ok">
            <RlsButton type="raised" onClick={onSelect}>
              {labels.dateActionSelect}
            </RlsButton>
          </div>
        </div>
      </div>
    </div>
  );
}
