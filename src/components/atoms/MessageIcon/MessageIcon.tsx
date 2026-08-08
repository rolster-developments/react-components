import { memo } from 'react';
import { RlsComponent } from '../../definitions';
import { RlsIcon } from '../Icon/Icon';

interface MessageIconProps extends RlsComponent {
  icon?: string;
}

function RlsMessageIconComponent({
  icon,
  children,
  rlsTheme
}: MessageIconProps) {
  return (
    <div className="rls-message-icon" rls-theme={rlsTheme}>
      {icon && <RlsIcon value={icon} />}
      <span className="truncate">{children}</span>
    </div>
  );
}

export const RlsMessageIcon = memo(RlsMessageIconComponent);
