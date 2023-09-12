import { useEffect, useState } from 'react';
import './YearPicker.css';
import { RlsComponent } from '../../definitions';
import { ReactControl } from '../../../hooks';
import { createYearPicker } from '../../../utils/year-picker';
import { RlsIcon } from '../../atoms';
import { renderClassStatus } from '../../../utils/css';

interface YearPicker extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, number>;
  maxDate?: Date;
  minDate?: Date;
}

export function XftYearPicker({
  formControl,
  date: date,
  disabled: disabledPicker,
  maxDate,
  minDate,
  rlsTheme
}: YearPicker) {
  const initialDate = date || new Date();
  const initialYear = formControl?.value || initialDate.getFullYear();

  const [value, setValue] = useState(initialYear);
  const [year, setYear] = useState(initialYear);
  const [template, setTemplate] = useState(
    createYearPicker({
      value: formControl?.value || value,
      year: initialYear,
      minDate,
      maxDate
    })
  );

  useEffect(() => {
    setTemplate(
      createYearPicker({
        value: formControl?.value || value,
        year,
        minDate,
        maxDate
      })
    );
  }, [value, year, date, minDate, maxDate]);

  function onClickPrev(): void {
    setYear(year - 8);
  }

  function onClickNext(): void {
    setYear(year + 8);
  }

  function onChange(value: number): void {
    formControl?.setState(value);
    setYear(value);
    setValue(value);
  }

  return (
    <div className="rls-year-picker" rls-theme={rlsTheme}>
      <div className="rls-year-picker__header">
        <div className="rls-year-picker__action rls-year-picker__action--prev">
          <button
            disabled={!template.hasPrevious || disabledPicker}
            onClick={onClickPrev}
          >
            <RlsIcon value="arrow-ios-left" />
          </button>
        </div>

        <div className="rls-year-picker__title">
          <label className="title1-bold">
            {template.minRange} - {template.maxRange}
          </label>
        </div>

        <div className="rls-year-picker__action rls-year-picker__action--next">
          <button
            disabled={!template.hasNext || disabledPicker}
            onClick={onClickNext}
          >
            <RlsIcon value="arrow-ios-right" />
          </button>
        </div>
      </div>

      <div className="rls-year-picker__component">
        {template.years.map(({ value, disabled, selected }, index) => (
          <div
            key={index}
            className={renderClassStatus('rls-year-picker__year', {
              disabled: disabled || disabledPicker,
              selected
            })}
            onClick={() => {
              if (value) {
                onChange(value);
              }
            }}
          >
            <span className="rls-year-picker__year__span body1-medium">
              {value || '????'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
