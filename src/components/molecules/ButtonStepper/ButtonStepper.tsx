import { useCallback } from 'react';
import { RlsButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { RlsComponent } from '../../definitions';

export type ButtonStepperAction = 'down' | 'up';

interface ButtonStepperProps extends RlsComponent {
  disabled?: boolean;
  onAction?: (action: ButtonStepperAction) => void;
}

export function RlsButtonStepper({
  disabled,
  onAction,
  rlsTheme
}: ButtonStepperProps) {
  const onDown = useCallback(() => {
    onAction?.('down');
  }, [onAction]);

  const onUp = useCallback(() => {
    onAction?.('up');
  }, [onAction]);

  return (
    <div className="rls-button-stepper" rls-theme={rlsTheme}>
      <RlsButtonIcon
        icon="arrow-ios-down"
        disabled={disabled}
        onClick={onDown}
      />

      <RlsButtonIcon icon="arrow-ios-up" disabled={disabled} onClick={onUp} />
    </div>
  );
}
