import { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { PortalController } from '../../../controllers/PortalController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Modal.css';

interface ModalProps extends RlsComponent {
  autoclose?: boolean;
  controller?: PortalController;
  onBackdrop?: () => void;
  visible?: boolean;
}

export function RlsModal({
  autoclose,
  children,
  className,
  controller,
  onBackdrop,
  visible,
  rlsTheme
}: ModalProps) {
  const classNameModal = useMemo(() => {
    return renderClassStatus(
      'rls-modal',
      { visible: controller?.visible ?? visible },
      className
    );
  }, [className, visible, controller?.visible]);

  const onClickBackdrop = useCallback(() => {
    autoclose && controller?.close();
    onBackdrop?.();
  }, [autoclose, controller, onBackdrop]);

  return ReactDOM.createPortal(
    <div className={classNameModal} rls-theme={rlsTheme}>
      <div className="rls-modal__component">{children}</div>

      <div className="rls-modal__backdrop" onClick={onClickBackdrop}></div>
    </div>,
    document.body
  );
}
