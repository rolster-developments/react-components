import { useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './ProgressBar.css';

interface ProgressBarProps extends RlsComponent {
  indeterminate?: boolean;
  percentage?: number;
}

export function RlsProgressBar({
  indeterminate,
  percentage,
  rlsTheme
}: ProgressBarProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-progress-bar', { indeterminate });
  }, [indeterminate]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      <div
        className="rls-progress-bar__component"
        style={{ width: `${percentage || 0}%` }}
      ></div>
    </div>
  );
}
