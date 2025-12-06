import { ReactControl } from '@rolster/react-forms';
import { ReactNode, useCallback, useMemo } from 'react';
import { useFormSingleSelectionController } from '../../../controllers/FormSingleSelectionController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';
import './ButtonOption.css';

interface ButtonOptionProps<T = any> extends RlsComponent {
  icon: string;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, T>;
  onClick?: () => void;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  value?: T;
}

interface ButtonOptionDefinedProps<T> extends ButtonOptionProps<T> {
  formControl: ReactControl<HTMLElement, T>;
  value: T;
  onValue?: (value: T) => void;
}

export function RlsButtonOption<T>(
  props: ButtonOptionDefinedProps<T>
): ReactNode;
export function RlsButtonOption<T = any>(
  props: ButtonOptionProps<T>
): ReactNode;
export function RlsButtonOption<T = any>({
  icon,
  children,
  disabled,
  formControl,
  identifier,
  onClick,
  onValue,
  value
}: ButtonOptionProps) {
  const { checked, onSelect } = useFormSingleSelectionController<T>({
    disabled,
    formControl,
    onValue,
    value
  });

  const className = useMemo(() => {
    return renderClassStatus('rls-button-option', { checked });
  }, [checked]);

  const onAction = useCallback(() => {
    onSelect();
    onClick && onClick();
  }, [onSelect, onClick]);

  return (
    <button
      id={identifier}
      className={className}
      onClick={onAction}
      disabled={disabled}
    >
      <RlsIcon value={icon} />
      {children}
    </button>
  );
}
