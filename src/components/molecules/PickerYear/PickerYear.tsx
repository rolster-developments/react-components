import { itIsDefined } from '@rolster/commons';
import {
  createYearPicker,
  verifyYearPicker,
  YearState
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonAction } from '../../atoms/ButtonAction/ButtonAction';
import { RlsComponent } from '../../definitions';
import './PickerYear.css';

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
      <span className="rls-picker-year__span rls-body1-medium">
        {year.value || '????'}
      </span>
    </div>
  );
}

export function RlsPickerYear({
  date: _date,
  disabled,
  formControl,
  maxDate,
  minDate,
  onValue,
  rlsTheme
}: PickerYearProps) {
  const date = useMemo(() => _date || new Date(), [_date]);

  const [value, setValue] = useState(formControl?.value ?? date.getFullYear());
  const [year, setYear] = useState(formControl?.value ?? date.getFullYear());

  const [component, setComponent] = useState(<></>);

  const createPickerOptions = useCallback(() => {
    return {
      date,
      year,
      minDate,
      maxDate
    };
  }, [date, year, minDate, maxDate]);

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
      onValue && onValue(value);
    },
    [setYearValue, onValue]
  );

  useEffect(() => {
    const options = createPickerOptions(); // YearPickerProps

    const year = verifyYearPicker(options);

    year ? setYearValue(year) : setTemplate(createYearPicker(options));
  }, [date, year, value, minDate, maxDate]);

  useEffect(() => {
    setComponent(
      <>
        {template.years.map((year, index) => (
          <RlsPickerYearElement
            key={index}
            year={year}
            onSelect={onSelect}
            disabled={disabled}
          />
        ))}
      </>
    );
  }, [template.years, onSelect, disabled]);

  useEffect(() => {
    const year = verifyYearPicker(createPickerOptions());

    itIsDefined(year)
      ? formControl?.setValue(year)
      : setValue(formControl?.value ?? date.getFullYear());
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
        <div className="rls-picker-year__action rls-picker-year__action--prev">
          <RlsButtonAction
            icon="arrow-ios-left"
            onClick={onClickPrev}
            disabled={!template.canPrevious || disabled}
          />
        </div>

        <label className="rls-title-bold">
          {template.minRange} - {template.maxRange}
        </label>

        <div className="rls-picker-year__action rls-picker-year__action--next">
          <RlsButtonAction
            icon="arrow-ios-right"
            onClick={onClickNext}
            disabled={!template.canNext || disabled}
          />
        </div>
      </div>

      <div className="rls-picker-year__component">{component}</div>
    </div>
  );
}
