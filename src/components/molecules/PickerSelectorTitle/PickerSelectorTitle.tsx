import { valueIsDefined } from '@rolster/commons';
import { monthLimitTemplate } from '@rolster/components';
import { MONTH_NAMES, Month } from '@rolster/dates';
import { i18nSubscribe } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RlsButtonAction } from '../../atoms/ButtonAction/ButtonAction';
import './PickerSelectorTitle.css';

type PickerSelectorTitleType = 'month' | 'year';

interface PickerSelectorTitleProps {
  monthControl: ReactControl<HTMLElement, number>;
  type: PickerSelectorTitleType;
  yearControl: ReactControl<HTMLElement, number>;
  date?: Date;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  onClick?: () => void;
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
      <RlsButtonAction
        icon="arrow-ios-left"
        onClick={onPrevious}
        disabled={limitPrevious || disabled}
      />

      <span onClick={onClick}>{label}</span>

      <RlsButtonAction
        icon="arrow-ios-right"
        onClick={onNext}
        disabled={limitNext || disabled}
      />
    </div>
  );
}
