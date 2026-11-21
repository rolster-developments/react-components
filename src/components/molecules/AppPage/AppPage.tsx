import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsAppPageComponent({
  children,
  identifier,
  rlsSize,
  rlsTheme
}: RlsComponent) {
  return (
    <section
      id={identifier}
      className="rls-app-page"
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      {children}
    </section>
  );
}

export const RlsAppPage = memo(RlsAppPageComponent);
