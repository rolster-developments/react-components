import { memo } from 'react';
import ReactDOM from 'react-dom';
import { PortalController } from '../../../controllers/PortalController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

export interface FormNavigationProps extends RlsComponent {
  controller?: PortalController;
  visible?: boolean;
}

function RlsFormNavigationComponent({
  children,
  className,
  controller,
  visible,
  rlsTheme
}: FormNavigationProps) {
  const classNameForm = renderClassStatus(
    'rls-form-navigation',
    { visible: controller?.visible ?? visible },
    className
  );

  return ReactDOM.createPortal(
    <div className={classNameForm} rls-theme={rlsTheme}>
      <div className="rls-form-navigation__component">{children}</div>
    </div>,
    document.body
  );
}

export const RlsFormNavigation = memo(RlsFormNavigationComponent);
