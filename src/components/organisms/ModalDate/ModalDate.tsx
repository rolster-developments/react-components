import { PickerListener, PickerListenerEvent } from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { memo, useCallback } from 'react';
import { PortalController } from '../../../controllers/PortalController';
import { RlsComponent } from '../../definitions';
import { RlsModal } from '../Modal/Modal';
import { RlsPickerDate } from '../PickerDate/PickerDate';

interface ModalDateProps extends RlsComponent {
  automatic?: boolean;
  controller?: PortalController;
  date?: Date;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, Date>
    | ReactControl<HTMLElement, Date | undefined>;
  maxDate?: Date;
  minDate?: Date;
  onClose?: (date?: Date) => void;
  visible?: boolean;
}

function RlsModalDateComponent({
  automatic,
  controller,
  date,
  disabled,
  formControl,
  maxDate,
  minDate,
  onClose,
  rlsTheme,
  visible
}: ModalDateProps) {
  const onListener = useCallback(
    ({ event, value }: PickerListener<Date>) => {
      onClose?.(event !== PickerListenerEvent.Cancel ? value : undefined);
      controller?.close();
    },
    [onClose, controller]
  );

  return (
    <RlsModal
      className="rls-modal-date"
      controller={controller}
      visible={visible}
      rlsTheme={rlsTheme}
    >
      <RlsPickerDate
        automatic={automatic}
        formControl={formControl}
        date={date}
        disabled={disabled}
        maxDate={maxDate}
        minDate={minDate}
        onListener={onListener}
      />
    </RlsModal>
  );
}

export const RlsModalDate = memo(RlsModalDateComponent);
