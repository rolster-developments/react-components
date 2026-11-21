import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsAppBodyComponent({
  children,
  identifier,
  rlsSize,
  rlsTheme
}: RlsComponent) {
  return (
    <div
      id={identifier}
      className="rls-app-page__body"
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      {children}
    </div>
  );
}

export const RlsAppBody = memo(RlsAppBodyComponent);
