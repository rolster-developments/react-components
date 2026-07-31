import { memo, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface BadgeProps extends RlsComponent {
  contrasted?: boolean;
}

function RlsBadgeComponent({
  children,
  contrasted,
  rlsTheme
}: BadgeProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-badge', { contrasted });
  }, [contrasted]);

  return (
    <span className={className} rls-theme={rlsTheme}>
      {children}
    </span>
  );
}

export const RlsBadge = memo(RlsBadgeComponent);
