import { useCallback, useState } from 'react';

export interface PortalController {
  close: () => void;
  open: () => void;
  visible: boolean;
}

export function usePortalController(): PortalController {
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => {
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  return { close, open, visible };
}
