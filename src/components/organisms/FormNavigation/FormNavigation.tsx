import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './FormNavigation.css';

interface FormNavigationProps extends RlsComponent {
  visible?: boolean;
}

export function RlsFormNavigation({
  children,
  visible,
  rlsTheme
}: FormNavigationProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-form-navigation', { visible });
  }, [visible]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      <div className="rls-form-navigation__body">{children}</div>
    </div>
  );
}
