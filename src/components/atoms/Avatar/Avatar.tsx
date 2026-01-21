import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Avatar.css';

interface AvatarProps extends RlsComponent {
  contrast?: boolean;
  rounded?: boolean;
  skeleton?: boolean;
}

export function RlsAvatar({
  children,
  contrast,
  rounded,
  skeleton,
  rlsTheme
}: AvatarProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-avatar', { contrast, rounded, skeleton });
  }, [contrast, rounded, skeleton]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}
