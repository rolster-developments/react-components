import { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { PortalController } from '../../../controllers/PortalController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface ModalSheetProps extends RlsComponent {
  autoclose?: boolean;
  controller?: PortalController;
  onAutoClose?: () => void;
  visible?: boolean;
}

export function RlsModalSheet({
  autoclose,
  children,
  className,
  controller,
  onAutoClose,
  visible,
  rlsTheme
}: ModalSheetProps) {
  const classNameModal = useMemo(() => {
    return renderClassStatus(
      'rls-modal-sheet',
      { visible: controller?.visible ?? visible },
      className
    );
  }, [className, visible, controller?.visible]);

  const onClickBackdrop = useCallback(() => {
    autoclose && controller?.close();
    onAutoClose?.();
  }, [autoclose, controller, onAutoClose]);

  return ReactDOM.createPortal(
    <div className={classNameModal} rls-theme={rlsTheme}>
      <div className="rls-modal-sheet__component">{children}</div>

      <div
        className="rls-modal-sheet__backdrop"
        onClick={onClickBackdrop}
      ></div>
    </div>,
    document.body
  );
}
