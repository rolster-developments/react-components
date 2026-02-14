import { useEffect, useMemo } from 'react';
import { DropdownController } from '../../../controllers/DropdownController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Dropdown.css';

interface DropdownProps extends RlsComponent {
  controller: DropdownController;
}

export function RlsDropdown({ children, controller, rlsTheme }: DropdownProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-dropdown', {
      visible: controller.visible
    });
  }, [controller.visible]);

  useEffect(() => {
    function onCloseDropdown({ target }: MouseEvent) {
      !controller.component.current.contains(target as any) &&
        controller.close();
    }

    document.addEventListener('click', onCloseDropdown);

    return () => {
      document.removeEventListener('click', onCloseDropdown);
    };
  }, []);

  return (
    <div ref={controller.component} className={className} rls-theme={rlsTheme}>
      <div className="rls-dropdown__content">{children}</div>
    </div>
  );
}
