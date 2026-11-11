import { memo, MouseEvent, MouseEventHandler, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { PortalController } from '../../../controllers/PortalController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface ModalProps extends RlsComponent {
  autoclose?: boolean;
  controller?: PortalController;
  onBackdrop?: MouseEventHandler<HTMLDivElement>;
  visible?: boolean;
}

function RlsModalComponent({
  autoclose,
  children,
  className,
  controller,
  rlsSize,
  onBackdrop,
  visible,
  rlsTheme
}: ModalProps) {
  const classNameModal = renderClassStatus(
    'rls-modal',
    { visible: controller?.visible ?? visible },
    className
  );

  const onClickBackdrop = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (autoclose) {
        controller?.close();
      }

      onBackdrop?.(event);
    },
    [autoclose, controller, onBackdrop]
  );

  return ReactDOM.createPortal(
    <div className={classNameModal} rls-size={rlsSize} rls-theme={rlsTheme}>
      <div className="rls-modal__component">{children}</div>

      <div className="rls-modal__backdrop" onClick={onClickBackdrop}></div>
    </div>,
    document.body
  );
}

export const RlsModal = memo(RlsModalComponent);
