import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsComponent } from '../../definitions';

interface RlsAlertProps extends RlsComponent {
  icon?: string;
  bordered?: boolean;
}

export function RlsAlert({
  bordered,
  children,
  icon,
  identifier,
  rlsTheme
}: RlsAlertProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-alert', { bordered });
  }, [bordered]);

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
