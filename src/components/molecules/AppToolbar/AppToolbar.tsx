import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsAppToolbarComponent({
  children,
  identifier,
  rlsSize,
  rlsTheme
}: RlsComponent) {
  return (
    <header
      id={identifier}
      className="rls-app-toolbar"
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      {children}
    </header>
  );
}

export const RlsAppToolbar = memo(RlsAppToolbarComponent);
