import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsAppContentComponent({
  children,
  identifier,
  rlsSize,
  rlsTheme
}: RlsComponent) {
  return (
    <div
      id={identifier}
      className="rls-app-page__content"
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      {children}
    </div>
  );
}

export const RlsAppContent = memo(RlsAppContentComponent);
