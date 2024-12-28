import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../helpers/css';
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
  return ReactDOM.createPortal(
    <div
      className={renderClassStatus('rls-modal', { overflow, visible })}
      rls-theme={rlsTheme}
    >
      <div className="rls-modal__component">{children}</div>

      <div className="rls-modal__backdrop"></div>
    </div>,
    document.body
  );
}
