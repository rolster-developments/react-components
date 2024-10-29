import { createContext, useState } from 'react';
import {
  ConfirmationResult,
  Confirmation,
  Snackbar,
  useConfirmationService,
  useSnackbarService
} from './components';
import { RlsComponent } from './components/definitions';
import { renderClassStatus } from './helpers';

interface RlsState {
  confirmation: Confirmation;
  snackbar: Snackbar;
  withNavbar: (withNavbar: boolean) => void;
}

export const RlsContext = createContext<RlsState>({
  confirmation: () => {
    return Promise.resolve(ConfirmationResult.approved());
  },
  snackbar: () => {},
  withNavbar: () => {}
});

export function RlsApplication({ children }: RlsComponent) {
  const { RlsConfirmation, confirmation } = useConfirmationService();
  const { RlsSnackbar, snackbar } = useSnackbarService();

  const [currentWithNavbar, withNavbar] = useState(false);

  return (
    <RlsContext.Provider value={{ confirmation, snackbar, withNavbar }}>
      <div
        className={renderClassStatus('rls-app__body', {
          snackbar: currentWithNavbar
        })}
      >
        {children}
        {RlsSnackbar}
      </div>
      {RlsConfirmation}
    </RlsContext.Provider>
  );
}
