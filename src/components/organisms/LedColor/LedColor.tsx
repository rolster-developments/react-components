import { PickerListenerEvent } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { memo, ReactNode, useCallback, useMemo, useState } from 'react';
import { hexIsValid, normalizeHex } from '../../../helpers/color';
import { renderClassStatus } from '../../../helpers/css';
import { RlsLed } from '../../atoms/Led/Led';
import { PropsWithClassName, PropsWithRlsTheme } from '../../definitions';
import { RolsterReactHtmlControl } from '../../types';
import { RlsModal } from '../Modal/Modal';
import { RlsPickerColor } from '../PickerColor/PickerColor';

interface LedColorProps extends PropsWithRlsTheme, PropsWithClassName {
  color?: string;
  disabled?: boolean;
  formControl?: RolsterReactHtmlControl<string>;
  identifier?: string;
  onValue?: ((value?: string) => void) | ((value: string) => void);
  readOnly?: boolean;
  value?: string;
}

interface LedColorDefinedProps extends LedColorProps {
  formControl: ReactControl<HTMLElement, string>;
  value: string;
  onValue?: (value: string) => void;
}

interface LedColorUndefinedProps extends LedColorProps {
  formControl: ReactControl<HTMLElement, string | undefined>;
  value: undefined;
  onValue?: (value?: string) => void;
}

interface LedColorVoidProps extends Omit<LedColorProps, 'value'> {
  formControl: ReactControl<HTMLElement, string | undefined>;
  onValue?: (value?: string) => void;
}

interface LedColorEmptyProps extends Omit<LedColorProps, 'formControl'> {
  onValue?: (value?: string) => void;
}

function RlsLedColorComponent(props: LedColorDefinedProps): ReactNode;
function RlsLedColorComponent(props: LedColorUndefinedProps): ReactNode;
function RlsLedColorComponent(props: LedColorVoidProps): ReactNode;
function RlsLedColorComponent(props: LedColorEmptyProps): ReactNode;
function RlsLedColorComponent({
  className,
  color,
  disabled: disabledProps,
  formControl,
  identifier,
  onValue,
  readOnly,
  rlsTheme,
  value: valueInitial
}: LedColorProps) {
  const [value, setValue] = useState(formControl?.value ?? valueInitial);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [pickerKey, setPickerKey] = useState(0);

  const colorValue = useMemo(() => {
    return formControl ? formControl.value : value;
  }, [formControl?.value, value]);

  const disabled = useMemo(() => {
    return formControl?.disabled || disabledProps;
  }, [formControl?.disabled, disabledProps]);

  const ledColor = useMemo(() => {
    return colorValue && hexIsValid(colorValue)
      ? normalizeHex(colorValue)
      : undefined;
  }, [colorValue]);

  const classNameLed = renderClassStatus(
    'rls-led-color',
    { disabled, error: formControl?.wrong, readonly: readOnly },
    className
  );

  const onChange = useCallback(
    (value?: string) => {
      setValue(value);
      onValue?.(value as string);
    },
    [onValue]
  );

  const onClickLed = useCallback(() => {
    if (!disabled && !readOnly) {
      setPickerKey((key) => key + 1);
      setModalIsVisible(true);
    }
  }, [disabled, readOnly]);

  const onListener = useCallback(
    ({ event, value }: { event: PickerListenerEvent; value?: string }) => {
      if (event !== PickerListenerEvent.Cancel) {
        onChange(value);
      }

      formControl?.touch();
      setModalIsVisible(false);
    },
    [formControl, onChange]
  );

  const onBackdrop = useCallback(() => {
    setModalIsVisible(false);
  }, []);

  return (
    <div id={identifier} className={classNameLed} rls-theme={rlsTheme}>
      <button
        className="rls-led-color__trigger"
        type="button"
        disabled={disabled}
        onClick={onClickLed}
      >
        <RlsLed color={ledColor} rlsTheme={rlsTheme} />
      </button>

      <RlsModal
        className="rls-modal-color"
        visible={modalIsVisible}
        rlsTheme={rlsTheme}
        onBackdrop={onBackdrop}
      >
        <RlsPickerColor
          key={pickerKey}
          formControl={formControl}
          color={ledColor ?? color}
          disabled={disabled}
          onListener={onListener}
        />
      </RlsModal>
    </div>
  );
}

export const RlsLedColor = memo(
  RlsLedColorComponent
) as typeof RlsLedColorComponent;
