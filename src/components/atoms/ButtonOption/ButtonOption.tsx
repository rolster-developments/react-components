import { ReactControl } from '@rolster/react-forms';
import { memo, ReactNode, useCallback } from 'react';
import { useFormSingleSelectionController } from '../../../controllers/FormSingleSelectionController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';

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

function RlsButtonOptionComponent<T>(
  props: ButtonOptionDefinedProps<T>
): ReactNode;
function RlsButtonOptionComponent<T = any>(
  props: ButtonOptionProps<T>
): ReactNode;
function RlsButtonOptionComponent<T = any>({
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

  const className = renderClassStatus('rls-button-option', { checked });

  const onAction = useCallback(() => {
    onSelect();
    onClick?.();
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

export const RlsButtonOption = memo(
  RlsButtonOptionComponent
) as typeof RlsButtonOptionComponent;
