import { useInputControl } from '@rolster/react-forms';
import { useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router';
import {
  NavbarMenuOption,
  RlsAppPage,
  RlsAppThemeTabs,
  RlsAppToolbar,
  RlsBody,
  RlsContent,
  RlsInputSearch,
  RlsNavbar,
  RlsNavbarBody,
  RlsNavbarMenu,
  useDesingSystemController
} from '../index';
import { DEMO_ROUTES } from './routes';

const NAV_OPTIONS: NavbarMenuOption[] = DEMO_ROUTES.map(
  ({ icon, id, label }) => ({ icon, id, label })
);

export function DemoLayout() {
  useDesingSystemController('bordered');
  const navigate = useNavigate();
  const searchControl = useInputControl('');

  const onOption = useCallback(
    ({ id }: NavbarMenuOption) => {
      const route = DEMO_ROUTES.find((option) => option.id === id);

      if (route) {
        navigate(route.path);
      }
    },
    [navigate]
  );

  return (
    <RlsAppPage>
      <RlsNavbar>
        <RlsNavbarBody>
          <RlsNavbarMenu options={NAV_OPTIONS} onOption={onOption} />
        </RlsNavbarBody>
      </RlsNavbar>

      <RlsBody>
        <RlsAppToolbar>
          <div className="demo-toolbar">
            <h6>Welcome back Daniel 👋</h6>

            <div className="demo-toolbar__actions">
              <RlsInputSearch placeholder="Search" formControl={searchControl} />

              <RlsAppThemeTabs rlsTheme="neutral" />
            </div>
          </div>
        </RlsAppToolbar>

        <RlsContent>
          <Outlet />
        </RlsContent>
      </RlsBody>
    </RlsAppPage>
  );
}
