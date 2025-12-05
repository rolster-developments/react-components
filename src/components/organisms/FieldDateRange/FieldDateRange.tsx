import { PickerListener, PickerListenerEvent } from '@rolster/components';
import { DateRange } from '@rolster/dates';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { rangeFormatTemplate } from '../../../helpers/date-range-picker';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../../molecules/MessageFormError/MessageFormError';
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
  readOnly?: boolean;
  value?: DateRange;
}

interface FieldDateRangeDefinedProps extends FieldDateRangeProps {
  formControl: ReactControl<HTMLElement, DateRange>;
  value: DateRange;
  onValue?: (value: DateRange) => void;
}

interface FieldDateRangeUndefinedProps extends FieldDateRangeProps {
  formControl: ReactControl<HTMLElement, DateRange | undefined>;
  value: undefined;
  onValue?: (value?: DateRange) => void;
}

interface FieldDateRangeVoidProps extends Omit<FieldDateRangeProps, 'value'> {
  formControl: ReactControl<HTMLElement, DateRange | undefined>;
  onValue?: (value?: DateRange) => void;
}

interface FieldDateRangeEmptyProps
  extends Omit<FieldDateRangeProps, 'formControl' | 'value'> {
  onValue?: (value?: DateRange) => void;
}

export function RlsFieldDateRange(props: FieldDateRangeDefinedProps): ReactNode;
export function RlsFieldDateRange(
  props: FieldDateRangeUndefinedProps
): ReactNode;
export function RlsFieldDateRange(props: FieldDateRangeVoidProps): ReactNode;
export function RlsFieldDateRange(props: FieldDateRangeEmptyProps): ReactNode;
export function RlsFieldDateRange({
  children,
  date: _date,
  disabled,
  formControl,
  identifier,
  maxDate,
  minDate,
  msgErrorDisabled,
  onValue,
  placeholder,
  readOnly,
  rlsTheme,
  value: _value
}: FieldDateRangeProps) {
  const currentDate = useMemo(() => _date ?? new Date(), [_date]);

  const [value, setValue] = useState(formControl?.value || _value);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const _disabled = useMemo(() => {
    return formControl?.disabled || disabled;
  }, [formControl?.disabled, disabled]);

  const className = useMemo(() => {
    return renderClassStatus('rls-field-box', {
      disabled: _disabled,
      readonly: readOnly
    });
  }, [_disabled, readOnly]);

  const { icon, valueInput } = useMemo(() => {
    return {
      icon: value ? 'trash-2' : 'calendar',
      valueInput: value ? rangeFormatTemplate(value) : ''
    };
  }, [value]);

  const onClickInput = useCallback(() => {
    !readOnly && setModalIsVisible(true);
  }, [readOnly]);

  const onChange = useCallback(
    (value?: DateRange) => {
      setValue(value);
      onValue && onValue(value as DateRange);
    },
    [onValue]
  );

  const onClickAction = useCallback(() => {
    if (value) {
      formControl?.setValue(_value as DateRange);
      formControl?.touch();
      onChange(_value);
    } else {
      setModalIsVisible(true);
    }
  }, [value, formControl, _value, onChange]);

  const onListener = useCallback(
    ({ event, value }: PickerListener<DateRange>) => {
      event !== PickerListenerEvent.Cancel && onChange(value);
      formControl?.touch();
      setModalIsVisible(false);
    },
    [formControl, onChange]
  );

  return (
    <div id={identifier} className="rls-field-date-range" rls-theme={rlsTheme}>
      <div className={className}>
        {children && <span className="rls-field-box__label">{children}</span>}

        <div className="rls-field-box__component">
          <div className="rls-field-box__body">
            <input
              className="rls-field-date-range__control"
              type="text"
              value={valueInput}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
              disabled={_disabled}
            />

            {!readOnly && (
              <button
                className="rls-field-date-range__action"
                onClick={onClickAction}
                disabled={_disabled}
              >
                <RlsIcon value={icon} />
              </button>
            )}
          </div>
        </div>

        {!msgErrorDisabled && (
          <RlsMessageFormError
            className="rls-field-box__error"
            formControl={formControl}
          />
        )}
      </div>

      <RlsModal
        className="rls-field-date-range-modal"
        visible={modalIsVisible}
        rlsTheme={rlsTheme}
      >
        <RlsPickerDateRange
          formControl={formControl}
          date={currentDate}
          disabled={_disabled}
          maxDate={maxDate}
          minDate={minDate}
          onListener={onListener}
        />
      </RlsModal>
    </div>
  );
}
