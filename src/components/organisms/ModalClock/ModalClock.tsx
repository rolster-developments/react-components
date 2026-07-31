import { PickerListener, PickerListenerEvent } from '@rolster/components';
import { Time } from '@rolster/dates';
import { ReactControl } from '@rolster/react-forms';
import { memo, useCallback } from 'react';
import { PortalController } from '../../../controllers/PortalController';
import { RlsComponent } from '../../definitions';
import { RlsModal } from '../Modal/Modal';
import { RlsPickerClock } from '../PickerClock/PickerClock';

interface ModalClockProps extends RlsComponent {
  controller?: PortalController;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, Time>
    | ReactControl<HTMLElement, Time | undefined>;
  onClose?: (time?: Time) => void;
  time?: Time;
  visible?: boolean;
}

function RlsModalClockComponent({
  controller,
  disabled,
  formControl,
  onClose,
  rlsTheme,
  time,
  visible
}: ModalClockProps) {
  const onListener = useCallback(
    ({ event, value }: PickerListener<Time>) => {
      onClose?.(event !== PickerListenerEvent.Cancel ? value : undefined);
      controller?.close();
    },
    [onClose, controller]
  );

  return (
    <RlsModal
      className="rls-modal-clock"
      controller={controller}
      visible={visible}
      rlsTheme={rlsTheme}
    >
      <RlsPickerClock
        formControl={formControl}
        time={time}
        disabled={disabled}
        onListener={onListener}
      />
    </RlsModal>
  );
}

export const RlsModalClock = memo(RlsModalClockComponent);
