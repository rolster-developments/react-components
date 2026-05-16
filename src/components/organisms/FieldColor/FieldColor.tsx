import { PickerListenerEvent } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { hexIsValid, normalizeHex } from '../../../helpers/color';
import { renderClassStatus } from '../../../helpers/css';
import { RlsButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { RlsComponent } from '../../definitions';
import { RlsMessageFormError } from '../../molecules/MessageFormError/MessageFormError';
import { RlsModal } from '../Modal/Modal';
import { RlsPickerColor } from '../PickerColor/PickerColor';

interface FieldColorProps extends RlsComponent {
  color?: string;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, string>
    | ReactControl<HTMLElement, string | undefined>;
  msgErrorDisabled?: boolean;
  onValue?: ((value?: string) => void) | ((value: string) => void);
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
}

interface FieldColorDefinedProps extends FieldColorProps {
  formControl: ReactControl<HTMLElement, string>;
  value: string;
  onValue?: (value: string) => void;
}

interface FieldColorUndefinedProps extends FieldColorProps {
  formControl: ReactControl<HTMLElement, string | undefined>;
  value: undefined;
  onValue?: (value?: string) => void;
}

interface FieldColorVoidProps extends Omit<FieldColorProps, 'value'> {
  formControl: ReactControl<HTMLElement, string | undefined>;
  onValue?: (value?: string) => void;
}

interface FieldColorEmptyProps
  extends Omit<FieldColorProps, 'formControl' | 'value'> {
  onValue?: (value?: string) => void;
}

export function RlsFieldColor(props: FieldColorDefinedProps): ReactNode;
export function RlsFieldColor(props: FieldColorUndefinedProps): ReactNode;
export function RlsFieldColor(props: FieldColorVoidProps): ReactNode;
export function RlsFieldColor(props: FieldColorEmptyProps): ReactNode;
export function RlsFieldColor({
  children,
  color,
  disabled: disabledProps,
  formControl,
  identifier,
  msgErrorDisabled,
  onValue,
  placeholder,
  readOnly,
  rlsTheme,
  value: valueInitial
}: FieldColorProps) {
  const [value, setValue] = useState(formControl?.value ?? valueInitial);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const colorValue = useMemo(() => {
    return formControl ? formControl.value : value;
  }, [formControl?.value, value]);

  const disabled = useMemo(() => {
    return formControl?.disabled || disabledProps;
  }, [formControl?.disabled, disabledProps]);

  const className = useMemo(() => {
    return renderClassStatus('rls-field-box', {
      disabled,
      readonly: readOnly
    });
  }, [disabled, readOnly]);

  const displayHex = useMemo(() => {
    const hex = colorValue && hexIsValid(colorValue) ? colorValue : '';

    return normalizeHex(hex);
  }, [colorValue]);

  const onClickInput = useCallback(() => {
    !readOnly && setModalIsVisible(true);
  }, [readOnly]);

  const onChange = useCallback(
    (value?: string) => {
      setValue(value);
      onValue?.(value as string);
    },
    [onValue]
  );

  const onClickAction = useCallback(() => {
    if (colorValue) {
      formControl?.setValue(valueInitial as string);
      formControl?.touch();
      onChange(valueInitial);
    } else {
      setModalIsVisible(true);
    }
  }, [colorValue, formControl, valueInitial, onChange]);

  const onListener = useCallback(
    ({ event, value }: { event: PickerListenerEvent; value?: string }) => {
      event !== PickerListenerEvent.Cancel && onChange(value);
      formControl?.touch();
      setModalIsVisible(false);
    },
    [formControl, onChange]
  );

  return (
    <div id={identifier} className="rls-field-color" rls-theme={rlsTheme}>
      <div className={className}>
        {children && <span className="rls-field-box__label">{children}</span>}

        <div className="rls-field-box__component">
          <div className="rls-field-box__body">
            {displayHex && (
              <div
                className="rls-field-color__swatch"
                style={{ backgroundColor: displayHex }}
              />
            )}

            <input
              className="rls-field-color__control"
              type="text"
              value={displayHex}
              readOnly={true}
              placeholder={placeholder}
              onClick={onClickInput}
              disabled={disabled}
            />

            {!readOnly && (
              <RlsButtonIcon
                icon={colorValue ? 'trash-2' : 'color-palette'}
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
        className="rls-field-color-modal"
        visible={modalIsVisible}
        rlsTheme={rlsTheme}
      >
        <RlsPickerColor
          formControl={formControl}
          color={color}
          disabled={disabled}
          onListener={onListener}
        />
      </RlsModal>
    </div>
  );
}
