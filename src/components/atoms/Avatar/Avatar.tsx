import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './Avatar.css';

interface AvatarProps extends RlsComponent {
  contrasted?: boolean;
  rounded?: boolean;
  skeleton?: boolean;
}

export function RlsAvatar({
  children,
  contrasted,
  rounded,
  skeleton,
  rlsTheme
}: AvatarProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-avatar', { contrasted, rounded, skeleton });
  }, [contrasted, rounded, skeleton]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}
