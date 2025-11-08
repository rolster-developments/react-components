import { valueIsDefined } from '@rolster/commons';
import { monthLimitTemplate } from '@rolster/components';
import { MONTH_NAMES, Month } from '@rolster/dates';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RlsIcon } from '../../atoms/Icon/Icon';
import './PickerSelectorTitle.css';

export type PickerSelectorTitleType = 'month' | 'year';

interface PickerSelectorTitleProps {
  monthControl: ReactControl<HTMLElement, number>;
  type: PickerSelectorTitleType;
  yearControl: ReactControl<HTMLElement, number>;
  date?: Date;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  onClick?: (type: PickerSelectorTitleType) => void;
}

export function RlsPickerSelectorTitle({
  monthControl,
  type,
  yearControl,
  date,
  disabled,
  maxDate,
  minDate,
  onClick
}: PickerSelectorTitleProps) {
  const { limitNext, limitPrevious } = useMemo(() => {
    return monthLimitTemplate({
      date,
      maxDate,
      minDate,
      month: monthControl.value
    });
  }, [date, maxDate, minDate, monthControl.value]);

  const [label, setLabel] = useState(
    MONTH_NAMES(monthControl.value ?? Month.January)
  );

  useEffect(() => {
    return i18nSubscribe(() => {
      setLabel(MONTH_NAMES(monthControl.value ?? Month.January));
    });
  }, []);

  useEffect(() => {
    setLabel(MONTH_NAMES(monthControl.value ?? Month.January));
  }, [monthControl.value]);

  const onPreviousMonth = useCallback(() => {
    if (
      valueIsDefined(monthControl.value) &&
      valueIsDefined(yearControl.value)
    ) {
      if (monthControl.value > Month.January) {
        monthControl.setValue(monthControl.value - 1);
      } else {
        monthControl.setValue(Month.December);
        yearControl.setValue(yearControl.value - 1);
      }
    }
  }, [monthControl.value, yearControl.value]);

  const onMonth = useCallback(() => {
    onClick && onClick('month');
  }, [onClick]);

  const onYear = useCallback(() => {
    onClick && onClick('year');
  }, [onClick]);

  const onPreviousYear = useCallback(() => {
    valueIsDefined(yearControl.value) &&
      yearControl.setValue(yearControl.value - 1);
  }, [yearControl.value]);

  const onPrevious = useCallback(() => {
    type === 'month' ? onPreviousMonth() : onPreviousYear();
  }, [type, onPreviousMonth, onPreviousYear]);

  const onNextMonth = useCallback(() => {
    if (
      valueIsDefined(monthControl.value) &&
      valueIsDefined(yearControl.value)
    ) {
      if (monthControl.value < Month.December) {
        monthControl.setValue(monthControl.value + 1);
      } else {
        monthControl.setValue(Month.January);
        yearControl.setValue(yearControl.value + 1);
      }
    }
  }, [monthControl.value, yearControl.value]);

  const onNextYear = useCallback(() => {
    valueIsDefined(yearControl.value) &&
      yearControl.setValue(yearControl.value + 1);
  }, [yearControl.value]);

  const onNext = useCallback(() => {
    type === 'month' ? onNextMonth() : onNextYear();
  }, [type, onNextMonth, onNextYear]);

  return (
    <div className="rls-picker-selector-title">
      <button onClick={onPrevious} disabled={limitPrevious || disabled}>
        <RlsIcon value="arrow-ios-left" />
      </button>

      <div className="rls-picker-selector-title__label">
        <span onClick={onMonth}>{label},</span>
        <span onClick={onYear}>{yearControl.value}</span>
      </div>

      <button onClick={onNext} disabled={limitNext || disabled}>
        <RlsIcon value="arrow-ios-right" />
      </button>
    </div>
  );
}
