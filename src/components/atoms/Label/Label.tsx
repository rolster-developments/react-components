import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsLabelComponent({ children, rlsSize, rlsTheme }: RlsComponent) {
  return (
    <span className="rls-label" rls-size={rlsSize} rls-theme={rlsTheme}>
      {children}
    </span>
  );
}

export const RlsLabel = memo(RlsLabelComponent);
