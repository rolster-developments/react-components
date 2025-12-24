import { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Modal.css';

interface ModalProps extends RlsComponent {
  onAutoClose?: () => void;
  visible?: boolean;
}

export function RlsModal({
  children,
  className,
  onAutoClose,
  visible,
  rlsTheme
}: ModalProps) {
  const classNameModal = useMemo(() => {
    return renderClassStatus('rls-modal', { visible }, className);
  }, [className, visible]);

  const onClickBackdrop = useCallback(() => {
    onAutoClose && onAutoClose();
  }, [onAutoClose]);

  return ReactDOM.createPortal(
    <div className={classNameModal} rls-theme={rlsTheme}>
      <div className="rls-modal__component">{children}</div>

      <div className="rls-modal__backdrop" onClick={onClickBackdrop}></div>
    </div>,
    document.body
  );
}
