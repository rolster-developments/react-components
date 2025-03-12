import { itIsDefined } from '@rolster/commons';
import {
  MonthState,
  createMonthPicker,
  verifyMonthPicker
} from '@rolster/components';
import { MONTH_NAMES } from '@rolster/dates';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './PickerMonth.css';

interface PickerMonthProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  minDate?: Date;
  onValue?: (value: number) => void;
  year?: Nulleable<number>;
}

interface PickerMonthItemProps {
  month: MonthState;
  onSelect: (value: number) => void;
  disabled?: boolean;
}

function RlsPickerMonthItem({
  month,
  onSelect,
  disabled
}: PickerMonthItemProps) {
  const [label, setLabel] = useState(MONTH_NAMES(month.value));

  useEffect(() => {
    return i18nSubscribe(() => {
      setLabel(MONTH_NAMES(month.value));
    });
  }, []);

  const className = useMemo(() => {
    return renderClassStatus('rls-picker-month__component', {
      disabled: month.disabled || disabled,
      focused: month.focused,
      selected: month.selected
    });
  }, [month.disabled, month.focused, month.selected, disabled]);

  const onClick = useCallback(() => {
    month.value && !month.disabled && !disabled && onSelect(month.value);
  }, [month.value, month.disabled, disabled, onSelect]);

  return (
    <div className={className} onClick={onClick}>
      <span className="rls-picker-month__span">{label}</span>
    </div>
  );
}

export function RlsPickerMonth({
  date: _date,
  disabled,
  formControl,
  maxDate,
  minDate,
  onValue,
  rlsTheme,
  year
}: PickerMonthProps) {
  const date = useMemo(() => _date || new Date(), [_date]);

  const [months, setMonths] = useState<MonthState[]>([]);
  const [value, setValue] = useState(formControl?.value ?? date.getMonth());

  const [component, setComponent] = useState(<></>);

  useEffect(() => {
    setComponent(
      <>
        {months.map((month, index) => (
          <RlsPickerMonthItem
            key={index}
            month={month}
            onSelect={onSelect}
            disabled={disabled}
          />
        ))}
      </>
    );
  }, [months]);

  useEffect(() => {
    const options = createPickerOptions(); // MonthPickerProps

    const month = verifyMonthPicker(options);

    itIsDefined(month)
      ? setMonthValue(month)
      : setMonths(createMonthPicker(options));
  }, [date, year, value, minDate, maxDate]);

  useEffect(() => {
    const month = verifyMonthPicker(createPickerOptions());

    itIsDefined(month)
      ? formControl?.setValue(month)
      : setValue(formControl?.value ?? date.getMonth());
  }, [formControl?.value]);

  const createPickerOptions = useCallback(() => {
    return {
      date,
      month: formControl?.value ?? value,
      year: year ?? date.getFullYear(),
      minDate,
      maxDate
    };
  }, [date, formControl, year, minDate, maxDate]);

  const setMonthValue = useCallback(
    (value: number) => {
      formControl ? formControl.setValue(value) : setValue(value);
    },
    [formControl]
  );

  const onSelect = useCallback(
    (value: number) => {
      setMonthValue(value);
      onValue && onValue(value);
    },
    [setMonthValue, onValue]
  );

  return (
    <div className="rls-picker-month" rls-theme={rlsTheme}>
      {component}
    </div>
  );
}
