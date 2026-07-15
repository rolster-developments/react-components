import { valueIsDefined } from '@rolster/commons';
import {
  createYearPicker,
  verifyYearPicker,
  YearState
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { RlsComponent } from '../../definitions';

interface PickerYearProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  minDate?: Date;
  onValue?: (value: number) => void;
}

interface PickerYearElementProps {
  onSelect: (value: number) => void;
  year: YearState;
  disabled?: boolean;
}

function RlsPickerYearElement({
  onSelect,
  year,
  disabled
}: PickerYearElementProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-picker-year__element', {
      disabled: year.disabled || disabled,
      focused: year.focused,
      selected: year.selected
    });
  }, [year.disabled, year.focused, year.selected, disabled]);

  const onClick = useCallback(() => {
    if (year.value && !year.disabled && !disabled) {
      onSelect(year.value);
    }
  }, [year.value, year.disabled, disabled, onSelect]);

  return (
    <div className={className} onClick={onClick}>
      <span className="rls-picker-year__span">{year.value || '????'}</span>
    </div>
  );
}

export function RlsPickerYear({
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  onValue,
  rlsTheme
}: PickerYearProps) {
  const dateYear = useMemo(() => date ?? new Date(), [date]);

  const [year, setYear] = useState(
    formControl?.value ?? dateYear.getFullYear()
  );

  const createPickerOptions = useCallback(() => {
    return {
      date: dateYear,
      year,
      minDate,
      maxDate
    };
  }, [dateYear, year, minDate, maxDate]);

  const [template, setTemplate] = useState(
    createYearPicker(createPickerOptions())
  );

  useEffect(() => {
    const options = createPickerOptions();
    const validYear = verifyYearPicker(options);

    if (validYear) {
      setYear(validYear);
    } else {
      setTemplate(createYearPicker(options));
    }
  }, [dateYear, year, minDate, maxDate]);

  useEffect(() => {
    const yearValue = formControl?.value;

    if (valueIsDefined(yearValue) && yearValue !== year) {
      setYear(yearValue);
    }
  }, [formControl?.value]);

  const onSelect = useCallback(
    (value: number) => {
      if (formControl) {
        formControl.setValue(value);
      } else {
        setYear(value);
      }
      onValue?.(value);
    },
    [formControl, onValue]
  );

  const onClickPrev = useCallback(() => {
    setYear((year) => year - 8);
  }, []);

  const onClickNext = useCallback(() => {
    setYear((year) => year + 8);
  }, []);

  return (
    <div className="rls-picker-year" rls-theme={rlsTheme}>
      <div className="rls-picker-year__header">
        <RlsButtonIcon
          icon="arrow-ios-left"
          onClick={onClickPrev}
          disabled={!template.canPrevious || disabled}
        />

        <span>
          {template.minRange} - {template.maxRange}
        </span>

        <RlsButtonIcon
          icon="arrow-ios-right"
          onClick={onClickNext}
          disabled={!template.canNext || disabled}
        />
      </div>

      <div className="rls-picker-year__component">
        {template.years.map((year, index) => (
          <RlsPickerYearElement
            key={index}
            year={year}
            onSelect={onSelect}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
