import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsLabelComponent({
  children,
  rlsTheme
}: RlsComponent) {
  return (
    <span className="rls-label" rls-theme={rlsTheme}>
      {children}
    </span>
  );
}

export const RlsLabel = memo(RlsLabelComponent);
