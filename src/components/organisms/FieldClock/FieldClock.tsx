import { Time } from '@rolster/dates';
import { ReactControl } from '@rolster/react-forms';
import { memo, ReactNode, useCallback, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../../molecules/MessageFormError/MessageFormError';
import { RolsterReactHtmlControl } from '../../types';
import { RlsModalClock } from '../ModalClock/ModalClock';

interface FieldClockProps extends RlsComponent {
  disabled?: boolean;
  formControl?: RolsterReactHtmlControl<Time>;
  msgErrorDisabled?: boolean;
  onValue?: ((value?: Time) => void) | ((value: Time) => void);
  placeholder?: string;
  readOnly?: boolean;
  time?: Time;
  value?: Time;
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

interface FieldClockEmptyProps extends Omit<
  FieldClockProps,
  'formControl' | 'value'
> {
  onValue?: (value?: Time) => void;
}

function RlsFieldClockComponent(props: FieldClockDefinedProps): ReactNode;
function RlsFieldClockComponent(props: FieldClockUndefinedProps): ReactNode;
function RlsFieldClockComponent(props: FieldClockVoidProps): ReactNode;
function RlsFieldClockComponent(props: FieldClockEmptyProps): ReactNode;
function RlsFieldClockComponent({
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

  const className = renderClassStatus('rls-field-box', {
    disabled,
    readonly: readOnly
  });

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
    if (!readOnly) {
      setModalIsVisible(true);
    }
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

  const onCloseModal = useCallback(
    (time?: Time) => {
      if (time) {
        onChange(time);
      }

      formControl?.touch();
      setModalIsVisible(false);
    },
    [formControl, onChange]
  );

  return (
    <div id={identifier} className="rls-field-clock" rls-theme={rlsTheme}>
      <div className={className}>
        {children && <span className="rls-field-box__label">{children}</span>}

        <div className="rls-field-box__component">
          <div className="rls-field-box__body">
            <input
              className="rls-field-clock__control"
              type="text"
              value={status.valueInput}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
              disabled={disabled}
            />

            {!readOnly && !disabled && (
              <RlsButtonIcon icon={status.icon} onClick={onClickAction} />
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

      <RlsModalClock
        visible={modalIsVisible}
        formControl={formControl}
        time={time}
        disabled={disabled}
        onClose={onCloseModal}
        rlsTheme={rlsTheme}
      />
    </div>
  );
}

export const RlsFieldClock = memo(
  RlsFieldClockComponent
) as typeof RlsFieldClockComponent;
