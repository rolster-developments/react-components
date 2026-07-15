import {
  PickerListener,
  PickerListenerEvent,
  verifyDateRange
} from '@rolster/components';
import { dateFormatTemplate } from '@rolster/dates';
import { ReactControl } from '@rolster/react-forms';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { DATE_FORMAT } from '../../../constants/picker.constant';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../../molecules/MessageFormError/MessageFormError';
import { RolsterReactHtmlControl } from '../../types';
import { RlsModal } from '../Modal/Modal';
import { RlsPickerDate } from '../PickerDate/PickerDate';

interface FieldDateProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  format?: string;
  formControl?: RolsterReactHtmlControl<Date>;
  maxDate?: Date;
  minDate?: Date;
  msgErrorDisabled?: boolean;
  onValue?: ((value?: Date) => void) | ((value: Date) => void);
  placeholder?: string;
  readOnly?: boolean;
  value?: Date;
}

interface FieldDateDefinedProps extends FieldDateProps {
  formControl: ReactControl<HTMLElement, Date>;
  value: Date;
  onValue?: (value: Date) => void;
}

interface FieldDateUndefinedProps extends FieldDateProps {
  formControl: ReactControl<HTMLElement, Date | undefined>;
  value: undefined;
  onValue?: (value?: Date) => void;
}

interface FieldDateVoidProps extends Omit<FieldDateProps, 'value'> {
  formControl: ReactControl<HTMLElement, Date | undefined>;
  onValue?: (value?: Date) => void;
}

interface FieldDateEmptyProps extends Omit<
  FieldDateProps,
  'formControl' | 'value'
> {
  onValue?: (value?: Date) => void;
}

export function RlsFieldDate(props: FieldDateDefinedProps): ReactNode;
export function RlsFieldDate(props: FieldDateUndefinedProps): ReactNode;
export function RlsFieldDate(props: FieldDateVoidProps): ReactNode;
export function RlsFieldDate(props: FieldDateEmptyProps): ReactNode;
export function RlsFieldDate({
  children,
  date,
  disabled: disabledProps,
  formControl,
  format,
  identifier,
  maxDate,
  minDate,
  msgErrorDisabled,
  onValue,
  placeholder,
  readOnly,
  rlsTheme,
  value: valueInitial
}: FieldDateProps) {
  const today = useRef(new Date()); // Initial current date in component

  const [value, setValue] = useState(formControl?.value ?? valueInitial);
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

  const dateValue = useMemo(() => {
    return formControl ? formControl.value : value;
  }, [formControl?.value, value]);

  const status = useMemo(() => {
    return {
      icon: dateValue ? 'trash-2' : 'calendar',
      label: dateValue
        ? dateFormatTemplate(dateValue, format ?? DATE_FORMAT)
        : ''
    };
  }, [dateValue, format]);

  useEffect(() => {
    const dateSecure = verifyDateRange({
      date: formControl?.value ?? date ?? today.current,
      minDate,
      maxDate
    });

    setValue(dateSecure);
    formControl?.setValue(dateSecure);
  }, []);

  const onClickInput = useCallback(() => {
    if (!readOnly) {
      setModalIsVisible(true);
    }
  }, [readOnly]);

  const onChange = useCallback(
    (value?: Date) => {
      setValue(value);
      onValue?.(value as Date);
    },
    [onValue]
  );

  const onClickAction = useCallback(() => {
    if (dateValue) {
      formControl?.setValue(valueInitial as Date);
      formControl?.touch();
      onChange(valueInitial);
    } else {
      setModalIsVisible(true);
    }
  }, [dateValue, formControl, valueInitial, onChange]);

  const onListener = useCallback(
    ({ event, value }: PickerListener<Date>) => {
      if (event !== PickerListenerEvent.Cancel) {
        onChange(value);
      }
      formControl?.touch();
      setModalIsVisible(false);
    },
    [formControl, onChange]
  );

  return (
    <div id={identifier} className="rls-field-date" rls-theme={rlsTheme}>
      <div className={className}>
        {children && <span className="rls-field-box__label">{children}</span>}

        <div className="rls-field-box__component">
          <div className="rls-field-box__body">
            <input
              className="rls-field-date__control"
              type="text"
              value={status.label}
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
        className="rls-field-date-modal"
        visible={modalIsVisible}
        rlsTheme={rlsTheme}
      >
        <RlsPickerDate
          formControl={formControl}
          date={date}
          disabled={disabled}
          maxDate={maxDate}
          minDate={minDate}
          onListener={onListener}
        />
      </RlsModal>
    </div>
  );
}
