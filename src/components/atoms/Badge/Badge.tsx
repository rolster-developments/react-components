import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Badge.css';

interface BadgeProps extends RlsComponent {
  contrast?: boolean;
}

export function RlsBadge({ children, contrast, rlsTheme }: BadgeProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-badge', { contrast });
  }, [contrast]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}
