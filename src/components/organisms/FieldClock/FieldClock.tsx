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
  disabled,
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
      icon: value ? 'trash-2' : 'timer',
      valueInput: value?.normalizeMeridiemFormat || ''
    };
  }, [value]);

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
    if (value) {
      formControl?.setValue(valueInitial as Time);
      formControl?.touch();
      onChange(valueInitial);
    } else {
      setModalIsVisible(true);
    }
  }, [value, formControl, valueInitial, onChange]);

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
              value={valueInput}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
              disabled={_disabled}
            />

            {!readOnly && (
              <button
                className="rls-field-date__action"
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
        className="rls-field-clock-modal"
        visible={modalIsVisible}
        rlsTheme={rlsTheme}
      >
        <RlsPickerClock
          formControl={formControl}
          time={time}
          disabled={_disabled}
          onListener={onListener}
        />
      </RlsModal>
    </div>
  );
}
