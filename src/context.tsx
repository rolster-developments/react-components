import { createContext, useMemo, useState } from 'react';
import { RlsComponent } from './components/definitions';
import {
  Confirmation,
  ConfirmationResult,
  useConfirmation
} from './components/organisms/Confirmation/Confirmation';
import {
  Snackbar,
  useSnackbar
} from './components/organisms/Snackbar/Snackbar';
import { renderClassStatus } from './helpers/css';

interface RlsState {
  confirmation: Confirmation;
  snackbar: Snackbar;
  setIsMobile: (appIsMobile: boolean) => void;
  setNavbarInApp: (navbarInApp: boolean) => void;
  setNavbarIsCondense: (navbarIsCondense: boolean) => void;
}

export const RlsContext = createContext<RlsState>({
  confirmation: () => {
    return Promise.resolve(ConfirmationResult.approved());
  },
  snackbar: () => {},
  setIsMobile: () => {},
  setNavbarInApp: () => {},
  setNavbarIsCondense: () => {}
});

export function RlsApplication({ children }: RlsComponent) {
  const { RlsConfirmation, confirmation } = useConfirmation();
  const { RlsSnackbar, snackbar } = useSnackbar();

  const [navbarInApp, setNavbarInApp] = useState(false);
  const [navbarIsCondense, setNavbarIsCondense] = useState(false);
  const [mobileApp, setIsMobile] = useState(false);

  const className = useMemo(() => {
    return renderClassStatus('rls-app__body', {
      mobile: mobileApp,
      'navbar-snackbar': navbarInApp,
      'navbar-condense': navbarIsCondense
    });
  }, [mobileApp, navbarInApp, navbarIsCondense]);

  return (
    <RlsContext.Provider
      value={{
        confirmation,
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
      {RlsConfirmation}
    </RlsContext.Provider>
  );
}
