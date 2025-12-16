import { ReactNode, useCallback, useState } from 'react';

interface PortalController {
  close: () => void;
  open: (children?: ReactNode) => void;
  visible: boolean;
  children?: ReactNode;
}

export function usePortalController(component?: ReactNode): PortalController {
  const [children, setChildren] = useState<ReactNode>(component);
  const [visible, setVisible] = useState(false);

  const open = useCallback((children?: ReactNode) => {
    setVisible(true);
    children && setChildren(children);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  return { children, close, open, visible };
}
