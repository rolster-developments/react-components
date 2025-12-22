import { ReactNode, useCallback } from 'react';
import { PortalController } from '../../../controllers/PortalController';
import { RlsComponent } from '../../definitions';
import { RlsFormNavigation } from './FormNavigation';

type FormNavigationController = (props: RlsComponent) => ReactNode;

export function useFormNavigationController(
  portal: PortalController
): FormNavigationController {
  const FormNavigation = useCallback(
    ({ children }: RlsComponent) => {
      return (
        <RlsFormNavigation visible={portal.visible}>
          {children}
        </RlsFormNavigation>
      );
    },
    [portal.visible]
  );

  return FormNavigation;
}
