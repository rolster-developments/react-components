import { PickerListenerEvent } from '@rolster/components';
import { DateRange } from '@rolster/dates';
import { ReactControl } from '@rolster/react-forms';
import { useState } from 'react';
import { rangeFormatTemplate, renderClassStatus } from '../../../helpers';
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../../molecules';
import { RlsModal } from '../Modal/Modal';
import { RlsPickerDateRange } from '../PickerDateRange/PickerDateRange';
import './FieldDateRange.css';

interface FieldDateRangeProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, DateRange>
    | ReactControl<HTMLElement, DateRange | undefined>;
  maxDate?: Date;
  minDate?: Date;
  msgErrorDisabled?: boolean;
  onValue?: ((value?: DateRange) => void) | ((value: DateRange) => void);
  placeholder?: string;
  value?: DateRange;
}

interface FormControlDefinedProps extends FieldDateRangeProps {
  formControl: ReactControl<HTMLElement, DateRange>;
  value: DateRange;
  onValue?: (value: DateRange) => void;
}

interface FormControlUndefinedProps extends FieldDateRangeProps {
  formControl: ReactControl<HTMLElement, DateRange | undefined>;
  value: undefined;
  onValue?: (value?: DateRange) => void;
}

interface FormControlVoidProps extends Omit<FieldDateRangeProps, 'value'> {
  formControl: ReactControl<HTMLElement, DateRange | undefined>;
  onValue?: (value?: DateRange) => void;
}

interface FormControlEmptyProps
  extends Omit<FieldDateRangeProps, 'formControl' | 'value'> {
  onValue?: (value?: DateRange) => void;
}

export function RlsFieldDateRange(props: FormControlDefinedProps): JSX.Element;
export function RlsFieldDateRange(
  props: FormControlUndefinedProps
): JSX.Element;
export function RlsFieldDateRange(props: FormControlVoidProps): JSX.Element;
export function RlsFieldDateRange(props: FormControlEmptyProps): JSX.Element;
export function RlsFieldDateRange({
  children,
  date: datePicker,
  disabled,
  formControl,
  identifier,
  maxDate,
  minDate,
  msgErrorDisabled,
  onValue,
  placeholder,
  rlsTheme,
  value: defaultValue
}: FieldDateRangeProps) {
  const currentDate = datePicker || new Date();

  const [value, setValue] = useState(formControl?.value || defaultValue);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  function onClickInput(): void {
    setModalIsVisible(true);
  }

  function onClickAction(): void {
    if (value) {
      formControl?.setValue(defaultValue as DateRange);
      formControl?.touch();
      onChange(defaultValue);
    } else {
      setModalIsVisible(true);
    }
  }

  function onChange(value?: DateRange): void {
    setValue(value);
    onValue && onValue(value as DateRange);
  }

  const _disabled = formControl?.disabled || disabled;

  return (
    <div id={identifier} className="rls-field-date-range" rls-theme={rlsTheme}>
      <div
        className={renderClassStatus('rls-field-box', { disabled: _disabled })}
      >
        {children && <label className="rls-field-box__label">{children}</label>}

        <div className="rls-field-box__component">
          <div className="rls-field-box__body">
            <input
              className="rls-field-date-range__control"
              type="text"
              value={value ? rangeFormatTemplate(value) : ''}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
              disabled={_disabled}
            />

            <button
              className="rls-field-date-range__action"
              onClick={onClickAction}
              disabled={_disabled}
            >
              <RlsIcon value={value ? 'trash-2' : 'calendar'} />
            </button>
          </div>
        </div>

        {!msgErrorDisabled && (
          <RlsMessageFormError
            className="rls-field-box__error"
            formControl={formControl}
          />
        )}
      </div>

      <RlsModal visible={modalIsVisible} rlsTheme={rlsTheme}>
        <RlsPickerDateRange
          formControl={formControl}
          date={currentDate}
          disabled={_disabled}
          maxDate={maxDate}
          minDate={minDate}
          onListener={({ event, value }) => {
            event !== PickerListenerEvent.Cancel && onChange(value);
            formControl?.touch();
            setModalIsVisible(false);
          }}
        />
      </RlsModal>
    </div>
  );
}
