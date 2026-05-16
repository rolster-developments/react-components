import { PickerListener, PickerListenerEvent } from '@rolster/components';
import { DateRange } from '@rolster/dates';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { rangeFormatTemplate } from '../../../helpers/date-range-picker';
import { RlsButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../../molecules/MessageFormError/MessageFormError';
import { RlsModal } from '../Modal/Modal';
import { RlsPickerDateRange } from '../PickerDateRange/PickerDateRange';

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
  date,
  disabled: disabledProps,
  formControl,
  identifier,
  maxDate,
  minDate,
  msgErrorDisabled,
  onValue,
  placeholder,
  readOnly,
  rlsTheme,
  value: valueInitial
}: FieldDateRangeProps) {
  const currentDate = useMemo(() => date ?? new Date(), [date]);

  const [value, setValue] = useState(formControl?.value || valueInitial);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const disabled = useMemo(() => {
    return formControl?.disabled || disabledProps;
  }, [formControl?.disabled, disabledProps]);

  const className = useMemo(() => {
    return renderClassStatus('rls-field-box', {
      disabled,
      readonly: readOnly
    });
  }, [disabled, readOnly]);

  const dateRangeValue = useMemo(() => {
    return formControl ? formControl.value : value;
  }, [formControl?.value, value]);

  const status = useMemo(() => {
    return {
      icon: dateRangeValue ? 'trash-2' : 'calendar',
      valueInput: dateRangeValue ? rangeFormatTemplate(dateRangeValue) : ''
    };
  }, [dateRangeValue]);

  const onClickInput = useCallback(() => {
    !readOnly && setModalIsVisible(true);
  }, [readOnly]);

  const onChange = useCallback(
    (value?: DateRange) => {
      setValue(value);
      onValue?.(value as DateRange);
    },
    [onValue]
  );

  const onClickAction = useCallback(() => {
    if (dateRangeValue) {
      formControl?.setValue(valueInitial as DateRange);
      formControl?.touch();
      onChange(valueInitial);
    } else {
      setModalIsVisible(true);
    }
  }, [dateRangeValue, formControl, valueInitial, onChange]);

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
              value={status.valueInput}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
              disabled={disabled}
            />

            {!readOnly && (
              <RlsButtonIcon
                icon={status.icon}
                onClick={onClickAction}
                disabled={disabled}
              />
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
          disabled={disabled}
          maxDate={maxDate}
          minDate={minDate}
          onListener={onListener}
        />
      </RlsModal>
    </div>
  );
}
