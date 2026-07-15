import { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';

import { PortalController } from '../../../controllers/PortalController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface BottomSheetProps extends RlsComponent {
  autoclose?: boolean;
  controller?: PortalController;
  onBackdrop?: () => void;
  visible?: boolean;
}

export function RlsBottomSheet({
  autoclose,
  children,
  className,
  controller,
  onBackdrop,
  visible,
  rlsTheme
}: BottomSheetProps) {
  const classNameSheet = useMemo(() => {
    return renderClassStatus(
      'rls-bottom-sheet',
      { visible: controller?.visible ?? visible },
      className
    );
  }, [className, visible, controller?.visible]);

  const onClickBackdrop = useCallback(() => {
    if (autoclose) {
      controller?.close();
    }
    onBackdrop?.();
  }, [autoclose, controller, onBackdrop]);

  return ReactDOM.createPortal(
    <div className={classNameSheet} rls-theme={rlsTheme}>
      <div className="rls-bottom-sheet__component">{children}</div>

      <div
        className="rls-bottom-sheet__backdrop"
        onClick={onClickBackdrop}
      ></div>
    </div>,
    document.body
  );
}
