import { memo, MouseEvent, MouseEventHandler, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useDialogFocusController } from '../../../controllers/DialogFocusController';
import { PortalController } from '../../../controllers/PortalController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface BottomSheetProps extends RlsComponent {
  autoclose?: boolean;
  controller?: PortalController;
  onBackdrop?: MouseEventHandler<HTMLDivElement>;
  visible?: boolean;
}

function RlsBottomSheetComponent({
  autoclose,
  children,
  className,
  controller,
  rlsSize,
  onBackdrop,
  visible,
  rlsTheme
}: BottomSheetProps) {
  const classNameSheet = renderClassStatus(
    'rls-bottom-sheet',
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
    <div className={classNameSheet} rls-size={rlsSize} rls-theme={rlsTheme}>
      <div
        ref={dialog.refDialog}
        className="rls-bottom-sheet__component"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {children}
      </div>

      <div
        className="rls-bottom-sheet__backdrop"
        role="presentation"
        onClick={onClickBackdrop}
      ></div>
    </div>,
    document.body
  );
}

export const RlsBottomSheet = memo(RlsBottomSheetComponent);
