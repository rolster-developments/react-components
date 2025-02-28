import { itIsDefined } from '@rolster/commons';
import { createYearPicker, verifyYearPicker } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsButtonAction } from '../../atoms';
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

export function RlsPickerYear({
  date,
  disabled: disabledPicker,
  formControl,
  maxDate,
  minDate,
  onValue,
  rlsTheme
}: PickerYearProps) {
  const currentDate = date || new Date();

  const [value, setValue] = useState(
    formControl?.value || currentDate.getFullYear()
  );
  const [year, setYear] = useState(
    formControl?.value || currentDate.getFullYear()
  );
  const [template, setTemplate] = useState(
    createYearPicker(createPickerOptions())
  );

  useEffect(() => {
    const options = createPickerOptions(); // YearPickerProps

    const year = verifyYearPicker(options);

    year
      ? setYearValue(year)
      : setTemplate(createYearPicker(createPickerOptions()));
  }, [date, year, value, minDate, maxDate]);

  useEffect(() => {
    const year = verifyYearPicker(createPickerOptions());

    itIsDefined(year)
      ? formControl?.setValue(year)
      : setValue(formControl?.value || currentDate.getFullYear());
  }, [formControl?.value]);

  function createPickerOptions() {
    return {
      date: currentDate,
      year,
      minDate,
      maxDate
    };
  }

  function setYearValue(value: number): void {
    formControl ? formControl.setValue(value) : setValue(value);

    setYear(value);
  }

  function onClickPrev(): void {
    setYear(year - 8);
  }

  function onClickNext(): void {
    setYear(year + 8);
  }

  function onChange(value: number): void {
    setYearValue(value);
    onValue && onValue(value);
  }

  return (
    <div className="rls-picker-year" rls-theme={rlsTheme}>
      <div className="rls-picker-year__header">
        <div className="rls-picker-year__action rls-picker-year__action--prev">
          <RlsButtonAction
            icon="arrow-ios-left"
            onClick={onClickPrev}
            disabled={!template.canPrevious || disabledPicker}
          />
        </div>

        <label className="rls-title-bold">
          {template.minRange} - {template.maxRange}
        </label>

        <div className="rls-picker-year__action rls-picker-year__action--next">
          <RlsButtonAction
            icon="arrow-ios-right"
            onClick={onClickNext}
            disabled={!template.canNext || disabledPicker}
          />
        </div>
      </div>

      <div className="rls-picker-year__component">
        {template.years.map(({ value, disabled, focused, selected }, index) => (
          <div
            key={index}
            className={renderClassStatus('rls-picker-year__year', {
              disabled: disabled || disabledPicker,
              focused,
              selected
            })}
            onClick={
              value && !disabledPicker
                ? () => {
                    onChange(value);
                  }
                : undefined
            }
          >
            <span className="rls-picker-year__year__span rls-body1-medium">
              {value || '????'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
