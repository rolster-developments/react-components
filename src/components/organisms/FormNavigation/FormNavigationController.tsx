import { ReactNode, useMemo } from 'react';
import { usePortalController } from '../../../controllers/PortalController';
import { RlsFormNavigation } from './FormNavigation';

interface FormNavigationController {
  close: () => void;
  FormNavigation: ReactNode;
  open: (children?: ReactNode) => void;
}

export function useFormNavigationController(
  component?: ReactNode
): FormNavigationController {
  const portal = usePortalController(component);

  const FormNavigation = useMemo(() => {
    return (
      <RlsFormNavigation visible={portal.visible}>
        {portal.children}
      </RlsFormNavigation>
    );
  }, [portal.children, portal.visible]);

  return {
    close: portal.close,
    FormNavigation,
    open: portal.open
  };
}
