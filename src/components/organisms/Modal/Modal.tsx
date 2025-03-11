import { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './Modal.css';

interface ModalProps extends RlsComponent {
  overflow?: boolean;
  visible?: boolean;
}

export function RlsModal({
  children,
  overflow,
  visible,
  rlsTheme
}: ModalProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-modal', { overflow, visible });
  }, [overflow, visible]);

  return ReactDOM.createPortal(
    <div className={className} rls-theme={rlsTheme}>
      <div className="rls-modal__component">{children}</div>

      <div className="rls-modal__backdrop"></div>
    </div>,
    document.body
  );
}
