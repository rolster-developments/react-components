import { memo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';

interface RlsAlertProps extends RlsComponent {
  bordered?: boolean;
  icon?: string;
}

function RlsAlertComponent({
  bordered,
  children,
  icon,
  identifier,
  rlsTheme
}: RlsAlertProps) {
  const className = renderClassStatus('rls-alert', { bordered });

  return (
    <div id={identifier} className={className} rls-theme={rlsTheme}>
      {icon && (
        <div className="rls-alert__icon">
          <RlsIcon value={icon} />
        </div>
      )}

      <div className="rls-alert__content">{children}</div>
    </div>
  );
}

export const RlsAlert = memo(RlsAlertComponent);
