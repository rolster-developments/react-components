import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsAppNavbarComponent({
  children,
  identifier,
  rlsSize,
  rlsTheme
}: RlsComponent) {
  return (
    <nav
      id={identifier}
      className="rls-app-navbar"
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <div className="rls-app-navbar__content">{children}</div>

      <div className="rls-app-navbar__backdrop"></div>
    </nav>
  );
}

export const RlsAppNavbar = memo(RlsAppNavbarComponent);
