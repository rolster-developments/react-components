import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Avatar.css';

interface AvatarProps extends RlsComponent {
  rounded?: boolean;
  skeleton?: boolean;
}

export function RlsAvatar({
  children,
  rounded,
  skeleton,
  rlsTheme
}: AvatarProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-avatar', { rounded, skeleton });
  }, [rounded, skeleton]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}
