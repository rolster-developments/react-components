import { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './FormNavigation.css';

export interface FormNavigationProps extends RlsComponent {
  visible?: boolean;
}

export function RlsFormNavigation({
  children,
  className,
  visible,
  rlsTheme
}: FormNavigationProps) {
  const classNameForm = useMemo(() => {
    return renderClassStatus('rls-form-navigation', { visible }, className);
  }, [visible, className]);

  return ReactDOM.createPortal(
    <div className={classNameForm} rls-theme={rlsTheme}>
      <div className="rls-form-navigation__component">{children}</div>
    </div>,
    document.body
  );
}
