import { useRenderClassStatus } from '../../../controllers';
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import './Alert.css';

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
  return (
    <div
      id={identifier}
      className={useRenderClassStatus('rls-alert', { bordered })}
      rls-theme={rlsTheme}
    >
      {icon && (
        <div className="rls-alert__icon">
          <RlsIcon value={icon} />
        </div>
      )}

      <div className="rls-alert__content">{children}</div>
    </div>
  );
}
