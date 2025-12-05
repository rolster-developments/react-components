import { ReactControl } from '@rolster/react-forms';
import { ReactNode, useMemo } from 'react';
import { useFormSingleSelectionController } from '../../../controllers/FormSingleSelectionController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsRadioButton } from '../../atoms/RadioButton/RadioButton';
import { RlsComponent } from '../../definitions';
import './LabelRadioButton.css';

interface LabelRadioButtonProps<T = any> extends RlsComponent {
  disabled?: boolean;
  extended?: boolean;
  formControl?:
    | ReactControl<HTMLElement, T | undefined>
    | ReactControl<HTMLElement, T>;
  onValue?: ((value?: T) => void) | ((value: T) => void);
  reverse?: boolean;
  value?: T;
}

interface LabelRadioButtonDefinedProps<T> extends LabelRadioButtonProps<T> {
  formControl: ReactControl<HTMLElement, T>;
  value: T;
  onValue?: (value: T) => void;
}

export function RlsLabelRadioButton<T>(
  props: LabelRadioButtonDefinedProps<T>
): ReactNode;
export function RlsLabelRadioButton<T = any>({
  children,
  disabled,
  extended,
  identifier,
  formControl,
  onValue,
  reverse,
  rlsTheme,
  value
}: LabelRadioButtonProps<T>) {
  const { checked, onSelect } = useFormSingleSelectionController<T>({
    disabled,
    formControl,
    onValue,
    value
  });

  const className = useMemo(() => {
    return renderClassStatus('rls-label-radiobutton', {
      disabled,
      extended,
      reverse
    });
  }, [disabled, extended, reverse]);

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      <div className="rls-label-radiobutton__component" onClick={onSelect}>
        <RlsRadioButton checked={checked} disabled={disabled} />
      </div>

      <div className="rls-label-radiobutton__text">{children}</div>
    </div>
  );
}
