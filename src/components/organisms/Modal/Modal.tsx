import { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './Modal.css';

interface ModalProps extends RlsComponent {
  className?: string;
  overflow?: boolean;
  visible?: boolean;
}

export function RlsModal({
  children,
  className,
  overflow,
  visible,
  rlsTheme
}: ModalProps) {
  const classNameModal = useMemo(() => {
    return renderClassStatus('rls-modal', { overflow, visible }, className);
  }, [className, overflow, visible]);

  return ReactDOM.createPortal(
    <div className={classNameModal} rls-theme={rlsTheme}>
      <div className="rls-modal__component">{children}</div>

      <div className="rls-modal__backdrop"></div>
    </div>,
    document.body
  );
}
