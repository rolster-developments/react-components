import { useInputControl } from '@rolster/react-forms';
import { useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import {
  AppNavbarMenuOption,
  RlsAppBody,
  RlsAppContent,
  RlsAppNavbar,
  RlsAppNavbarBody,
  RlsAppNavbarMenu,
  RlsAppPage,
  RlsAppThemeTabs,
  RlsAppToolbar,
  RlsButtonAction,
  RlsInputSearch,
  useDesingSystemController,
  useRlsContext
} from '../index';
import { DEMO_ROUTES } from './routes';

const NAV_OPTIONS: AppNavbarMenuOption[] = DEMO_ROUTES.map(
  ({ icon, id, label }) => ({ icon, id, label })
);

export function DemoLayout() {
  useDesingSystemController('rome', 'bordered', 'filled');
  const navigate = useNavigate();
  const searchControl = useInputControl('');
  const { navbarIsCondense, setNavbarIsCondense } = useRlsContext();

  const [id, setId] = useState('table');

  const onNavbar = useCallback(() => {
    setNavbarIsCondense(!navbarIsCondense);
  }, [navbarIsCondense, setNavbarIsCondense]);

  const onOption = useCallback(
    ({ id }: AppNavbarMenuOption) => {
      const route = DEMO_ROUTES.find((option) => option.id === id);

      if (route) {
        navigate(route.path);
        setId(id);
      }
    },
    [navigate]
  );

  return (
    <RlsAppPage>
      <RlsAppNavbar mode="drawer">
        <RlsAppNavbarBody>
          <RlsAppNavbarMenu
            options={NAV_OPTIONS}
            activeId={id}
            onOption={onOption}
          />
        </RlsAppNavbarBody>
      </RlsAppNavbar>

      <RlsAppBody>
        <RlsAppToolbar>
          <div className="demo-toolbar">
            <div className="demo-toolbar__title">
              <RlsButtonAction
                icon="menu"
                type="ghost"
                tooltip="Menú"
                onClick={onNavbar}
              />

              <h6>Welcome back Daniel 👋</h6>
            </div>

            <div className="demo-toolbar__actions">
              <RlsInputSearch
                placeholder="Search"
                formControl={searchControl}
              />

              <RlsAppThemeTabs rlsTheme="neutral" />
            </div>
          </div>
        </RlsAppToolbar>

        <RlsAppContent>
          <Outlet />
        </RlsAppContent>
      </RlsAppBody>
    </RlsAppPage>
  );
}
