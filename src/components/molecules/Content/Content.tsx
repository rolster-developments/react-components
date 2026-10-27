import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsContentComponent({
  children,
  identifier,
  rlsSize,
  rlsTheme
}: RlsComponent) {
  return (
    <div
      id={identifier}
      className="rls-app__page__content"
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      {children}
    </div>
  );
}

export const RlsContent = memo(RlsContentComponent);
