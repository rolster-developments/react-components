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
  snackbar: Snackbar;
  setIsMobile: (appIsMobile: boolean) => void;
  setNavbarInApp: (navbarInApp: boolean) => void;
  setNavbarIsCondense: (navbarIsCondense: boolean) => void;
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
  const { RlsNotifications, notify } = useNotifications();
  const { RlsSnackbar, snackbar } = useSnackbar();

  const [navbarInApp, setNavbarInApp] = useState(false);
  const [navbarIsCondense, setNavbarIsCondense] = useState(false);
  const [appIsMobile, setIsMobile] = useState(false);

  const className = useMemo(() => {
    return renderClassStatus('rls-app__body', {
      mobile: appIsMobile,
      'navbar-snackbar': navbarInApp,
      'navbar-condense': navbarIsCondense
    });
  }, [appIsMobile, navbarInApp, navbarIsCondense]);

  return (
    <RlsContext
      value={{
        confirmation,
        notify,
        snackbar,
        setIsMobile,
        setNavbarInApp,
        setNavbarIsCondense
      }}
    >
      <div className={className}>
        {children}

        {RlsSnackbar}
      </div>

      {RlsNotifications}
      {RlsConfirmation}
    </RlsContext>
  );
}
