import { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './FormNavigation.css';

interface FormNavigationProps extends RlsComponent {
  className?: string;
  onAutoClose?: () => void;
  visible?: boolean;
}

export function RlsFormNavigation({
  onAutoClose,
  children,
  className,
  visible,
  rlsTheme
}: FormNavigationProps) {
  const classNameForm = useMemo(() => {
    return renderClassStatus('rls-form-navigation', { visible }, className);
  }, [visible, className]);

  const onClickBackdrop = useCallback(() => {
    onAutoClose && onAutoClose();
  }, [onAutoClose]);

  return ReactDOM.createPortal(
    <div className={classNameForm} rls-theme={rlsTheme}>
      <div className="rls-form-navigation__component">{children}</div>

      <div
        className="rls-form-navigation__backdrop"
        onClick={onClickBackdrop}
      ></div>
    </div>,
    document.body
  );
}
