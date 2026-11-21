import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsNavbarBodyComponent({
  children,
  identifier,
  rlsSize,
  rlsTheme
}: RlsComponent) {
  return (
    <div
      id={identifier}
      className="rls-app-navbar__body"
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      {children}
    </div>
  );
}

export const RlsNavbarBody = memo(RlsNavbarBodyComponent);
