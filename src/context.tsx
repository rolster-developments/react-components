import { createContext, useMemo, useState } from 'react';
import {
  ConfirmationResult,
  Confirmation,
  Snackbar,
  useConfirmation,
  useSnackbar
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
  const { RlsConfirmation, confirmation } = useConfirmation();
  const { RlsSnackbar, snackbar } = useSnackbar();

  const [_withNavbar, withNavbar] = useState(false);

  const className = useMemo(() => {
    return renderClassStatus('rls-app__body', { snackbar: _withNavbar });
  }, [_withNavbar]);

  return (
    <RlsContext.Provider value={{ confirmation, snackbar, withNavbar }}>
      <div className={className}>
        {children}
        {RlsSnackbar}
      </div>
      {RlsConfirmation}
    </RlsContext.Provider>
  );
}
