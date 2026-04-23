import { valueIsDefined } from '@rolster/commons';
import {
  createYearPicker,
  verifyYearPicker,
  YearState
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
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
    year.value && !year.disabled && !disabled && onSelect(year.value);
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

  const [value, setValue] = useState(
    formControl?.value ?? dateYear.getFullYear()
  );

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

  const setYearValue = useCallback(
    (value: number) => {
      formControl ? formControl.setValue(value) : setValue(value);

      setYear(value);
    },
    [formControl]
  );

  const onSelect = useCallback(
    (value: number) => {
      setYearValue(value);
      onValue?.(value);
    },
    [setYearValue, onValue]
  );

  useEffect(() => {
    const options = createPickerOptions(); // YearPickerProps

    const year = verifyYearPicker(options);

    year ? setYearValue(year) : setTemplate(createYearPicker(options));
  }, [dateYear, year, value, minDate, maxDate]);

  useEffect(() => {
    const year = verifyYearPicker(createPickerOptions());

    valueIsDefined(year)
      ? formControl?.setValue(year)
      : setValue(formControl?.value ?? dateYear.getFullYear());
  }, [formControl?.value]);

  const onClickPrev = useCallback(() => {
    setYear((year) => year - 8);
  }, []);

  const onClickNext = useCallback(() => {
    setYear((year) => year + 8);
  }, []);

  return (
    <div className="rls-picker-year" rls-theme={rlsTheme}>
      <div className="rls-picker-year__header">
        <button
          className="rls-picker-year__action rls-picker-year__action--prev"
          onClick={onClickPrev}
          disabled={!template.canPrevious || disabled}
        >
          <RlsIcon value="arrow-ios-left" />
        </button>

        <span>
          {template.minRange} - {template.maxRange}
        </span>

        <button
          className="rls-picker-year__action rls-picker-year__action--next"
          onClick={onClickNext}
          disabled={!template.canNext || disabled}
        >
          <RlsIcon value="arrow-ios-right" />
        </button>
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
