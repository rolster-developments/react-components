import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsNavbarComponent({
  children,
  identifier,
  rlsSize,
  rlsTheme
}: RlsComponent) {
  return (
    <nav
      id={identifier}
      className="rls-app__page__nav"
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <div className="rls-app__page__nav__content">{children}</div>

      <div className="rls-app__page__nav__backdrop"></div>
    </nav>
  );
}

export const RlsNavbar = memo(RlsNavbarComponent);
