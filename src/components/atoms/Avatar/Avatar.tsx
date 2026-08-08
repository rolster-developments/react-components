import { memo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface AvatarProps extends RlsComponent {
  contrasted?: boolean;
  rounded?: boolean;
  skeleton?: boolean;
  transparent?: boolean;
}

function RlsAvatarComponent({
  children,
  contrasted,
  rounded,
  skeleton,
  transparent,
  rlsTheme
}: AvatarProps) {
  const className = renderClassStatus('rls-avatar', {
    contrasted,
    rounded,
    skeleton,
    transparent
  });

  return (
    <div className={className} rls-theme={rlsTheme}>
      {children}
    </div>
  );
}

export const RlsAvatar = memo(RlsAvatarComponent);
