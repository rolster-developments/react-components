import { valueIsDefined } from '@rolster/commons';
import { PickerListener, PickerListenerEvent } from '@rolster/components';
import {
  assignMonthInDate,
  assignYearInDate,
  DateRange,
  normalizeMinTime
} from '@rolster/dates';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl, useReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { rangeFormatTemplate } from '../../../helpers/date-range-picker';
import { reactI18n } from '../../../i18n';
import { RlsButton } from '../../atoms/Button/Button';
import { RlsComponent } from '../../definitions';
import { RlsPickerDayRange } from '../../molecules/PickerDayRange/PickerDayRange';
import { RlsPickerMonth } from '../../molecules/PickerMonth/PickerMonth';
import {
  PickerSelectorTitleType,
  RlsPickerSelectorTitle
} from '../../molecules/PickerSelectorTitle/PickerSelectorTitle';
import { RlsPickerYear } from '../../molecules/PickerYear/PickerYear';

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
  const _date = useMemo(
    () => normalizeMinTime(datePicker ?? new Date()),
    [datePicker]
  );

  const _range = useMemo(
    () => formControl?.value ?? DateRange.now(),
    [formControl?.value]
  );

  const yearControl = useReactControl(_date.getFullYear());
  const monthControl = useReactControl(_date.getMonth());
  const rangeControl = useReactControl(_range);

  const [visibility, setVisibility] = useState<Visibility>('DAY');
  const [labels, setLabels] = useState({
    dateActionCancel: reactI18n('dateActionCancel'),
    dateActionSelect: reactI18n('dateActionSelect')
  });

  const value = useMemo(() => {
    return rangeControl.value ?? _range;
  }, [rangeControl.value, _range]);

  const date = useMemo(() => {
    let value = _date;

    if (valueIsDefined(yearControl.value)) {
      value = assignYearInDate(value, yearControl.value);
    }

    if (valueIsDefined(monthControl.value)) {
      value = assignMonthInDate(value, monthControl.value);
    }

    return value;
  }, [_date, yearControl.value, monthControl.value]);

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
    setVisibility('DAY');
  }, [rangeControl.value]);

  const onVisibilityDay = useCallback(() => {
    setVisibility('DAY');
  }, []);

  const onVisibilityTitle = useCallback((type: PickerSelectorTitleType) => {
    if (type === 'month') {
      setVisibility('MONTH');
    } else {
      setVisibility('YEAR');
    }
  }, []);

  const onCancel = useCallback(() => {
    onListener?.({ event: PickerListenerEvent.Cancel });
  }, [onListener]);

  const onSelect = useCallback(() => {
    formControl?.setValue(value);
    onListener?.({ event: PickerListenerEvent.Select, value });
  }, [formControl, value, onListener]);

  return (
    <div className="rls-picker-date-range" rls-theme={rlsTheme}>
      <div className="rls-picker-date-range__header">
        <RlsPickerSelectorTitle
          monthControl={monthControl}
          yearControl={yearControl}
          date={date}
          maxDate={maxDate}
          minDate={minDate}
          disabled={visibility === 'YEAR'}
          type={visibility === 'MONTH' ? 'year' : 'month'}
          onClick={onVisibilityTitle}
        />

        <div className="rls-picker-date-range__title">
          <span onClick={onVisibilityDay}>{title}</span>
        </div>
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
            <RlsButton type="flat" onClick={onCancel}>
              {labels.dateActionCancel}
            </RlsButton>
          </div>

          <div className="rls-picker-date-range__actions--ok">
            <RlsButton type="gradient" onClick={onSelect}>
              {labels.dateActionSelect}
            </RlsButton>
          </div>
        </div>
      </div>
    </div>
  );
}
