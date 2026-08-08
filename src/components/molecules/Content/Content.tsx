import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsContentComponent({
  children,
  identifier,
  rlsTheme
}: RlsComponent) {
  return (
    <div
      id={identifier}
      className="rls-app__page__content"
      rls-theme={rlsTheme}
    >
      {children}
    </div>
  );
}

export const RlsContent = memo(RlsContentComponent);
