import { createContext, useContext, useMemo, useState } from 'react';
import { RlsComponent } from './components/definitions';
import {
  Confirmation,
  useConfirmation
} from './components/organisms/Confirmation/Confirmation';
import {
  Notify,
  useNotifications
} from './components/organisms/Notifications/Notifications';
import {
  Snackbar,
  useSnackbar
} from './components/organisms/Snackbar/Snackbar';
import { renderClassStatus } from './helpers/css';

interface RlsState {
  confirmation: Confirmation;
  notify: Notify;
  setIsMobile: (appIsMobile: boolean) => void;
  setNavbarInApp: (navbarInApp: boolean) => void;
  setNavbarIsCondense: (navbarIsCondense: boolean) => void;
  snackbar: Snackbar;
}

export const RlsContext = createContext<RlsState | null>(null);

export function useRlsContext(): RlsState {
  const state = useContext(RlsContext);

  if (!state) {
    throw new Error('RlsApplication not wrapped in Project');
  }

  return state;
}

export function RlsApplication({ children }: RlsComponent) {
  const { RlsConfirmation, confirmation } = useConfirmation();
  const { RlsSnackbar, snackbar } = useSnackbar();
  const { RlsNotifications, notify } = useNotifications();

  const [navbarInApp, setNavbarInApp] = useState(false);
  const [navbarIsCondense, setNavbarIsCondense] = useState(false);
  const [appIsMobile, setIsMobile] = useState(false);

  const className = renderClassStatus('rls-app__body', {
    mobile: appIsMobile,
    'navbar-snackbar': navbarInApp,
    'navbar-condense': navbarIsCondense
  });

  const state = useMemo<RlsState>(
    () => ({
      confirmation,
      notify,
      setIsMobile,
      setNavbarInApp,
      setNavbarIsCondense,
      snackbar
    }),
    [confirmation, notify, snackbar]
  );

  return (
    <RlsContext value={state}>
      <div className={className}>
        {children}

        <RlsSnackbar />
      </div>

      <RlsConfirmation />
      <RlsNotifications />
    </RlsContext>
  );
}
