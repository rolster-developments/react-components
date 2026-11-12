import { memo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useDialogFocusController } from '../../../controllers/DialogFocusController';
import { PortalController } from '../../../controllers/PortalController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface ModalSheetProps extends RlsComponent {
  autoclose?: boolean;
  controller?: PortalController;
  onAutoClose?: () => void;
  visible?: boolean;
}

function RlsModalSheetComponent({
  autoclose,
  children,
  className,
  controller,
  rlsSize,
  onAutoClose,
  visible,
  rlsTheme
}: ModalSheetProps) {
  const classNameModal = renderClassStatus(
    'rls-modal-sheet',
    { visible: controller?.visible ?? visible },
    className
  );

  const onClickBackdrop = useCallback(() => {
    if (autoclose) {
      controller?.close();
    }

    onAutoClose?.();
  }, [autoclose, controller, onAutoClose]);

  const onEscape = useCallback(() => {
    if (autoclose) {
      controller?.close();
    }
  }, [autoclose, controller]);

  const dialog = useDialogFocusController({
    visible: controller?.visible ?? visible ?? false,
    onEscape
  });

  return ReactDOM.createPortal(
    <div className={classNameModal} rls-size={rlsSize} rls-theme={rlsTheme}>
      <div
        ref={dialog.refDialog}
        className="rls-modal-sheet__component"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {children}
      </div>

      <div
        className="rls-modal-sheet__backdrop"
        role="presentation"
        onClick={onClickBackdrop}
      ></div>
    </div>,
    document.body
  );
}

export const RlsModalSheet = memo(RlsModalSheetComponent);
