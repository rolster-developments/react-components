import {
  PickerListener,
  PickerListenerEvent,
  dateOutRange,
  verifyDateRange
} from '@rolster/components';
import { dateFormatTemplate } from '@rolster/dates';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl, useReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DATE_FORMAT_TITLE } from '../../../constants/picker.constant';
import { renderClassStatus } from '../../../helpers/css';
import { reactI18n } from '../../../i18n';
import { RlsButton } from '../../atoms/Button/Button';
import { RlsButtonAction } from '../../atoms/ButtonAction/ButtonAction';
import { RlsComponent } from '../../definitions';
import { RlsPickerDay } from '../../molecules/PickerDay/PickerDay';
import { RlsPickerMonth } from '../../molecules/PickerMonth/PickerMonth';
import {
  PickerSelectorTitleType,
  RlsPickerSelectorTitle
} from '../../molecules/PickerSelectorTitle/PickerSelectorTitle';
import { RlsPickerYear } from '../../molecules/PickerYear/PickerYear';

interface PickerDateProps extends RlsComponent {
  automatic?: boolean;
  date?: Date;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, Date>
    | ReactControl<HTMLElement, Date | undefined>;
  maxDate?: Date;
  minDate?: Date;
  onListener?: (listener: PickerListener<Date>) => void;
}

type Visibility = 'DAY' | 'MONTH' | 'YEAR';

export function RlsPickerDate({
  automatic,
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  onListener,
  rlsTheme
}: PickerDateProps) {
  const today = useRef(new Date()); // Initial current date in component

  const _date = useMemo(() => {
    return formControl?.value ?? date ?? today.current;
  }, [formControl?.value, date]);

  const yearControl = useReactControl(_date.getFullYear());
  const dayControl = useReactControl(_date.getDate());
  const monthControl = useReactControl(_date.getMonth());

  const [visibility, setVisibility] = useState<Visibility>('DAY');
  const [labels, setLabels] = useState({
    dateActionCancel: reactI18n('dateActionCancel'),
    dateActionSelect: reactI18n('dateActionSelect'),
    dateActionToday: reactI18n('dateActionToday')
  });

  const value = useMemo(() => {
    return new Date(yearControl.value, monthControl.value, dayControl.value);
  }, [yearControl.value, monthControl.value, dayControl.value]);

  const classNameComponent = useMemo(() => {
    return renderClassStatus('rls-picker-date__component', {
      day: visibility === 'DAY',
      month: visibility === 'MONTH',
      year: visibility === 'YEAR'
    });
  }, [visibility]);

  const title = useMemo(() => {
    return dateFormatTemplate(value, DATE_FORMAT_TITLE);
  }, [value]);

  const itIsDisabledToday = useMemo(
    () =>
      dateOutRange({
        date: today.current,
        maxDate,
        minDate
      }),
    [maxDate, minDate]
  );

  useEffect(() => {
    const date = verifyDateRange({ date: _date, minDate, maxDate });

    yearControl.setValue(date.getFullYear());
    monthControl.setValue(date.getMonth());
    dayControl.setValue(date.getDate());
    formControl?.setValue(date);

    return i18nSubscribe(() => {
      setLabels({
        dateActionCancel: reactI18n('dateActionCancel'),
        dateActionSelect: reactI18n('dateActionSelect'),
        dateActionToday: reactI18n('dateActionToday')
      });
    });
  }, []);

  const onVisibilityDay = useCallback(() => {
    setVisibility('DAY');
  }, []);

  const onVisibilityTitle = useCallback((type: PickerSelectorTitleType) => {
    type === 'month' ? setVisibility('MONTH') : setVisibility('YEAR');
  }, []);

  const onCancel = useCallback(() => {
    onListener?.({ event: PickerListenerEvent.Cancel });
  }, [onListener]);

  const onToday = useCallback(() => {
    yearControl.setValue(today.current.getFullYear());
    dayControl.setValue(today.current.getDate());
    monthControl.setValue(today.current.getMonth());
    formControl?.setValue(today.current);

    onListener?.({
      event: PickerListenerEvent.Now,
      value: today.current
    });
  }, [formControl, onListener]);

  const onSelect = useCallback(() => {
    formControl?.setValue(value);

    onListener?.({
      event: PickerListenerEvent.Select,
      value: value
    });
  }, [formControl, value, onListener]);

  return (
    <div className="rls-picker-date" rls-theme={rlsTheme}>
      <div className="rls-picker-date__header">
        <RlsPickerSelectorTitle
          monthControl={monthControl}
          yearControl={yearControl}
          date={value}
          maxDate={maxDate}
          minDate={minDate}
          disabled={visibility === 'YEAR'}
          type={'month'}
          onClick={onVisibilityTitle}
        />

        <div className="rls-picker-date__title">
          <span onClick={onVisibilityDay}>{title}</span>
        </div>
      </div>

      <div className={classNameComponent}>
        <RlsPickerDay
          formControl={dayControl}
          date={value}
          month={monthControl.value}
          year={yearControl.value}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
        />

        <RlsPickerMonth
          formControl={monthControl}
          date={value}
          year={yearControl.value}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />

        <RlsPickerYear
          formControl={yearControl}
          date={value}
          maxDate={maxDate}
          minDate={minDate}
          disabled={disabled}
          onValue={onVisibilityDay}
        />
      </div>

      {!automatic && (
        <div className="rls-picker-date__footer">
          <div className="rls-picker-date__actions">
            <div className="rls-picker-date__actions--cancel">
              <RlsButton type="flat" onClick={onCancel}>
                {labels.dateActionCancel}
              </RlsButton>
            </div>

            <div className="rls-picker-date__actions--today">
              <RlsButtonAction
                icon="calendar"
                onClick={onToday}
                disabled={itIsDisabledToday}
              />
            </div>

            <div className="rls-picker-date__actions--ok">
              <RlsButton type="gradient" onClick={onSelect}>
                {labels.dateActionSelect}
              </RlsButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
