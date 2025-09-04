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
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../../molecules/MessageFormError/MessageFormError';
import { RlsModal } from '../Modal/Modal';
import { RlsPickerDate } from '../PickerDate/PickerDate';
import './FieldDate.css';

const formatDate = '{dd}/{mx}/{aa}';

interface FieldDateProps extends RlsComponent {
  date?: Date;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, Date>
    | ReactControl<HTMLElement, Date | undefined>;
  format?: string;
  maxDate?: Date;
  minDate?: Date;
  msgErrorDisabled?: boolean;
  onValue?: ((value?: Date) => void) | ((value: Date) => void);
  placeholder?: string;
  value?: Date;
}

interface FormControlDefinedProps extends FieldDateProps {
  formControl: ReactControl<HTMLElement, Date>;
  value: Date;
  onValue?: (value: Date) => void;
}

interface FormControlUndefinedProps extends FieldDateProps {
  formControl: ReactControl<HTMLElement, Date | undefined>;
  value: undefined;
  onValue?: (value?: Date) => void;
}

interface FormControlVoidProps extends Omit<FieldDateProps, 'value'> {
  formControl: ReactControl<HTMLElement, Date | undefined>;
  onValue?: (value?: Date) => void;
}

interface FormControlEmptyProps
  extends Omit<FieldDateProps, 'formControl' | 'value'> {
  onValue?: (value?: Date) => void;
}

export function RlsFieldDate(props: FormControlDefinedProps): ReactNode;
export function RlsFieldDate(props: FormControlUndefinedProps): ReactNode;
export function RlsFieldDate(props: FormControlVoidProps): ReactNode;
export function RlsFieldDate(props: FormControlEmptyProps): ReactNode;
export function RlsFieldDate({
  children,
  date,
  disabled,
  formControl,
  format,
  identifier,
  maxDate,
  minDate,
  msgErrorDisabled,
  onValue,
  placeholder,
  rlsTheme,
  value: _value
}: FieldDateProps) {
  const today = useRef(new Date()); // Initial current date in component

  const [value, setValue] = useState(formControl?.value ?? _value);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const _disabled = useMemo(() => {
    return formControl?.disabled || disabled;
  }, [formControl?.disabled, disabled]);

  const className = useMemo(() => {
    return renderClassStatus('rls-field-box', { disabled: _disabled });
  }, [_disabled]);

  const { icon, valueInput } = useMemo(() => {
    return {
      icon: value ? 'trash-2' : 'calendar',
      valueInput: value ? dateFormatTemplate(value, format || formatDate) : ''
    };
  }, [value]);

  useEffect(() => {
    const _date = verifyDateRange({
      date: formControl?.value ?? date ?? today.current,
      minDate,
      maxDate
    });

    setValue(_date);
    formControl?.setValue(_date);
  }, []);

  const onClickInput = useCallback(() => {
    setModalIsVisible(true);
  }, []);

  const onChange = useCallback(
    (value?: Date) => {
      setValue(value);
      onValue && onValue(value as Date);
    },
    [onValue]
  );

  const onClickAction = useCallback(() => {
    if (value) {
      formControl?.setValue(_value as Date);
      formControl?.touch();
      onChange(_value);
    } else {
      setModalIsVisible(true);
    }
  }, [value, formControl, _value, onChange]);

  const onListener = useCallback(
    ({ event, value }: PickerListener<Date>) => {
      event !== PickerListenerEvent.Cancel && onChange(value);
      formControl?.touch();
      setModalIsVisible(false);
    },
    [formControl, onChange]
  );

  return (
    <div id={identifier} className="rls-field-date" rls-theme={rlsTheme}>
      <div className={className}>
        {children && <label className="rls-field-box__label">{children}</label>}

        <div className="rls-field-box__component">
          <div className="rls-field-box__body">
            <input
              className="rls-field-date__control"
              type="text"
              value={valueInput}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
              disabled={_disabled}
            />

            <button
              className="rls-field-date__action"
              onClick={onClickAction}
              disabled={_disabled}
            >
              <RlsIcon value={icon} />
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

      <RlsModal className='rls-field-date-modal' visible={modalIsVisible} rlsTheme={rlsTheme}>
        <RlsPickerDate
          formControl={formControl}
          date={date}
          disabled={_disabled}
          maxDate={maxDate}
          minDate={minDate}
          onListener={onListener}
        />
      </RlsModal>
    </div>
  );
}
