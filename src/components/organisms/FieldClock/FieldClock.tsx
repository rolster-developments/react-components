import { PickerListener, PickerListenerEvent } from '@rolster/components';
import { Time } from '@rolster/dates';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../../molecules/MessageFormError/MessageFormError';
import { RlsModal } from '../Modal/Modal';
import { RlsPickerClock } from '../PickerClock/PickerClock';
import './FieldClock.css';

interface FieldClockProps extends RlsComponent {
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, Time>
    | ReactControl<HTMLElement, Time | undefined>;
  msgErrorDisabled?: boolean;
  onValue?: ((value?: Time) => void) | ((value: Time) => void);
  placeholder?: string;
  readOnly?: boolean;
  value?: Time;
  time?: Time;
}

interface FieldClockDefinedProps extends FieldClockProps {
  formControl: ReactControl<HTMLElement, Time>;
  value: Time;
  onValue?: (value: Time) => void;
}

interface FieldClockUndefinedProps extends FieldClockProps {
  formControl: ReactControl<HTMLElement, Time | undefined>;
  value: undefined;
  onValue?: (value?: Time) => void;
}

interface FieldClockVoidProps extends Omit<FieldClockProps, 'value'> {
  formControl: ReactControl<HTMLElement, Time | undefined>;
  onValue?: (value?: Time) => void;
}

interface FieldClockEmptyProps
  extends Omit<FieldClockProps, 'formControl' | 'value'> {
  onValue?: (value?: Time) => void;
}

export function RlsFieldClock(props: FieldClockDefinedProps): ReactNode;
export function RlsFieldClock(props: FieldClockUndefinedProps): ReactNode;
export function RlsFieldClock(props: FieldClockVoidProps): ReactNode;
export function RlsFieldClock(props: FieldClockEmptyProps): ReactNode;
export function RlsFieldClock({
  children,
  disabled: disabledProps,
  formControl,
  identifier,
  msgErrorDisabled,
  onValue,
  placeholder,
  readOnly,
  rlsTheme,
  time,
  value: valueInitial
}: FieldClockProps) {
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

  const timeValue = useMemo(() => {
    return formControl ? formControl.value : value;
  }, [formControl?.value, value]);

  const status = useMemo(() => {
    return {
      icon: timeValue ? 'trash-2' : 'timer',
      valueInput: timeValue?.normalizeMeridiemFormat || ''
    };
  }, [timeValue]);

  const onClickInput = useCallback(() => {
    !readOnly && setModalIsVisible(true);
  }, [readOnly]);

  const onChange = useCallback(
    (value?: Time) => {
      setValue(value);
      onValue?.(value as Time);
    },
    [onValue]
  );

  const onClickAction = useCallback(() => {
    if (timeValue) {
      formControl?.setValue(valueInitial as Time);
      formControl?.touch();
      onChange(valueInitial);
    } else {
      setModalIsVisible(true);
    }
  }, [timeValue, formControl, valueInitial, onChange]);

  const onListener = useCallback(
    ({ event, value }: PickerListener<Time>) => {
      event !== PickerListenerEvent.Cancel && onChange(value);
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
              value={status.valueInput}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
              disabled={disabled}
            />

            {!readOnly && (
              <button
                className="rls-field-date__action"
                onClick={onClickAction}
                disabled={disabled}
              >
                <RlsIcon value={status.icon} />
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
        className="rls-field-clock-modal"
        visible={modalIsVisible}
        rlsTheme={rlsTheme}
      >
        <RlsPickerClock
          formControl={formControl}
          time={time}
          disabled={disabled}
          onListener={onListener}
        />
      </RlsModal>
    </div>
  );
}
