import { valueIsDefined } from '@rolster/commons';
import {
  MonthState,
  createMonthPicker,
  verifyMonthPicker
} from '@rolster/components';
import { MONTH_NAMES } from '@rolster/dates';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface PickerMonthProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  minDate?: Date;
  onValue?: (value: number) => void;
  year?: Nulleable<number>;
}

interface PickerMonthElementProps {
  month: MonthState;
  onSelect: (value: number) => void;
  disabled?: boolean;
}

function RlsPickerMonthElement({
  month,
  onSelect,
  disabled
}: PickerMonthElementProps) {
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
    valueIsDefined(month.value) &&
      !month.disabled &&
      !disabled &&
      onSelect(month.value);
  }, [month.value, month.disabled, disabled, onSelect]);

  return (
    <div className={className} onClick={onClick}>
      <span className="rls-picker-month__span">{label}</span>
    </div>
  );
}

export function RlsPickerMonth({
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  onValue,
  rlsTheme,
  year
}: PickerMonthProps) {
  const dateMonth = useMemo(() => date ?? new Date(), [date]);

  const [months, setMonths] = useState<MonthState[]>([]);

  const [value, setValue] = useState(
    formControl?.value ?? dateMonth.getMonth()
  );

  const setMonthValue = useCallback(
    (value: number) => {
      formControl ? formControl.setValue(value) : setValue(value);
    },
    [formControl]
  );

  const onSelect = useCallback(
    (value: number) => {
      setMonthValue(value);
      onValue?.(value);
    },
    [setMonthValue, onValue]
  );

  useEffect(() => {
    const options = {
      date: dateMonth,
      month: formControl?.value ?? value,
      year: year ?? dateMonth.getFullYear(),
      minDate,
      maxDate
    };

    const month = verifyMonthPicker(options);

    valueIsDefined(month)
      ? setMonthValue(month)
      : setMonths(createMonthPicker(options));
  }, [dateMonth, year, value, minDate, maxDate]);

  useEffect(() => {
    const month = verifyMonthPicker({
      date: dateMonth,
      month: formControl?.value ?? value,
      year: year ?? dateMonth.getFullYear(),
      minDate,
      maxDate
    });

    valueIsDefined(month)
      ? formControl?.setValue(month)
      : setValue(formControl?.value ?? dateMonth.getMonth());
  }, [formControl?.value]);

  return (
    <div className="rls-picker-month" rls-theme={rlsTheme}>
      {months.map((month, index) => (
        <RlsPickerMonthElement
          key={index}
          month={month}
          onSelect={onSelect}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
