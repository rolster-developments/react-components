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
  setNavbarInApp: (hasNavbar: boolean) => void;
  setNavbarIsCondense: (isCondense: boolean) => void;
}

export const RlsContext = createContext<RlsState>({
  confirmation: () => {
    return Promise.resolve(ConfirmationResult.approved());
  },
  snackbar: () => {},
  setNavbarInApp: () => {},
  setNavbarIsCondense: () => {}
});

export function RlsApplication({ children }: RlsComponent) {
  const { RlsConfirmation, confirmation } = useConfirmation();
  const { RlsSnackbar, snackbar } = useSnackbar();

  const [hasNavbar, setNavbarInApp] = useState(false);
  const [isNavbarCondense, setNavbarIsCondense] = useState(false);

  const className = useMemo(() => {
    return renderClassStatus('rls-app__body', {
      snackbar: hasNavbar,
      'navbar-condense': isNavbarCondense
    });
  }, [hasNavbar, isNavbarCondense]);

  return (
    <RlsContext.Provider
      value={{
        confirmation,
        snackbar,
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
