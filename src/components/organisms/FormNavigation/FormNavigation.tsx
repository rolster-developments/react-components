import { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { PortalController } from '../../../controllers/PortalController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

export interface FormNavigationProps extends RlsComponent {
  controller?: PortalController;
  visible?: boolean;
}

export function RlsFormNavigation({
  children,
  className,
  controller,
  visible,
  rlsTheme
}: FormNavigationProps) {
  const classNameForm = useMemo(() => {
    return renderClassStatus(
      'rls-form-navigation',
      { visible: controller?.visible ?? visible },
      className
    );
  }, [className, visible, controller?.visible]);

  return ReactDOM.createPortal(
    <div className={classNameForm} rls-theme={rlsTheme}>
      <div className="rls-form-navigation__component">{children}</div>
    </div>,
    document.body
  );
}
