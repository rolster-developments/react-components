import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsBodyComponent({ children, identifier, rlsTheme }: RlsComponent) {
  return (
    <div id={identifier} className="rls-app__page__body" rls-theme={rlsTheme}>
      {children}
    </div>
  );
}

export const RlsBody = memo(RlsBodyComponent);
