import { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './ModalSheet.css';

interface ModalSheetProps extends RlsComponent {
  className?: string;
  onAutoClose?: () => void;
  visible?: boolean;
}

export function RlsModalSheet({
  children,
  className,
  onAutoClose,
  visible,
  rlsTheme
}: ModalSheetProps) {
  const classNameModal = useMemo(() => {
    return renderClassStatus('rls-modal-sheet', { visible }, className);
  }, [className, visible]);

  const onClickBackdrop = useCallback(() => {
    onAutoClose && onAutoClose();
  }, [onAutoClose]);

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
